use crate::utils::config::Settings;
use crate::utils::errors::{AppError, Result};
use crate::models::user::User;
use chrono::NaiveDateTime;
use handlebars::Handlebars;

pub struct UserService {
    templates: Handlebars<'static>,
    from_email: String,
    base_url: String,
}

impl UserService {
    pub fn new(settings: &Settings, templates: Handlebars<'static>) -> Result<Self> {
        Ok(Self {
            templates,
            from_email: settings.smtp.from_email.clone(),
            base_url: settings.server.base_url.clone(),
        })
    }

    pub async fn get_user(&self, user_id: i32) -> Result<User> {
        // Create a dummy user for debugging purposes
        let dummy_user = User {
            id: generate_dummy_id(), // Generate a random UUID
            email: "dummy@example.com".to_string(),
            first_name: "Dummy".to_string(),
            last_name: "User".to_string(),
            password_hash: "dummy_hash".to_string(),
            email_verified: false,
            verification_token: Some("dummy_token".to_string()),
            verification_expires: Some(NaiveDateTime::from_timestamp(0, 0)),
            created_at: NaiveDateTime::from_timestamp(0, 0),
            updated_at: NaiveDateTime::from_timestamp(0, 0),
        };

        Ok(dummy_user)
    }
}
fn generate_dummy_id() -> Vec<u8> {
    vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
}
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