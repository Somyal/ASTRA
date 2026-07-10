use crate::types::errors::AstraError;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn add_memory(
    state: State<'_, AppState>,
    category: String,
    content: String,
) -> Result<(), AstraError> {
    state.memory_service.add_memory(&category, &content).await
}
