use crate::ai::{AIProvider, AIRequest, AIResponse};
use crate::types::AstraError;
use std::future::Future;
use std::pin::Pin;

pub struct GeminiProvider {
    pub api_key: Option<String>,
}

impl AIProvider for GeminiProvider {
    fn complete(
        &self,
        request: AIRequest,
    ) -> Pin<Box<dyn Future<Output = Result<AIResponse, AstraError>> + Send>> {
        Box::pin(async move {
            Ok(AIResponse {
                text: format!("Mock Gemini response for request: {}", request.user_message),
                provider_name: "Gemini".to_string(),
                model_version: "Gemini 2.5 Flash".to_string(),
                token_count: 120,
                memory_candidates: vec![],
            })
        })
    }

    fn name(&self) -> &str {
        "Gemini"
    }

    fn is_available(&self) -> bool {
        self.api_key.is_some()
    }
}
