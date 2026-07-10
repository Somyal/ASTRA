use crate::ai::{AIProvider, AIRequest, AIResponse};
use crate::types::AstraError;
use std::future::Future;
use std::pin::Pin;

pub struct LocalModelProvider;

impl AIProvider for LocalModelProvider {
    fn complete(
        &self,
        _request: AIRequest,
    ) -> Pin<Box<dyn Future<Output = Result<AIResponse, AstraError>> + Send>> {
        Box::pin(async move {
            Err(AstraError::AIProviderError("Local model provider not yet implemented".to_string()))
        })
    }

    fn name(&self) -> &str {
        "LocalOllama"
    }

    fn is_available(&self) -> bool {
        false
    }
}
