import { repositoryFactory } from '../repositories';
import {
  SyllabusUnit,
  SyllabusChapter,
  SyllabusTopic
} from '../repositories/syllabus.repository';
import { Subject } from '../store/content.store';

export type ChapterStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'revision_due';

export interface SubjectTree {
  subject: Subject;
  progress: number;
  units: {
    unit: SyllabusUnit;
    chapters: {
      chapter: SyllabusChapter;
      status: ChapterStatus;
      progress: number;
      topics: SyllabusTopic[];
    }[];
  }[];
}

export interface IRevisionPolicy {
  isRevisionDue(chapter: SyllabusChapter, topics: SyllabusTopic[]): boolean;
}

export class DefaultRevisionPolicy implements IRevisionPolicy {
  isRevisionDue(chapter: SyllabusChapter, topics: SyllabusTopic[]): boolean {
    if (!chapter.lastStudiedAt) return false;
    const allCompleted = topics.length > 0 && topics.every(t => t.isCompleted);
    if (!allCompleted) return false;

    const studyTime = Date.parse(chapter.lastStudiedAt);
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (studyTime + sevenDaysInMs) <= Date.now();
  }
}

export class SyllabusService {
  private revisionPolicy: IRevisionPolicy = new DefaultRevisionPolicy();

  setRevisionPolicy(policy: IRevisionPolicy) {
    this.revisionPolicy = policy;
  }

  async getSyllabusTree(): Promise<SubjectTree[]> {
    const syllabusRepo = repositoryFactory.getSyllabusRepository();
    const contentRepo = repositoryFactory.getContentRepository();

    const subjects = await contentRepo.getSubjects();
    const units = await syllabusRepo.getAllUnits();
    const chapters = await syllabusRepo.getAllChapters();
    const topics = await syllabusRepo.getAllTopics();
    const dependencies = await syllabusRepo.getDependencies();

    const tree: SubjectTree[] = [];

    for (const sub of subjects) {
      const subUnits = units.filter(u => u.subjectId === sub.id);
      const unitsNode: SubjectTree['units'] = [];

      let totalSubjectTopics = 0;
      let completedSubjectTopics = 0;

      for (const u of subUnits) {
        const uChapters = chapters.filter(c => c.unitId === u.id);
        const chaptersNode: SubjectTree['units'][0]['chapters'] = [];

        for (const c of uChapters) {
          const cTopics = topics.filter(t => t.chapterId === c.id);
          totalSubjectTopics += cTopics.length;

          const completedTopicsCount = cTopics.filter(t => t.isCompleted).length;
          completedSubjectTopics += completedTopicsCount;

          const progress = cTopics.length > 0 ? (completedTopicsCount / cTopics.length) * 100 : 0;

          // Compute status
          let status: ChapterStatus;

          const prereqs = dependencies.filter(d => d.chapterId === c.id);
          const hasLockedPrereq = prereqs.some(p => {
            const reqChapterTopics = topics.filter(t => t.chapterId === p.prerequisiteChapterId);
            return reqChapterTopics.length === 0 || reqChapterTopics.some(t => !t.isCompleted);
          });

          if (hasLockedPrereq) {
            status = 'locked';
          } else {
            const allCompleted = cTopics.length > 0 && cTopics.every(t => t.isCompleted);
            if (allCompleted) {
              if (this.revisionPolicy.isRevisionDue(c, cTopics)) {
                status = 'revision_due';
              } else {
                status = 'completed';
              }
            } else {
              const anyStarted = cTopics.some(t => t.isCompleted);
              status = anyStarted ? 'in_progress' : 'available';
            }
          }

          chaptersNode.push({
            chapter: c,
            status,
            progress,
            topics: cTopics,
          });
        }

        unitsNode.push({
          unit: u,
          chapters: chaptersNode,
        });
      }

      const subjectProgress = totalSubjectTopics > 0 ? (completedSubjectTopics / totalSubjectTopics) * 100 : 0;

      tree.push({
        subject: sub,
        progress: subjectProgress,
        units: unitsNode,
      });
    }

    return tree;
  }

  async toggleTopicCompletion(topicId: string): Promise<void> {
    const repo = repositoryFactory.getSyllabusRepository();
    const topics = await repo.getAllTopics();
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      const isCompleting = !topic.isCompleted;
      topic.isCompleted = isCompleting;
      topic.completedAt = isCompleting ? new Date().toISOString() : null;
      await repo.saveTopic(topic);

      // Reset parent chapter studied time on completion
      const chapters = await repo.getAllChapters();
      const chapter = chapters.find(c => c.id === topic.chapterId);
      if (chapter && isCompleting) {
        chapter.lastStudiedAt = new Date().toISOString();
        await repo.saveChapter(chapter);
      }

      // Dynamic import to prevent circular compilation locks
      const { academicEventBus } = await import('../events/academic_event');
      await academicEventBus.emit({ type: 'TopicCompleted', topicId });
      await academicEventBus.emit({ type: 'SyllabusChanged' });
    }
  }
}

export const syllabusService = new SyllabusService();
export default syllabusService;
