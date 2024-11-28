use crate::db::DbPool;
use crate::jwt::{generate_jwt, validate_jwt};
use crate::models::{NewUser, User};
use crate::schema::users::dsl::*;
use bcrypt::{hash, verify};
use diesel::prelude::*;
use rocket::{get, http::Status, post, serde::json::Json};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}

#[post("/register", data = "<auth>")]
pub async fn register(
    auth: Json<AuthRequest>,
    db: &rocket::State<DbPool>,
) -> Result<&'static str, Status> {
    let mut conn = db.inner().get().map_err(|_| Status::InternalServerError)?;

    let pass_hash = hash(&auth.password, 4).map_err(|_| Status::InternalServerError)?;

    let user_id = Uuid::new_v4().to_string();
    let new_user = NewUser {
        id: &user_id,
        email: &auth.email,
        password_hash: &pass_hash,
    };

    diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn)
        .map_err(|_| Status::Conflict)?;

    Ok("User registered successfully")
}

#[post("/login", data = "<auth>")]
pub async fn login(
    auth: Json<AuthRequest>,
    db: &rocket::State<DbPool>,
) -> Result<Json<String>, Status> {
    let mut conn = db.get().map_err(|_| Status::InternalServerError)?;

    let user: User = users
        .filter(email.eq(&auth.email))
        .first(&mut conn)
        .map_err(|_| Status::Unauthorized)?;

    if verify(&auth.password, &user.password_hash).map_err(|_| Status::InternalServerError)? {
        let token = generate_jwt(&user.email);
        Ok(Json(token))
    } else {
        Err(Status::Unauthorized)
    }
}

use rocket::request::Outcome;
use rocket::request::{FromRequest, Request}; // Optional, if you need to use it elsewhere

pub struct Token(String);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Token {
    type Error = Status;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        if let Some(token) = req.headers().get_one("Authorization") {
            Outcome::Success(Token(token.to_string()))
        } else {
            Outcome::Error((Status::Unauthorized, Status::Unauthorized))
        }
    }
}

#[get("/protected")]
pub async fn protected(token: Token) -> Result<&'static str, Status> {
    validate_jwt(&token.0).map_err(|_| Status::Unauthorized)?;
    Ok("Access granted")
}
