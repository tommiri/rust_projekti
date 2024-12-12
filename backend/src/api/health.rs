use serde::Serialize;
use rocket::{get, serde::json::Json, Request};
use rocket::http::Status;


#[get("/health")]
pub fn health() -> Result<Json<String>, Status> {
    Ok(Json("Ok".to_string()))
}