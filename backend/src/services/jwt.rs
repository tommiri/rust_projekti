use crate::utils::config::Settings;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn generate_jwt(email: &str, settings: &Settings) -> String {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(settings.jwt.expiration_hours))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: email.to_string(),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(settings.jwt.secret.as_bytes()),
    )
    .expect("Failed to generate JWT")
}

pub fn validate_jwt(
    token: &str,
    settings: &Settings,
) -> Result<Claims, jsonwebtoken::errors::Error> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(settings.jwt.secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
}
