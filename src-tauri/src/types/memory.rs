use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum MemoryTier {
    #[serde(rename = "active")]
    Active,
    #[serde(rename = "long_term")]
    LongTerm,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MemoryEntry {
    pub id: String,
    pub tier: MemoryTier,
    pub category: String,
    pub content: String,
    pub evidence: Option<String>,
    pub relevance_score: f64,
    pub created_at: String,
    pub last_accessed: String,
    pub expires_at: Option<String>,
    pub brain_section: Option<String>,
    pub is_permanent: bool,
}
