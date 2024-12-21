use crate::services::validate_jwt;
use crate::db::DbPool;
use crate::db::schema::{users::dsl as udsl, emails::dsl as edsl};
use crate::utils::config::Settings;
use crate::utils::errors::{AppError, Result};
use crate::models::{NewEmail, Email, User};
use crate::db::schema::users;
use crate::db::schema::emails;
use handlebars::Handlebars;
use lettre::message::header;
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::AsyncSmtpTransport;
use lettre::AsyncTransport;
use lettre::Message;
use lettre::Tokio1Executor;
use serde_json::json;
use chrono::{Duration, NaiveDateTime, Utc};
use diesel::result::DatabaseErrorKind;
use diesel::prelude::*;
use diesel::QueryDsl;

pub struct EmailService {
    smtp: AsyncSmtpTransport<Tokio1Executor>,
    templates: Handlebars<'static>,
    from_email: String,
    base_url: String,
}

impl EmailService {
    pub fn new(settings: &Settings) -> Result<Self> {
        let creds = Credentials::new(
            settings.smtp.username.clone(),
            settings.smtp.password.clone(),
        );

        let smtp = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&settings.smtp.host)
            .map_err(|e| AppError::SmtpError(e))?
            .port(settings.smtp.port)
            .credentials(creds)
            .build();

        let mut templates = Handlebars::new();
        templates.register_template_string(
            "verification",
            include_str!("../../templates/verification_email.hbs"),
        )?;

        Ok(Self {
            smtp,
            templates,
            from_email: settings.smtp.from_email.clone(),
            base_url: settings.server.base_url.clone(),
        })
    }

    pub async fn send_verification_email(&self, to: &str, token: &str) -> Result<()> {
        let verify_url = format!("{}/verified/{}", self.base_url, token);

        let body = self.templates.render(
            "verification",
            &json!({
                "verify_url": verify_url,
            }),
        )?;

        let email = Message::builder()
            .from(self.from_email.parse()?)
            .to(to.parse()?)
            .subject("Verify your email")
            .header(header::ContentType::TEXT_HTML)
            .body(body)
            .map_err(|e| AppError::EmailError(e))?;

        self.smtp
            .send(email)
            .await
            .map_err(|e| AppError::SmtpError(e))?;

        Ok(())
    }
}

// Service for handling email reservation database operations
pub struct EmailRepositoryService {
    pool: DbPool,
    settings: Settings
}

impl EmailRepositoryService {

    pub fn new(pool: DbPool, settings: Settings) -> Result<Self> {
        Ok(Self {
            pool,
            settings
        })
    }

    pub fn get_email(&self, token: &str) -> Result<String> {
        let decoded_claims = validate_jwt(token, &self.settings)?;
        let user_email = &decoded_claims.sub;

        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        // Find user by their email from JWT claims
        let user = udsl::users
            .filter(udsl::email.eq(user_email))
            .first::<User>(&mut conn)?;

        // Get user's reserved email
        let email = edsl::emails
            .filter(edsl::user.eq(&user.id))
            .first::<Email>(&mut conn)
            .optional()?;

        if email.is_none() {
            return Ok(String::new());
        }

        let email = email.ok_or(AppError::InvalidReservation);
        let email = email?.email;
        Ok(email.to_string())
    }

    pub fn reserve_email(&self, token: &str, email_prefix: &str) -> Result<String> {
        let decoded_claims = validate_jwt(token, &self.settings)?;
        let user_email = &decoded_claims.sub;
        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        let user = udsl::users
            .filter(udsl::email.eq(user_email))
            .first::<User>(&mut conn)?;

        let user_id = user.id.clone();

        // Check existing reservation
        let user_existing_reservation = edsl::emails
            .filter(edsl::user.eq(&user_id))
            .first::<Email>(&mut conn)
            .optional()?;

        if user_existing_reservation.is_some() {
            return Err(AppError::EmailAlreadyReserved);
        }

        // Format full email
        let full_email = format!("{}@{}", email_prefix, self.settings.email.domain);

        // Check if email is taken
        let existing_email = edsl::emails
            .filter(edsl::email.eq(&full_email))
            .first::<Email>(&mut conn)
            .optional()?;

        if existing_email.is_some() {
            return Err(AppError::EmailTaken);
        }

        // Create new email reservation
        let new_email = NewEmail {
            user: user_id,
            email: &full_email,
        };

        diesel::insert_into(edsl::emails)
            .values(&new_email)
            .execute(&mut conn)
            .map_err(|e| match e {
                diesel::result::Error::DatabaseError(DatabaseErrorKind::UniqueViolation, _) => {
                    AppError::EmailTaken
                }
                _ => AppError::DatabaseError(e),
            })?;

        Ok(full_email)
    }

    pub fn delete_reserved_email(&self, token: &str) -> Result<()> {
        let decoded_claims = validate_jwt(token, &self.settings)?;
        let user_email = &decoded_claims.sub;

        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        // Find user by their email from JWT claims
        let user = udsl::users
            .filter(udsl::email.eq(user_email))
            .first::<User>(&mut conn)?;

        // Check if user already has a reserved email
        let user_existing_reservation = edsl::emails
            .filter(edsl::user.eq(&user.id))
            .first::<Email>(&mut conn)
            .optional()?;
        if user_existing_reservation.is_none() {
            return Err(AppError::NoReservation);
        }

        // Delete email reservation for the user
        diesel::delete(edsl::emails.filter(edsl::user.eq(&user.id)))
            .execute(&mut conn)
            .map_err(|e| AppError::DatabaseError(e))?;

        Ok(())
    }

    pub fn get_domain(&self, token: &str) -> Result<String> {
        let _decoded_claims = validate_jwt(token, &self.settings)?;
        Ok(self.settings.email.domain.clone())
    }
}