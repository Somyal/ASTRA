use crate::types::errors::AstraError;

pub struct AnalyticsService;

impl AnalyticsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_daily_total_secs(&self, _day_key: &str) -> Result<u32, AstraError> {
        Ok(3600)
    }
}
