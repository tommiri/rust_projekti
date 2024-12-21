use crate::db::schema::emails;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::db::schema::emails)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Email {
    pub id: i32,
    pub user: Vec<u8>,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = emails)]
pub struct NewEmail<'a> {
    pub user: Vec<u8>,
    pub email: &'a str,
}