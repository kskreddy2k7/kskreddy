import { Project, SkillCategory, TimelineEvent } from './types';
import profileData from './data/models/profile.json';
import projectsData from './data/github-projects.json';
import skillsData from './data/github-skills.json';
import timelineData from './data/models/timeline.json';
import socialsData from './data/models/socials.json';

export const profile = profileData.personal;
export const socials = socialsData;

export const projects: Project[] = projectsData.map((p) => {
  const base = import.meta.env.BASE_URL || '/';
  const imageUrl = p.image
    ? p.image.startsWith('/')
      ? `${base.replace(/\/$/, '')}${p.image}`
      : p.image
    : '';
  return {
    id: String(p.id),
    title: p.name,
    overview: p.description || '',
    problem: '',
    solution: '',
    process: '',
    results: '',
    technologies: p.topics || [],
    imageUrl,
    githubUrl: p.github_url,
    liveUrl: p.homepage || undefined,
    category: 'Open Source',
    language: p.language || '',
    stars: p.stars,
    forks: p.forks,
    readmeSummary: p.readme_summary || undefined
  };
});



export const timeline: TimelineEvent[] = timelineData.map(t => ({
  id: t.id,
  year: t.year,
  title: t.title,
  company: t.company,
  description: t.description,
  type: t.type as 'education' | 'experience',
  tech_stack: t.tech_stack || []
}));
