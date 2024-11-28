use crate::schema::users;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct User {
    pub id: String,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub password_hash: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::emails)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Email {
    pub id: i32,
    pub user: String,
    pub email: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub id: &'a str,
    pub email: &'a str,
    pub password_hash: &'a str,
}
