#[macro_use]
extern crate rocket;

mod db;
mod jwt;
mod models;
mod routes;
mod schema;

use crate::db::init_pool;
use dotenvy::dotenv;
use std::env;

#[launch]
fn rocket() -> _ {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = init_pool(&database_url);

    rocket::build().manage(db_pool).mount(
        "/",
        routes![routes::register, routes::login, routes::protected],
    )
}
