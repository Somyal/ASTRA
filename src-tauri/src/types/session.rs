use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum SessionMode {
    #[serde(rename = "focus")]
    Focus,
    #[serde(rename = "free")]
    Free,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SessionRecord {
    pub id: String,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub duration_secs: Option<u32>,
    pub target_secs: u32,
    pub mode: SessionMode,
    pub subject_id: Option<String>,
    pub chapter: Option<String>,
    pub reflection_text: Option<String>,
    pub was_interrupted: bool,
    pub environment_id: Option<String>,
    pub ai_guidance_id: Option<String>,
    pub day_key: String,
}
