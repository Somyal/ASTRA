use crate::types::BrainDocument;
use crate::brain::summary::generate_summary;
use std::collections::HashMap;

pub fn render_prompt(
    character_prompt: &str,
    brain: &BrainDocument,
    template: &str,
    placeholders: &HashMap<String, String>,
) -> String {
    let brain_summary = generate_summary(brain);
    let mut rendered_body = template.to_string();
    for (k, v) in placeholders {
        rendered_body = rendered_body.replace(&format!("{{{}}}", k), v);
    }

    format!(
        "System: {}\n\nBrain Context: {}\n\nInstruction: {}",
        character_prompt, brain_summary, rendered_body
    )
}
