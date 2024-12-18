use diesel::mysql::MysqlConnection;
use diesel::r2d2::{self, ConnectionManager};

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub fn init_pool(database_url: &str) -> DbPool {
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .max_size(15) // Maximum connections
        .min_idle(Some(5)) // Minimum idle connections
        .connection_timeout(std::time::Duration::from_secs(10)) // Connection timeout
        .idle_timeout(Some(std::time::Duration::from_secs(300))) // Idle timeout
        .max_lifetime(Some(std::time::Duration::from_secs(3600))) // Max connection lifetime
        .build(manager)
        .expect("Failed to create pool")
}
