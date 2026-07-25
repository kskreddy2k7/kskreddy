export type Project = {
  id: string;
  title: string;
  overview: string;
  problem: string;
  solution: string;
  process: string;
  results: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  year?: string;
  stars?: number;
  forks?: number;
  language?: string;
  keyFeatures?: string[];
  challengesSolved?: string;
  readmeSummary?: string;
};

export type SkillCategory = {
  title: string;
  skills: string[];
};

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  type: 'education' | 'experience';
  tech_stack?: string[];
};
