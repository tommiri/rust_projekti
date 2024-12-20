use crate::db::schema::users;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::db::schema::users)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct User {
    pub id: Vec<u8>, // BINARY(16) for UUID
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub password_hash: String,
    pub email_verified: bool,
    pub verification_token: Option<String>,
    pub verification_expires: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub email: &'a str,
    pub password_hash: &'a str,
    pub verification_token: Option<&'a str>,
    pub verification_expires: Option<NaiveDateTime>,
    pub first_name: &'a str,
    pub last_name: &'a str,
}
