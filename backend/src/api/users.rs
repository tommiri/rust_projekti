// User management routes
// Login/register routes
use crate::db::DbPool;
use crate::services::AuthService;
use crate::utils::config::Settings;
use crate::utils::errors::AppError;
use crate::services::UserService;
use crate::models::user::User;
use handlebars::Handlebars;

use rocket::request::{FromRequest, Outcome};
use rocket::{get, http::Status, post, serde::json::Json, Request};
use serde::Deserialize;

pub struct Token(String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Token {
    type Error = AppError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.headers().get_one("Authorization") {
            Some(header) => {
                if let Some(token) = header.strip_prefix("Bearer ") {
                    Outcome::Success(Token(token.to_string()))
                } else {
                    Outcome::Error((Status::Unauthorized, AppError::AuthenticationError))
                }
            }
            None => Outcome::Error((Status::Unauthorized, AppError::AuthenticationError)),
        }
    }
}

#[get("/user")]
pub async fn get_user(
    // user_id: i32,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<User>, Status> {
    // println!("Received request for user_id: {}", user_id); // Add this line for debugging

    let user_service = UserService::new(settings.inner(), Handlebars::new()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    match user_service.get_user(1).await {
        Ok(user) => Ok(Json(user)),
        Err(e) => {
            error!("Failed to get user: {}", e);
            Err(Status::InternalServerError)
        }
    }
}
// #[get("/user/<user_id>")]
// pub async fn get_user(
//     user_id: i32,
//     db: &rocket::State<DbPool>,
//     settings: &rocket::State<Settings>,
// ) -> Result<Json<User>, Status> {
//     let user_service = UserService::new(settings.inner(), Handlebars::new()).map_err(|e| {
//         error!("Failed to create UserService: {}", e);
//         Status::InternalServerError
//     })?;

//     match user_service.get_user(user_id, db).await {
//         Ok(user) => Ok(Json(user)),
//         Err(e) => {
//             error!("Failed to get user: {}", e);
//             Err(Status::InternalServerError)
//         }
//     }
// }