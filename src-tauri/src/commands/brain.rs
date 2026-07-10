use crate::types::errors::AstraError;
use crate::types::BrainDocument;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn get_brain(
    state: State<'_, AppState>,
) -> Result<BrainDocument, AstraError> {
    state.brain_service.get_brain().await
}
