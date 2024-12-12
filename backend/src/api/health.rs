#[derive(Serialize)]
pub struct HealthStatus {
    status: &'static str,
}

#[get("/health")]
pub async fn health() -> Json<HealthStatus> {
    Json(HealthStatus { status: "OK" })
}