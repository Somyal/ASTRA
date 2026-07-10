use crate::types::errors::AstraError;
use crate::types::BrainDocument;

pub fn migrate_brain(brain: &mut BrainDocument, target_version: &str) -> Result<(), AstraError> {
    brain.schema_version = target_version.to_string();
    Ok(())
}
