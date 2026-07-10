use crate::ai::{AIProvider, AIRequest, AIResponse};
use crate::types::AstraError;
use std::future::Future;
use std::pin::Pin;

pub struct OpenAIProvider;

impl AIProvider for OpenAIProvider {
    fn complete(
        &self,
        _request: AIRequest,
    ) -> Pin<Box<dyn Future<Output = Result<AIResponse, AstraError>> + Send>> {
        Box::pin(async move {
            Err(AstraError::AIProviderError("OpenAI provider not yet implemented".to_string()))
        })
    }

    fn name(&self) -> &str {
        "OpenAI"
    }

    fn is_available(&self) -> bool {
        false
    }
}
