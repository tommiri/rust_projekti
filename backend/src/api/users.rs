// User management routes
// Login/register routes
use crate::db::DbPool;
use crate::services::AuthService;
use crate::utils::config::Settings;
use crate::utils::errors::AppError;
use crate::services::UserService;
use crate::models::user::User;
use crate::api::auth::Token;

use handlebars::Handlebars;
use rocket::{http::Status, post, request::{FromRequest, Request, Outcome}};
use serde::Deserialize;
use rocket::serde::json::{Json, Value, json};
// use rocket::request::{FromRequest, Outcome};
// use rocket::{get, http::Status, post, serde::json::Json, Request};
// use serde::Deserialize;


#[get("/user")]
pub async fn get_user(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
) -> Result<Json<User>, Status> {
    let user_service = UserService::new(db.inner().clone(), settings.inner().clone()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    match user_service.get_user_by_token(&token.0).await {
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