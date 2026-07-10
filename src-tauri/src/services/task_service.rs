use crate::types::errors::AstraError;

pub struct TaskService;

impl TaskService {
    pub fn new() -> Self {
        Self
    }

    pub async fn create_task(&self, title: &str) -> Result<(), AstraError> {
        println!("Created task: {}", title);
        Ok(())
    }
}
