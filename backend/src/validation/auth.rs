use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct RegisterValidator {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,

    #[validate(length(min = 2, message = "First name must be at least 2 characters long"))]
    pub first_name: String,

    #[validate(length(min = 2, message = "Last name must be at least 2 characters long"))]
    pub last_name: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct LoginValidator {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,
}
