export interface SeedSubject {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface SeedUnit {
  id: string;
  name: string;
  subjectId: string;
  sequenceOrder: number;
}

export interface SeedChapter {
  id: string;
  name: string;
  unitId: string;
  sequenceOrder: number;
}

export interface SeedTopic {
  id: string;
  name: string;
  chapterId: string;
  sequenceOrder: number;
}

export interface SeedDependency {
  chapterId: string;
  prerequisiteChapterId: string;
}

export interface AcademicDataset {
  subjects: SeedSubject[];
  units: SeedUnit[];
  chapters: SeedChapter[];
  topics: SeedTopic[];
  dependencies: SeedDependency[];
}

export const DefaultAcademicDataset: AcademicDataset = {
  subjects: [
    { id: 'sub-phy', name: 'Physics', color: '#E06666', emoji: '⚛️' },
    { id: 'sub-chem', name: 'Chemistry', color: '#6AA84F', emoji: '🧪' },
    { id: 'sub-math', name: 'Mathematics', color: '#4A90E2', emoji: '📐' },
  ],
  units: [
    { id: 'unit-phy-mech', name: 'Classical Mechanics', subjectId: 'sub-phy', sequenceOrder: 1 },
    { id: 'unit-phy-therm', name: 'Thermodynamics & Heat', subjectId: 'sub-phy', sequenceOrder: 2 },
    { id: 'unit-chem-phys', name: 'Physical Chemistry', subjectId: 'sub-chem', sequenceOrder: 1 },
    { id: 'unit-chem-org', name: 'Organic Chemistry', subjectId: 'sub-chem', sequenceOrder: 2 },
    { id: 'unit-math-calc', name: 'Calculus & Functions', subjectId: 'sub-math', sequenceOrder: 1 },
    { id: 'unit-math-linalg', name: 'Linear Algebra', subjectId: 'sub-math', sequenceOrder: 2 },
  ],
  chapters: [
    { id: 'ch-phy-kin', name: 'Kinematics & Motion', unitId: 'unit-phy-mech', sequenceOrder: 1 },
    { id: 'ch-phy-dyn', name: 'Newtonian Dynamics', unitId: 'unit-phy-mech', sequenceOrder: 2 },
    { id: 'ch-phy-thermodyn', name: 'Laws of Thermodynamics', unitId: 'unit-phy-therm', sequenceOrder: 1 },
    { id: 'ch-chem-kin', name: 'Chemical Kinetics', unitId: 'unit-chem-phys', sequenceOrder: 1 },
    { id: 'ch-chem-syn', name: 'Organic Synthesis Routes', unitId: 'unit-chem-org', sequenceOrder: 1 },
    { id: 'ch-math-lim', name: 'Limits & Continuity', unitId: 'unit-math-calc', sequenceOrder: 1 },
    { id: 'ch-math-int', name: 'Integration & Quadrature', unitId: 'unit-math-calc', sequenceOrder: 2 },
  ],
  topics: [
    { id: 'top-phy-kin-1', name: 'Displacement & Velocity Vectors', chapterId: 'ch-phy-kin', sequenceOrder: 1 },
    { id: 'top-phy-kin-2', name: 'Projectile Motion Equations', chapterId: 'ch-phy-kin', sequenceOrder: 2 },
    
    { id: 'top-phy-dyn-1', name: 'Newton\'s First & Second Laws', chapterId: 'ch-phy-dyn', sequenceOrder: 1 },
    { id: 'top-phy-dyn-2', name: 'Frictional Forces & Slopes', chapterId: 'ch-phy-dyn', sequenceOrder: 2 },
    
    { id: 'top-phy-therm-1', name: 'First Law: Work & Heat Transfer', chapterId: 'ch-phy-thermodyn', sequenceOrder: 1 },
    { id: 'top-phy-therm-2', name: 'Entropy & Thermal Efficiency', chapterId: 'ch-phy-thermodyn', sequenceOrder: 2 },
    
    { id: 'top-chem-kin-1', name: 'Reaction Rates & Rate Laws', chapterId: 'ch-chem-kin', sequenceOrder: 1 },
    { id: 'top-chem-kin-2', name: 'Activation Energy & Arrhenius Eq', chapterId: 'ch-chem-kin', sequenceOrder: 2 },
    
    { id: 'top-chem-syn-1', name: 'Alkanes & Alkene Reactions', chapterId: 'ch-chem-syn', sequenceOrder: 1 },
    { id: 'top-chem-syn-2', name: 'Aromatics & Electrophilic Sub', chapterId: 'ch-chem-syn', sequenceOrder: 2 },
    
    { id: 'top-math-lim-1', name: 'Limits and Intermediate Value Thm', chapterId: 'ch-math-lim', sequenceOrder: 1 },
    
    { id: 'top-math-int-1', name: 'Fundamental Theorem of Calculus', chapterId: 'ch-math-int', sequenceOrder: 1 },
    { id: 'top-math-int-2', name: 'Integration by Parts & Substitution', chapterId: 'ch-math-int', sequenceOrder: 2 },
  ],
  dependencies: [
    { chapterId: 'ch-phy-dyn', prerequisiteChapterId: 'ch-phy-kin' },
    { chapterId: 'ch-math-int', prerequisiteChapterId: 'ch-math-lim' },
  ],
};
