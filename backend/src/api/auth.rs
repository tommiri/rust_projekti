// Login/register routes
use crate::db::DbPool;
use crate::services::AuthService;
use crate::utils::config::Settings;
use crate::utils::errors::AppError;
use crate::validation::{LoginValidator, RegisterValidator};

use rocket::request::{FromRequest, Outcome};
use rocket::{get, http::Status, post, serde::json::Json, Request};
use serde::Serialize;
use validator::{Validate, ValidationErrors};

#[derive(Debug, Serialize)]
pub struct ValidationErrorResponse {
    pub message: String,
    pub errors: Vec<String>,
}

impl From<ValidationErrors> for ValidationErrorResponse {
    fn from(errors: ValidationErrors) -> Self {
        let error_messages: Vec<String> = errors
            .field_errors()
            .values()
            .flat_map(|errs| {
                errs.iter()
                    .map(|e| e.message.clone().unwrap_or_default().to_string())
            })
            .collect();

        Self {
            message: "Validation failed".to_string(),
            errors: error_messages,
        }
    }
}

impl From<AppError> for ValidationErrorResponse {
    fn from(error: AppError) -> Self {
        Self {
            message: error.to_string(),
            errors: vec![error.to_string()],
        }
    }
}

pub struct Token(pub String);

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
    auth: Json<RegisterValidator>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<String>, Json<ValidationErrorResponse>> {
    if let Err(errors) = auth.validate() {
        return Err(Json(ValidationErrorResponse::from(errors)));
    }

    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|e| Json(ValidationErrorResponse::from(e)))?;
    match auth_service
        .register(
            &auth.email,
            &auth.password,
            &auth.first_name,
            &auth.last_name,
        )
        .await
    {
        Ok(_) => Ok(Json("User registered successfully".to_string())),
        Err(e) => Err(Json(ValidationErrorResponse::from(e))),
    }
}

#[post("/login", data = "<auth>")]
pub async fn login(
    auth: Json<LoginValidator>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
) -> Result<Json<String>, Json<ValidationErrorResponse>> {
    if let Err(errors) = auth.validate() {
        return Err(Json(ValidationErrorResponse::from(errors)));
    }

    let auth_service = AuthService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|e| Json(ValidationErrorResponse::from(e)))?;
    match auth_service.login(&auth.email, &auth.password).await {
        Ok(token) => Ok(Json(token)),

        Err(e) => Err(Json(ValidationErrorResponse::from(e))),
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