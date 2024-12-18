use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::db::schema::emails)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Email {
    pub id: i32,
    pub user: Vec<u8>,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
