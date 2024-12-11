use rocket::serde::json::Json;

#[catch(401)]
pub fn unauthorized() -> Json<String> {
    Json("Authentication required".to_string())
}

#[catch(404)]
pub fn not_found() -> Json<String> {
    Json("Resource not found".to_string())
}

#[catch(500)]
pub fn internal_error() -> Json<String> {
    Json("Internal server error".to_string())
}

#[catch(default)]
pub fn default_catcher() -> Json<String> {
    Json("Something went wrong".to_string())
}
