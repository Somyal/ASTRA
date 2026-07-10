import { repositoryFactory } from '../repositories';
import { DefaultAcademicDataset } from './default_dataset';

export class SeedService {
  async seedIfEmpty(): Promise<void> {
    const syllabusRepo = repositoryFactory.getSyllabusRepository();
    const contentRepo = repositoryFactory.getContentRepository();

    // 1. Seed subjects if empty
    const subjects = await contentRepo.getSubjects();
    if (subjects.length === 0) {
      console.log('[SeedService] Seeding default subjects...');
      for (const s of DefaultAcademicDataset.subjects) {
        await contentRepo.saveSubject(s);
      }
    }

    // 2. Seed Units if empty
    const units = await syllabusRepo.getAllUnits();
    if (units.length === 0) {
      console.log('[SeedService] Seeding hierarchical units...');
      for (const u of DefaultAcademicDataset.units) {
        await syllabusRepo.saveUnit(u);
      }

      console.log('[SeedService] Seeding hierarchical chapters...');
      for (const c of DefaultAcademicDataset.chapters) {
        await syllabusRepo.saveChapter({
          id: c.id,
          name: c.name,
          unitId: c.unitId,
          sequenceOrder: c.sequenceOrder,
          lastStudiedAt: null,
        });
      }

      console.log('[SeedService] Seeding hierarchical topics...');
      for (const t of DefaultAcademicDataset.topics) {
        await syllabusRepo.saveTopic({
          id: t.id,
          name: t.name,
          chapterId: t.chapterId,
          sequenceOrder: t.sequenceOrder,
          isCompleted: false,
          completedAt: null,
        });
      }

      console.log('[SeedService] Seeding chapter dependencies...');
      for (const d of DefaultAcademicDataset.dependencies) {
        await syllabusRepo.saveDependency(d);
      }

      console.log('[SeedService] Seeding successfully complete.');
    }
  }
}

export const seedService = new SeedService();
export default seedService;
