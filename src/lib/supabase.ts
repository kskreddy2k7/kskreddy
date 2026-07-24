import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SupabaseProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  gallery?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  repository_url?: string;
  tech_stack: string[];
  category: string;
  status?: string;
  featured?: boolean;
  display_order?: number;
  year: string;
  readme_summary?: string;
  deployment?: string;
  created_at?: string;
  updated_at?: string;
};

// Default Verified GitHub Projects Fallback Dataset with SEPARATE github_url & demo_url
export const initialProjectsData: SupabaseProject[] = [
  {
    id: '1',
    title: 'Sri Sai Traders',
    slug: 'sri-sai-traders',
    description: 'A full-stack enterprise inventory, billing, and logistics management platform built for real-time trade tracking.',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/sri_sai_traders',
    demo_url: 'https://srisaitraders-kurnool.netlify.app',
    repository_url: 'https://github.com/kskreddy2k7/sri_sai_traders',
    tech_stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Full Stack Enterprise',
    status: 'active',
    featured: true,
    display_order: 1,
    year: '2023',
    readme_summary: 'Enterprise software solution supporting automated inventory stock management and atomic ledger accounting.',
    deployment: 'Netlify'
  },
  {
    id: '2',
    title: 'AI Resume Screening System',
    slug: 'ai-resume-screening-system',
    description: 'An intelligent ML platform that parses resumes, calculates candidate job match scores, and automates talent recruitment workflows.',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/ai-resume-screening-system',
    demo_url: 'https://kskreddy2k7.github.io/ai-resume-screening-system/',
    repository_url: 'https://github.com/kskreddy2k7/ai-resume-screening-system',
    tech_stack: ['Python', 'Scikit-Learn', 'Streamlit', 'NLP', 'TF-IDF'],
    category: 'Machine Learning',
    status: 'active',
    featured: true,
    display_order: 2,
    year: '2024',
    readme_summary: 'An intelligent recruitment engine leveraging TF-IDF vectorization and cosine similarity to score resumes against job descriptions.',
    deployment: 'GitHub Pages'
  },
  {
    id: '3',
    title: 'Kranthu AI Portfolio',
    slug: 'kranthu-ai-portfolio',
    description: 'An ultra-premium cinematic personal portfolio blending AI engineering highlights with 60 FPS motion design.',
    cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/kranthu-ai-portfolio',
    demo_url: 'https://kskreddy2k7.github.io/kranthu-ai-portfolio/',
    repository_url: 'https://github.com/kskreddy2k7/kranthu-ai-portfolio',
    tech_stack: ['React', 'TypeScript', 'GSAP', 'Lenis', 'Tailwind CSS'],
    category: 'Creative Engineering',
    status: 'active',
    featured: true,
    display_order: 3,
    year: '2024',
    readme_summary: 'A production-grade portfolio application featuring interactive project OS window modals and custom spring cursor physics.',
    deployment: 'GitHub Pages'
  },
  {
    id: '4',
    title: 'i2Flow Platform',
    slug: 'i2flow',
    description: 'A sleek, animated digital brand experience representing the i2Flow identity, merging AI insights with fluid interfaces.',
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/i2flow',
    demo_url: 'https://kskreddy2k7.github.io/i2flow/',
    repository_url: 'https://github.com/kskreddy2k7/i2flow',
    tech_stack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    category: 'Web Experience',
    status: 'active',
    featured: true,
    display_order: 4,
    year: '2024',
    readme_summary: 'Spatial brand experience platform showcasing real-time AI data streams and WebGL shaders.',
    deployment: 'GitHub Pages'
  },
  {
    id: '5',
    title: 'Builderestate',
    slug: 'builderestate',
    description: 'A modern real estate portal featuring interactive 3D property tours, mortgage calculators, and lead management.',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/builderestate',
    demo_url: 'https://kskreddy2k7.github.io/builderestate/',
    repository_url: 'https://github.com/kskreddy2k7/builderestate',
    tech_stack: ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Firebase'],
    category: 'Real Estate Tech',
    status: 'active',
    featured: true,
    display_order: 5,
    year: '2024',
    readme_summary: 'Real estate portal integrating Three.js 3D architectural rendering and progressive LOD model loading.',
    deployment: 'GitHub Pages'
  },
  {
    id: '6',
    title: 'Nizams Royal Restaurant',
    slug: 'nizams-royal-restaurant',
    description: 'A digital culinary experience featuring online table reservations, interactive menus, and order tracking.',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    github_url: 'https://github.com/kskreddy2k7/nizams-royal-restaurant',
    demo_url: 'https://kskreddy2k7.github.io/nizams-royal-restaurant/',
    repository_url: 'https://github.com/kskreddy2k7/nizams-royal-restaurant',
    tech_stack: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
    category: 'Web Application',
    status: 'active',
    featured: true,
    display_order: 6,
    year: '2023',
    readme_summary: 'Hospitality web app featuring interactive menu dietary filtering, table reservation engine, and Stripe payments.',
    deployment: 'GitHub Pages'
  }
];

export async function fetchSupabaseProjects(): Promise<SupabaseProject[]> {
  try {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SupabaseProject[];
      }
    }
  } catch (err) {
    console.warn('Supabase fetch error, using initial dataset fallback:', err);
  }

  return initialProjectsData;
}
