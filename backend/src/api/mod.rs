pub mod auth; // Login/register routes
pub mod catchers; // Error handling routes
pub mod emails; // Email management routes
pub mod users; // User management routes
pub mod status; // Health check route

pub use auth::{login, protected, register, verify_email, Token};
pub use catchers::*;
pub use emails::{reserve_email, delete_email, get_domain};
// pub use users::*;
pub use status::*;
