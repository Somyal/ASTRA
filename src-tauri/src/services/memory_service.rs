use crate::types::errors::AstraError;

pub struct MemoryService;

impl MemoryService {
    pub fn new() -> Self {
        Self
    }

    pub async fn add_memory(&self, category: &str, content: &str) -> Result<(), AstraError> {
        println!("Added memory candidate: {} - {}", category, content);
        Ok(())
    }
}
