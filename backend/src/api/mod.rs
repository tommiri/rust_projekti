pub mod auth; // Login/register routes
pub mod catchers; // Error handling routes
pub mod emails; // Email management routes
pub mod users; // User management routes
pub mod status; // Health check route

pub use auth::{login, protected, register, verify_email};
pub use catchers::*;
pub use emails::reserve_email;
// pub use users::*;
pub use status::*;
