use serde::Serialize;
use rocket::{get, Response, serde::json::Json, Request, response::Responder};
use rocket::http::{Header, Status};


#[get("/health")]
pub fn health() -> Result<Json<String>, Status> {
    Ok(Json("Ok".to_string()))
}

// Global options route handler to allow CORS preflight requests
#[options("/<_..>")]
pub fn options() -> Status {
    Status::Ok
}