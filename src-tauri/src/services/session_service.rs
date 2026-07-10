use crate::types::errors::AstraError;
use crate::types::session::{SessionRecord, SessionMode};

pub struct SessionService;

impl SessionService {
    pub fn new() -> Self {
        Self
    }

    pub async fn start(
        &self,
        target_duration_secs: u32,
        mode: SessionMode,
    ) -> Result<SessionRecord, AstraError> {
        Ok(SessionRecord {
            id: "mock-session-id".to_string(),
            started_at: "2026-06-30T08:35:55Z".to_string(),
            ended_at: None,
            duration_secs: None,
            target_secs: target_duration_secs,
            mode,
            subject_id: None,
            chapter: None,
            reflection_text: None,
            was_interrupted: false,
            environment_id: None,
            ai_guidance_id: None,
            day_key: "2026-06-30".to_string(),
        })
    }

    pub async fn complete(&self, id: &str) -> Result<(), AstraError> {
        println!("Completed session: {}", id);
        Ok(())
    }
}
