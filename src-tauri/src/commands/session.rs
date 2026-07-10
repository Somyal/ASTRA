use crate::types::errors::AstraError;
use crate::types::session::{SessionRecord, SessionMode};
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn start_session(
    state: State<'_, AppState>,
    target_duration_secs: u32,
    mode: SessionMode,
) -> Result<SessionRecord, AstraError> {
    state.session_service.start(target_duration_secs, mode).await
}

#[tauri::command]
pub async fn complete_session(
    state: State<'_, AppState>,
    id: String,
) -> Result<(), AstraError> {
    state.session_service.complete(&id).await
}
