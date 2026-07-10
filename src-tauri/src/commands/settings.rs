use crate::types::errors::AstraError;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn get_setting(
    state: State<'_, AppState>,
    key: String,
) -> Result<Option<String>, AstraError> {
    state.settings_service.get_setting(&key).await
}
