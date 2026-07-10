pub mod gemini;
pub mod openai;
pub mod claude;
pub mod local;

use serde::{Serialize, Deserialize};
use crate::types::AstraError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIRequest {
    pub system_prompt: String,
    pub conversation_history: Vec<serde_json::Value>,
    pub user_message: String,
    pub temperature: f32,
    pub max_tokens: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIResponse {
    pub text: String,
    pub provider_name: String,
    pub model_version: String,
    pub token_count: u32,
    pub memory_candidates: Vec<String>,
}

pub trait AIProvider: Send + Sync {
    fn complete(
        &self,
        request: AIRequest,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<AIResponse, AstraError>> + Send>>;

    fn name(&self) -> &str;
    fn is_available(&self) -> bool;
}
