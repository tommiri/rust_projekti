use crate::db::DbPool;
use crate::utils::errors::{AppError, Result};
use crate::models::user::User;
use crate::utils::config::Settings;
use crate::services::validate_jwt;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::result::Error as DieselError;

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

    pub async fn get_user_by_token(&self, token: &str) -> Result<User> {
        // Validate the token and extract the email
        let decoded_claims = validate_jwt(token, &self.settings)?;
        let user_email = &decoded_claims.sub;

        // Query the database for the user by email
        let mut conn = self.db_pool.get().map_err(|_| AppError::InternalServerError)?;
        let user = udsl::users
            .filter(udsl::email.eq(user_email))
            .first::<User>(&mut conn)
            .map_err(AppError::from)?;

        Ok(user)
    }
}

// fn generate_dummy_id() -> Vec<u8> {
//     vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
// }
// use crate::utils::config::Settings;
// use crate::utils::errors::{AppError, Result};
// use crate::db::DbPool;
// use crate::models::user::User;
// use diesel::prelude::*;
// use handlebars::Handlebars;
// use lettre::message::header;
// use lettre::transport::smtp::authentication::Credentials;
// use lettre::transport::smtp::AsyncSmtpTransport;
// use lettre::AsyncTransport;
// use lettre::Message;
// use lettre::Tokio1Executor;
// use serde_json::json;


// pub struct UserService {
//     smtp: AsyncSmtpTransport<Tokio1Executor>,
//     templates: Handlebars<'static>,
//     from_email: String,
//     base_url: String,
// }

// impl UserService {
//     pub fn new(settings: &Settings, templates: Handlebars<'static>) -> Result<Self> {
//         let creds = Credentials::new(
//             settings.smtp.username.clone(),
//             settings.smtp.password.clone(),
//         );

//         let smtp = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&settings.smtp.host)
//             .map_err(|e| AppError::SmtpError(e))?
//             .port(settings.smtp.port)
//             .credentials(creds)
//             .build();

//         Ok(Self {
//             smtp,
//             templates,
//             from_email: settings.smtp.from_email.clone(),
//             base_url: settings.server.base_url.clone(),
//         })
//     }

//     pub async fn get_user(&self, user_id: i32, db_pool: &DbPool) -> Result<User> {
//         use crate::db::schema::users::dsl::*; // Updated import path


//         let conn = db_pool.get().map_err(|e| AppError::DbPoolError(e.to_string()))?;
//         let user = web::block(move || users.filter(id.eq(user_id)).first::<User>(&conn))
//             .await
//             .map_err(|e| AppError::DbError(e.to_string()))?;

//         Ok(user)
//     }
// }