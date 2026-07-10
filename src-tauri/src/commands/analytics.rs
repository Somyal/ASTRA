use crate::types::errors::AstraError;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn get_daily_secs(
    state: State<'_, AppState>,
    day_key: String,
) -> Result<u32, AstraError> {
    state.analytics_service.get_daily_total_secs(&day_key).await
}
