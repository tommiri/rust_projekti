// // User management routes
// // Login/register routes
// use crate::db::DbPool;
// use crate::services::AuthService;
// use crate::utils::config::Settings;
// use crate::utils::errors::AppError;

// use rocket::request::{FromRequest, Outcome};
// use rocket::{get, http::Status, post, serde::json::Json, Request};
// use serde::Deserialize;

// pub struct Token(String);

// #[rocket::async_trait]
// impl<'r> FromRequest<'r> for Token {
//     type Error = AppError;

//     async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
//         match req.headers().get_one("Authorization") {
//             Some(header) => {
//                 if let Some(token) = header.strip_prefix("Bearer ") {
//                     Outcome::Success(Token(token.to_string()))
//                 } else {
//                     Outcome::Error((Status::Unauthorized, AppError::AuthenticationError))
//                 }
//             }
//             None => Outcome::Error((Status::Unauthorized, AppError::AuthenticationError)),
//         }
//     }
// }

// #[post("/getme", data = "<auth>")]
// pub async fn register(
//     token: Token,
//     db: &rocket::State<DbPool>,
//     settings: &rocket::State<Settings>,
// ) -> Result<Json<String>, Status> {
//     let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())?;
//     match auth_service.verify_token(&token.0) {
//         Ok(_) => {
//             Ok(Json("Access granted".to_string()))
//         }
//         Err(e) => {
//             error!("Token verification error: {}", e);
//             Err(e.into())
//         }
//     }
// }