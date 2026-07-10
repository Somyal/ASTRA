pub mod summary;
pub mod migration;

use crate::types::BrainDocument;

pub struct AstraBrain {
    pub current: BrainDocument,
}
