// Login/register routes
use crate::db::DbPool;
use crate::services::AuthService;
use crate::utils::config::Settings;
use crate::utils::errors::AppError;

use rocket::request::{FromRequest, Outcome};
use rocket::{get, http::Status, post, serde::json::Json, Request};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}

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

#[post("/register", data = "<auth>")]
pub async fn register(
    auth: Json<AuthRequest>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<String>, Status> {
    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())?;
    match auth_service.register(&auth.email, &auth.password).await {
        Ok(_) => Ok(Json("User registered successfully".to_string())),
        Err(e) => {
            error!("Registration error: {}", e);
            Err(e.into())
        }
    }
}

#[post("/login", data = "<auth>")]
pub async fn login(
    auth: Json<AuthRequest>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<String>, Status> {
    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())?;
    match auth_service.login(&auth.email, &auth.password).await {
        Ok(token) => Ok(Json(token)),
        Err(e) => {
            // Log error here
            println!("Login error: {}", e);
            Err(e.into())
        }
    }
}

#[get("/verify/<token>")]
pub async fn verify_email(
    token: String,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<String>, Status> {
    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())?;

    match auth_service.verify_email(&token).await {
        Ok(_) => Ok(Json("Email verified successfully".to_string())),
        Err(e) => {
            error!("Verification error: {}", e);
            Err(e.into())
        }
    }
}

#[get("/protected")]
pub async fn protected(
    token: Token,
    settings: &rocket::State<Settings>,
    db: &rocket::State<DbPool>,
) -> Result<Json<String>, Status> {
    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())?;
    match auth_service.verify_token(&token.0) {
        Ok(_) => Ok(Json("Access granted".to_string())),
        Err(e) => {
            error!("Token verification error: {}", e);
            Err(e.into())
        }
    }
}
