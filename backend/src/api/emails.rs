// Email management routes
use crate::db::DbPool;
use crate::services::EmailRepositoryService;
use crate::utils::config::Settings;
use rocket::{http::Status, post, serde::json::Json, request::{FromRequest, Request, Outcome}};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct EmailReservationRequest {
    pub email: String,
}

// Custom guard for Authorization header
struct AuthToken(String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthToken {
    type Error = Status;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match request.headers().get_one("Authorization") {
            Some(auth) => {
                match auth.strip_prefix("Bearer ") {
                    Some(token) => Outcome::Success(AuthToken(token.to_string())),
                    None => Outcome::Forward(Status::Unauthorized)
                }
            },
            None => Outcome::Forward(Status::Unauthorized)
        }
    }
}

#[post("/email", data = "<request>")]
pub async fn reserve_email(
    request: Json<EmailReservationRequest>,
    db: &rocket::State<DbPool>,
    settings: &rocket::State<Settings>,
    auth_token: AuthToken,
) -> Result<Json<String>, Status> {
    let service = EmailRepositoryService::new(db.inner().clone(), settings.inner().clone())
        .map_err(|_| Status::InternalServerError)?;

    // Try to reserve the email
    match service.reserve_email(&auth_token.0, &request.email) {
        Ok(_) => Ok(Json("Email reserved successfully".to_string())),
        Err(e) => {
            println!("Email reserving error: {}", e);
            Err(e.into())
        }
    }
}