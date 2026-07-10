pub mod types;
pub mod ai;
pub mod brain;
pub mod prompts;
pub mod db;
pub mod background;
pub mod services;
pub mod commands;

use std::sync::Arc;
use crate::ai::gemini::GeminiProvider;
use crate::services::{
    SessionService, TaskService, MemoryService, BrainService,
    AIService, AnalyticsService, SettingsService, PlanningService
};

pub struct AppState {
    pub session_service: Arc<SessionService>,
    pub task_service: Arc<TaskService>,
    pub memory_service: Arc<MemoryService>,
    pub brain_service: Arc<BrainService>,
    pub ai_service: Arc<AIService>,
    pub analytics_service: Arc<AnalyticsService>,
    pub settings_service: Arc<SettingsService>,
    pub planning_service: Arc<PlanningService>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Instantiate concrete implementations of services
    let gemini_provider = GeminiProvider { api_key: None };
    let ai_service = Arc::new(AIService::new(Box::new(gemini_provider)));
    let session_service = Arc::new(SessionService::new());
    let task_service = Arc::new(TaskService::new());
    let memory_service = Arc::new(MemoryService::new());
    let brain_service = Arc::new(BrainService::new());
    let analytics_service = Arc::new(AnalyticsService::new());
    let settings_service = Arc::new(SettingsService::new());
    let planning_service = Arc::new(PlanningService::new());

    let state = AppState {
        session_service,
        task_service,
        memory_service,
        brain_service,
        ai_service,
        analytics_service,
        settings_service,
        planning_service,
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::session::start_session,
            commands::session::complete_session,
            commands::tasks::create_task,
            commands::memory::add_memory,
            commands::brain::get_brain,
            commands::settings::get_setting,
            commands::analytics::get_daily_secs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
