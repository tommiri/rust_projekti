use rocket::{get, serde::json::Json};
use rocket::http::Status;


#[get("/health")]
pub fn health() -> Result<Json<String>, Status> {
    Ok(Json("Ok".to_string()))
}

// Global options route handler to allow CORS preflight requests
#[options("/<_..>")]
pub fn options() -> Status {
    Status::Ok
}