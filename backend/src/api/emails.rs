// Email management routes
use crate::db::DbPool;
use crate::services::EmailRepositoryService;
use crate::utils::config::Settings;
use crate::api::auth::Token;
use rocket::{http::Status, post, request::{FromRequest, Request, Outcome}};
use serde::Deserialize;
use rocket::serde::json::{Json, Value, json};


#[derive(Deserialize)]
pub struct EmailReservationRequest {
    pub email: String,
}

#[get("/email")]
pub async fn get_email(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
) -> Result<Json<String>, Status> {
    let service = EmailRepositoryService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|_| Status::InternalServerError)?;

    match service.get_email(&token.0) {
        Ok(email) => Ok(Json(email)),
        Err(e) => {
            println!("Email fetching error: {}", e);
            Err(e.into())
        }
    }
}

#[post("/email", data = "<request>")]
pub async fn reserve_email(
    request: Json<EmailReservationRequest>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
) -> Result<Json<Value>, Status> {  // Changed return type to Json<Value>
    let service = EmailRepositoryService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|_| Status::InternalServerError)?;

    match service.reserve_email(&token.0, &request.email) {
        Ok(email) => Ok(Json(json!({
            "email": email,
            "message": "Email reserved successfully"
        }))),
        Err(e) => {
            println!("Email reserving error: {}", e);
            Err(e.into())
        }
    }
}

#[delete("/email")]
pub async fn delete_email(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
) -> Result<Json<String>, Status> {
    let service = EmailRepositoryService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|_| Status::InternalServerError)?;

    match service.delete_reserved_email(&token.0) {
        Ok(_) => Ok(Json("Email deleted successfully".to_string())),
        Err(e) => {
            println!("Email deletion error: {}", e);
            Err(e.into())
        }
    }
}

#[get("/domain")]
pub async fn get_domain(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token
) -> Result<Json<String>, Status> {
    let service = EmailRepositoryService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|_| Status::InternalServerError)?;

    match service.get_domain(&token.0) {
        Ok(domain) => Ok(Json(domain)),
        Err(e) => {
            println!("Domain fetching error: {}", e);
            Err(e.into())
        }
    }
}