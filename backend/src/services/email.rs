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

    pub fn reserve_email(&self, token: &str, email: &str) -> Result<()> {

        let decoded_claims = validate_jwt(token, &self.settings)?;

        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        // Find user with valid non-expired token
        let user = udsl::users
            .filter(udsl::verification_token.eq(Some(token)))
            .filter(udsl::verification_expires.gt(Some(Utc::now().naive_utc())))
            .first::<User>(&mut conn)?;


        // Check if email is already taken
        let existing_email = emails::table
            .filter(emails::email.eq(email)) // Use email directly as &str
            .first::<Email>(&mut conn)
            .optional()?;

        if existing_email.is_some() {
            return Err(AppError::EmailTaken);
        }

        // Create new email reservation
        let new_email = NewEmail {
            user: user.id,
            email,
        };

        diesel::insert_into(edsl::emails)
            .values(&new_email)
            .execute(&mut conn)
            .map_err(|e| match e {
                diesel::result::Error::DatabaseError(
                    DatabaseErrorKind::UniqueViolation,
                     _
                ) => AppError::EmailTaken,
                _ => AppError::DatabaseError(e),
            })?;

        // Fetch and return the newly inserted email
        Ok(())
    }

}