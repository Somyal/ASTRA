use std::collections::HashMap;

pub struct PromptRegistry {
    templates: HashMap<String, String>,
}

impl PromptRegistry {
    pub fn new() -> Self {
        let mut templates = HashMap::new();
        templates.insert(
            "morning_greeting".to_string(),
            "Good morning. Here is today's primary task: {task}.".to_string(),
        );
        templates.insert(
            "session_guidance".to_string(),
            "You are focused on {subject}. Keep going.".to_string(),
        );
        Self { templates }
    }

    pub fn get_template(&self, name: &str) -> Option<&String> {
        self.templates.get(name)
    }
}
