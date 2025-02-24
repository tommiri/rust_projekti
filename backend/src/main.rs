#[macro_use]
extern crate rocket;

mod api;
mod db;
mod models;
mod services;
mod utils;
mod validation;

use crate::db::init_pool;
use crate::utils::config::Settings;
use crate::utils::cors::cors_fairing;
use rocket::config::Config as RocketConfig;


#[launch]
fn rocket() -> _ {
    // Load settings
    let settings = Settings::new().expect("Failed to load settings");

    // Initialize database pool
    let db_pool = init_pool(&settings.database.url);

    // Configure Rocket - use references to avoid moves
    let config = RocketConfig::figment()
        .merge(("port", settings.server.port))
        .merge(("address", settings.server.address.as_str()));

    rocket::custom(config)
        .manage(db_pool)
        .manage(settings)
        .attach(cors_fairing())
        .mount(
            "/api",
            routes![
                api::health,
                api::options,
                api::register,
                api::get_user,
                api::login,
                api::verify_email,
                api::get_email,
                api::reserve_email,
                api::delete_email,
                api::protected,
                api::get_domain,
                ],
        )
        .register(
            "/",
            catchers![
                api::unauthorized,
                api::not_found,
                api::internal_error,
                api::default_catcher
            ],
        )
}
