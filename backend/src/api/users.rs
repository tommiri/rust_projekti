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
use rocket::{http::Status, post, put, request::{FromRequest, Request, Outcome}};
use serde::Deserialize;
use rocket::serde::json::{Json, Value, json};
// use rocket::request::{FromRequest, Outcome};
// use rocket::{get, http::Status, post, serde::json::Json, Request};
// use serde::Deserialize;

#[derive(Deserialize)]
struct UpdateField {
    email: Option<String>,
    password: Option<String>,
    #[serde(alias = "first_name", alias = "firstname")]
    first_name: Option<String>,
    #[serde(alias = "last_name", alias = "lastname")]
    last_name: Option<String>,
}

#[get("/profiledata")]
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

#[put("/email", data = "<update_field>")]
pub async fn update_email(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
    update_field: Json<UpdateField>,
) -> Result<Status, Status> {
    let user_service = UserService::new(db.inner().clone(), settings.inner().clone()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    if let Some(new_email) = &update_field.email {
        user_service.update_email_by_token(&token.0, new_email).await.map_err(|e| {
            error!("Failed to update email: {}", e);
            Status::InternalServerError
        })?;
    }

    Ok(Status::Ok)
}

#[put("/password", data = "<update_field>")]
pub async fn update_password(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
    update_field: Json<UpdateField>,
) -> Result<Status, Status> {
    let user_service = UserService::new(db.inner().clone(), settings.inner().clone()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    if let Some(new_password) = &update_field.password {
        user_service.update_password_by_token(&token.0, new_password).await.map_err(|e| {
            error!("Failed to update password: {}", e);
            Status::InternalServerError
        })?;
    }

    Ok(Status::Ok)
}

#[put("/firstname", data = "<update_field>")]
pub async fn update_first_name(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
    update_field: Json<UpdateField>,
) -> Result<Status, Status> {
    let user_service = UserService::new(db.inner().clone(), settings.inner().clone()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    if let Some(new_first_name) = &update_field.first_name {
        user_service.update_first_name_by_token(&token.0, new_first_name).await.map_err(|e| {
            error!("Failed to update first name: {}", e);
            Status::InternalServerError
        })?;
    }

    Ok(Status::Ok)
}

#[put("/lastname", data = "<update_field>")]
pub async fn update_last_name(
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    token: Token,
    update_field: Json<UpdateField>,
) -> Result<Status, Status> {
    let user_service = UserService::new(db.inner().clone(), settings.inner().clone()).map_err(|e| {
        error!("Failed to create UserService: {}", e);
        Status::InternalServerError
    })?;

    if let Some(new_last_name) = &update_field.last_name {
        user_service.update_last_name_by_token(&token.0, new_last_name).await.map_err(|e| {
            error!("Failed to update last name: {}", e);
            Status::InternalServerError
        })?;
    }

    Ok(Status::Ok)
}