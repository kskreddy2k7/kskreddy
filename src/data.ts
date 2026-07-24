import { Project, SkillCategory, TimelineEvent } from './types';
import profileData from './data/models/profile.json';
import projectsData from './data/models/projects.json';
import skillsData from './data/models/skills.json';
import timelineData from './data/models/timeline.json';
import socialsData from './data/models/socials.json';

export const profile = profileData.personal;
export const socials = socialsData;

export const projects: Project[] = projectsData.map((p, index) => {
  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
  ];
  return {
    id: p.id,
    title: p.title,
    overview: p.description,
    problem: '',
    solution: '',
    process: '',
    results: '',
    technologies: p.technologies || [],
    imageUrl: images[index % images.length],
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl || undefined,
    category: p.category,
    language: p.language
  };
});

export const skillCategories: SkillCategory[] = skillsData.map(s => ({
  title: s.category,
  skills: s.skills
}));

export const timeline: TimelineEvent[] = timelineData.map(t => ({
  id: t.id,
  year: t.year,
  title: t.title,
  company: t.company,
  description: t.description,
  type: t.type as 'education' | 'experience',
  tech_stack: t.tech_stack || []
}));
