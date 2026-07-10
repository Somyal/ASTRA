use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BrainDocument {
    pub schema_version: String,
    pub identity: serde_json::Value,
    pub student_profile: serde_json::Value,
    pub study_rhythm: serde_json::Value,
    pub subject_map: serde_json::Value,
    pub personality_model: serde_json::Value,
    pub current_context: serde_json::Value,
    pub emotional_history: serde_json::Value,
    pub relationship_notes: serde_json::Value,
    pub narrative_threads: serde_json::Value,
    pub updated_at: String,
}
