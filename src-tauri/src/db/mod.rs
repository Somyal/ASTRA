pub mod migrations;

pub struct Database {
    pub file_path: String,
}

impl Database {
    pub fn new(file_path: &str) -> Self {
        Self {
            file_path: file_path.to_string(),
        }
    }
}
