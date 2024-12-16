use crate::utils::config::Settings;
use crate::utils::errors::{AppError, Result};
use handlebars::Handlebars;
use lettre::message::header;
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::AsyncSmtpTransport;
use lettre::AsyncTransport;
use lettre::Message;
use lettre::Tokio1Executor;
use serde_json::json;

pub struct EmailService {
    smtp: AsyncSmtpTransport<Tokio1Executor>,
    templates: Handlebars<'static>,
    from_email: String,
    base_url: String,
}

impl EmailService {
    pub fn new(settings: &Settings) -> Result<Self> {
        let creds = Credentials::new(
            settings.smtp.username.clone(),
            settings.smtp.password.clone(),
        );

        let smtp = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&settings.smtp.host)
            .map_err(|e| AppError::SmtpError(e))?
            .port(settings.smtp.port)
            .credentials(creds)
            .build();

        let mut templates = Handlebars::new();
        templates.register_template_string(
            "verification",
            include_str!("../../templates/verification_email.hbs"),
        )?;

        Ok(Self {
            smtp,
            templates,
            from_email: settings.smtp.from_email.clone(),
            base_url: settings.server.base_url.clone(),
        })
    }

    pub async fn send_verification_email(&self, to: &str, token: &str) -> Result<()> {
        let verify_url = format!("{}/verified/{}", self.base_url, token);

        let body = self.templates.render(
            "verification",
            &json!({
                "verify_url": verify_url,
            }),
        )?;

        let email = Message::builder()
            .from(self.from_email.parse()?)
            .to(to.parse()?)
            .subject("Verify your email")
            .header(header::ContentType::TEXT_HTML)
            .body(body)
            .map_err(|e| AppError::EmailError(e))?;

        self.smtp
            .send(email)
            .await
            .map_err(|e| AppError::SmtpError(e))?;

        Ok(())
    }
}
