pub mod models;
pub mod schema;

use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub fn establish_connection() -> MysqlConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connection to {}", database_url))
}

use self::models::{NewUser, User};

pub fn get_user_by_email(conn: &mut MysqlConnection, user_email: &str) -> Option<User> {
    use crate::schema::users::dsl::*;

    users
        .filter(email.eq(user_email))
        .select(User::as_select())
        .first(conn)
        .optional()
        .expect("Error loading post")
}
