use crate::db::schema::users::dsl;
use crate::db::DbPool;
use crate::models::{NewUser, User};
use crate::services::email::EmailService;
use crate::services::jwt::{generate_jwt, validate_jwt};
use crate::utils::config::Settings;
use crate::utils::errors::{AppError, Result};

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{Duration, NaiveDateTime, Utc};
use diesel::prelude::*;
use rand::{distributions::Alphanumeric, Rng};

pub struct AuthService {
    pool: DbPool,
    settings: Settings,
    email_service: EmailService,
}

impl AuthService {
    pub fn new(pool: DbPool, settings: Settings) -> Result<Self> {
        let email_service = EmailService::new(&settings)?;
        Ok(Self {
            pool,
            settings,
            email_service,
        })
    }

    pub async fn register(&self, email: &str, password: &str) -> Result<()> {
        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        // Generate password hash
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let pass_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| AppError::PasswordHashError(e.to_string()))?
            .to_string();

        // Generate verification token
        let verification_token: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(32)
            .map(char::from)
            .collect();

        let expires = Utc::now().naive_utc() + Duration::hours(24);

        let new_user = NewUser {
            email,
            password_hash: &pass_hash,
            verification_token: Some(&verification_token),
            verification_expires: Some(expires),
        };

        diesel::insert_into(dsl::users)
            .values(&new_user)
            .execute(&mut conn)
            .map_err(|e| match e {
                diesel::result::Error::DatabaseError(
                    diesel::result::DatabaseErrorKind::UniqueViolation,
                    _,
                ) => AppError::EmailTaken,
                _ => AppError::DatabaseError(e),
            })?;

        // Send verification email
        self.email_service
            .send_verification_email(email, &verification_token)
            .await?;
        Ok(())
    }

    pub async fn verify_email(&self, token: &str) -> Result<()> {
        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        // Find user with valid non-expired token
        let user = dsl::users
            .filter(dsl::verification_token.eq(Some(token)))
            .filter(dsl::verification_expires.gt(Some(Utc::now().naive_utc())))
            .first::<User>(&mut conn)?;
        // .map_err(|e| match e {
        //     diesel::result::Error::NotFound => AppError::InvalidToken,
        //     _ => AppError::DatabaseError(e),
        // })?;

        // Update user verification status
        diesel::update(dsl::users.find(user.id))
            .set((
                dsl::email_verified.eq(true),
                dsl::verification_token.eq::<Option<String>>(None),
                dsl::verification_expires.eq::<Option<NaiveDateTime>>(None),
            ))
            .execute(&mut conn)
            .map_err(AppError::DatabaseError)?;

        Ok(())
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<String> {
        let mut conn = self.pool.get().map_err(|_| AppError::InternalServerError)?;

        let user = dsl::users
            .filter(dsl::email.eq(email))
            .first::<User>(&mut conn)
            .map_err(|_| AppError::AuthenticationError)?;

        // Check email verification
        if !user.email_verified {
            return Err(AppError::EmailNotVerified);
        }

        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|e| AppError::PasswordHashError(e.to_string()))?;

        if Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok()
        {
            let token = generate_jwt(email, &self.settings);
            Ok(token)
        } else {
            Err(AppError::AuthenticationError)
        }
    }

    pub fn verify_token(&self, token: &str) -> Result<()> {
        
        validate_jwt(token, &self.settings)
            .map(|_| ())
            .map_err(AppError::InvalidToken)
    }
}
