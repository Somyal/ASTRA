use crate::types::BrainDocument;

pub fn generate_summary(brain: &BrainDocument) -> String {
    format!(
        "You are Astra, a calm study companion. The current schema version is {}. This is a stub summary.",
        brain.schema_version
    )
}
