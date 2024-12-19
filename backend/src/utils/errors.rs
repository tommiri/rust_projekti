use rocket::http::Status;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Authentication failed")]
    AuthenticationError,

    #[error("Database error: {0}")]
    DatabaseError(#[from] diesel::result::Error),

    #[error("Invalid token")]
    InvalidToken(#[from] jsonwebtoken::errors::Error),

    #[error("Password hash error: {0}")]
    PasswordHashError(String),

    #[error("Configuration error: {0}")]
    ConfigError(#[from] config::ConfigError),

    #[error("Email not verified")]
    EmailNotVerified,

    #[error("Verification expired")]
    VerificationExpired,

    #[error("Email taken")]
    EmailTaken,

    #[error("Email already reserved")]
    EmailAlreadyReserved,

    #[error("No email reservation found")]
    NoReservation,

    #[error("Invalid email prefix")]
    InvalidEmailPrefix,

    #[error("SMTP error: {0}")]
    SmtpError(lettre::transport::smtp::Error),

    #[error("Email error: {0}")]
    EmailError(lettre::error::Error),

    #[error("Render error: {0}")]
    RenderError(handlebars::RenderError),

    #[error("Template error: {0}")]
    TemplateError(handlebars::TemplateError),

    #[error("Address parse error: {0}")]
    AddressParseError(lettre::address::AddressError),

    #[error("Internal server error")]
    InternalServerError,
}

impl From<lettre::transport::smtp::Error> for AppError {
    fn from(err: lettre::transport::smtp::Error) -> Self {
        Self::SmtpError(err)
    }
}

impl From<handlebars::RenderError> for AppError {
    fn from(err: handlebars::RenderError) -> Self {
        Self::RenderError(err)
    }
}

impl From<handlebars::TemplateError> for AppError {
    fn from(err: handlebars::TemplateError) -> Self {
        Self::TemplateError(err)
    }
}

impl From<lettre::address::AddressError> for AppError {
    fn from(err: lettre::address::AddressError) -> Self {
        Self::AddressParseError(err)
    }
}

impl From<lettre::error::Error> for AppError {
    fn from(err: lettre::error::Error) -> Self {
        Self::EmailError(err)
    }
}

impl From<AppError> for Status {
    fn from(error: AppError) -> Self {
        match error {
            AppError::AuthenticationError => Status::Unauthorized,
            AppError::DatabaseError(_) => Status::InternalServerError,
            AppError::InvalidToken(_) => Status::Unauthorized,
            AppError::EmailTaken => Status::Conflict,
            AppError::EmailAlreadyReserved => Status::Conflict,
            AppError::NoReservation => Status::NotFound,
            AppError::InvalidEmailPrefix => Status::BadRequest,
            AppError::PasswordHashError(_) => Status::InternalServerError,
            AppError::ConfigError(_) => Status::InternalServerError,
            AppError::InternalServerError => Status::InternalServerError,
            AppError::EmailNotVerified => Status::Unauthorized,
            AppError::VerificationExpired => Status::Unauthorized,
            AppError::SmtpError(_) => Status::InternalServerError,
            AppError::TemplateError(_) => Status::InternalServerError,
            AppError::AddressParseError(_) => Status::InternalServerError,
            AppError::RenderError(_) => Status::InternalServerError,
            AppError::EmailError(_) => Status::InternalServerError,
        }
    }
}

pub type Result<T> = std::result::Result<T, AppError>;
