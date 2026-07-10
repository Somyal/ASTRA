use crate::types::errors::AstraError;
use crate::ai::{AIProvider, AIRequest};

pub struct AIService {
    pub provider: Box<dyn AIProvider>,
}

impl AIService {
    pub fn new(provider: Box<dyn AIProvider>) -> Self {
        Self { provider }
    }

    pub async fn query_ai(&self, prompt: &str) -> Result<String, AstraError> {
        let req = AIRequest {
            system_prompt: "You are Astra, a calm study companion.".to_string(),
            conversation_history: vec![],
            user_message: prompt.to_string(),
            temperature: 0.7,
            max_tokens: 150,
        };
        let response = self.provider.complete(req).await?;
        Ok(response.text)
    }
}
