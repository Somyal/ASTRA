use crate::types::errors::AstraError;

pub struct SettingsService;

impl SettingsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_setting(&self, _key: &str) -> Result<Option<String>, AstraError> {
        Ok(None)
    }
}
