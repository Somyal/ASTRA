use crate::types::errors::AstraError;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_task(
    state: State<'_, AppState>,
    title: String,
) -> Result<(), AstraError> {
    state.task_service.create_task(&title).await
}
