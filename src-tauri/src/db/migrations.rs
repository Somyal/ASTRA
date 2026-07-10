use crate::types::errors::AstraError;
use crate::db::Database;

pub fn run_migrations(db: &Database) -> Result<(), AstraError> {
    println!("Mock running migrations on database: {}", db.file_path);
    Ok(())
}
