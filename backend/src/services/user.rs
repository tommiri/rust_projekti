use crate::db::DbPool;
use crate::utils::errors::{AppError, Result};
use crate::models::user::User;
use crate::utils::config::Settings;
use crate::services::validate_jwt;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::result::Error as DieselError;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use argon2::{password_hash::{rand_core::OsRng, SaltString, PasswordHasher}, Argon2};
use regex::Regex;

use crate::db::schema::{users::dsl as udsl};
use crate::db::schema::users;

pub struct UserService {
    db_pool: DbPool,
    settings: Settings,
}

impl UserService {
    pub fn new(db_pool: DbPool, settings: Settings) -> Result<Self> {
        Ok(Self {
            db_pool,
            settings,
        })
    }

    fn get_user_email_and_conn(&self, token: &str) -> Result<(String, PooledConnection<ConnectionManager<MysqlConnection>>)> {
        let decoded_claims = validate_jwt(token, &self.settings)?;
        let user_email = decoded_claims.sub;

        let conn = self.db_pool.get().map_err(|_| AppError::InternalServerError)?;
        Ok((user_email, conn))
    }

    fn validate_email_prefix(&self, email_prefix: &str) -> Result<()> {
        // Check length
        if email_prefix.is_empty() {
            return Err(AppError::InvalidEmailFormat("Email prefix is required".to_string()));
        }
        if email_prefix.len() > 64 {
            return Err(AppError::InvalidEmailFormat("Email prefix too long".to_string()));
        }

        // Check regex pattern
        let re = Regex::new(r"^[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]+)*$")
            .map_err(|_| AppError::InternalServerError)?;
        if !re.is_match(email_prefix) {
            return Err(AppError::InvalidEmailFormat("Invalid characters in email prefix".to_string()));
        }

        // Check specific rules
        if email_prefix.starts_with('.') {
            return Err(AppError::InvalidEmailFormat("Email prefix cannot start with a dot".to_string()));
        }
        if email_prefix.ends_with('.') {
            return Err(AppError::InvalidEmailFormat("Email prefix cannot end with a dot".to_string()));
        }
        if email_prefix.contains("..") {
            return Err(AppError::InvalidEmailFormat("Email prefix cannot contain consecutive dots".to_string()));
        }

        Ok(())
    }

    pub async fn get_user_by_token(&self, token: &str) -> Result<User> {
        let (user_email, mut conn) = self.get_user_email_and_conn(token)?;

        let user = udsl::users
            .filter(udsl::email.eq(user_email))
            .first::<User>(&mut conn)
            .map_err(AppError::from)?;

        Ok(user)
    }

    pub async fn update_email_by_token(&self, token: &str, new_email: &str) -> Result<()> {
        // Validate email prefix
        // Validate email format
        if !new_email.contains('@') {
            return Err(AppError::InvalidEmailFormat("Email must contain '@'".to_string()));
        }
        println!("new_email: {}", new_email);
        let email_prefix = new_email.split('@').next().ok_or(AppError::InvalidEmailFormat("Invalid email format".to_string()))?;
        self.validate_email_prefix(email_prefix)?;

        let (user_email, mut conn) = self.get_user_email_and_conn(token)?;

        diesel::update(udsl::users.filter(udsl::email.eq(user_email)))
            .set(udsl::email.eq(new_email))
            .execute(&mut conn)
            .map_err(AppError::from)?;

        Ok(())
    }

    pub async fn update_password_by_token(&self, token: &str, new_password: &str) -> Result<()> {
        let (user_email, mut conn) = self.get_user_email_and_conn(token)?;

        // Generate password hash
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let pass_hash = argon2
            .hash_password(new_password.as_bytes(), &salt)
            .map_err(|e| AppError::PasswordHashError(e.to_string()))?
            .to_string();

        diesel::update(udsl::users.filter(udsl::email.eq(user_email)))
            .set(udsl::password_hash.eq(pass_hash))
            .execute(&mut conn)
            .map_err(AppError::from)?;

        Ok(())
    }

    pub async fn update_first_name_by_token(&self, token: &str, new_first_name: &str) -> Result<()> {
        let (user_email, mut conn) = self.get_user_email_and_conn(token)?;

        diesel::update(udsl::users.filter(udsl::email.eq(user_email)))
            .set(udsl::first_name.eq(new_first_name))
            .execute(&mut conn)
            .map_err(AppError::from)?;

        Ok(())
    }

    pub async fn update_last_name_by_token(&self, token: &str, new_last_name: &str) -> Result<()> {
        let (user_email, mut conn) = self.get_user_email_and_conn(token)?;

        diesel::update(udsl::users.filter(udsl::email.eq(user_email)))
            .set(udsl::last_name.eq(new_last_name))
            .execute(&mut conn)
            .map_err(AppError::from)?;

        Ok(())
    }
}