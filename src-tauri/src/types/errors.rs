use serde::{Serialize, Deserialize};
use thiserror::Error;

#[derive(Debug, Error, Serialize, Deserialize, Clone)]
#[serde(tag = "type", content = "message")]
pub enum AstraError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("AI provider error: {0}")]
    AIProviderError(String),
    #[error("Session error: {0}")]
    SessionError(String),
    #[error("Validation error: {0}")]
    ValidationError(String),
    #[error("System error: {0}")]
    SystemError(String),
}
