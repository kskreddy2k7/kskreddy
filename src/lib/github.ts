import { fetchSupabaseProjects, SupabaseProject } from './supabase';

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { name: string } | null;
  archived: boolean;
  disabled: boolean;
};

export type MergedProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  github_url: string;
  demo_url?: string | null;
  tech_stack: string[];
  category: string;
  language?: string;
  stars?: number;
  created_date_formatted: string;
  updated_date_formatted: string;
  updated_at_raw: string;
  pushed_at_raw: string;
  readme_summary?: string;
  deployment?: string;
  featured?: boolean;
  display_order?: number;
};

const GITHUB_USERNAME = 'kskreddy2k7';

// Date Formatter: "12 Jun 2024"
function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}

// Fetch Repositories live from GitHub API and merge with Supabase CMS
export async function fetchLiveProjects(): Promise<MergedProject[]> {
  let supabaseProjects: SupabaseProject[] = [];
  try {
    // 1. Fetch Supabase CMS Custom Overrides
    supabaseProjects = await fetchSupabaseProjects();

    // 2. Fetch GitHub Repositories Live
    const ghRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let ghRepos: GitHubRepo[] = [];
    if (ghRes.ok) {
      const data = await ghRes.json();
      if (Array.isArray(data)) {
        ghRepos = data.filter((r: GitHubRepo) => !r.archived && !r.disabled);
      }
    }

    // Fallback Image Palette for Repos without custom Supabase cover image
    const fallbackImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    ];

    // If GitHub API succeeds, map and merge with Supabase
    if (ghRepos.length > 0) {
      const mergedList: MergedProject[] = ghRepos.map((repo, idx) => {
        // Find matching Supabase record by repo name or slug
        const supabaseMatch = supabaseProjects.find(
          sp => sp.slug.toLowerCase() === repo.name.toLowerCase() ||
                sp.title.toLowerCase() === repo.name.toLowerCase() ||
                sp.github_url?.toLowerCase().includes(repo.name.toLowerCase())
        );

        // Tech stack: combine topics + language + Supabase tech_stack
        const techSet = new Set<string>();
        if (repo.language) techSet.add(repo.language);
        if (repo.topics && repo.topics.length > 0) {
          repo.topics.forEach(t => techSet.add(t));
        }
        if (supabaseMatch?.tech_stack) {
          supabaseMatch.tech_stack.forEach(t => techSet.add(t));
        }

        // Demo URL: Prefer real homepage / GitHub pages / Supabase demo_url
        let liveDemoUrl: string | null = null;
        if (supabaseMatch?.demo_url) {
          liveDemoUrl = supabaseMatch.demo_url;
        } else if (repo.homepage && repo.homepage.startsWith('http')) {
          liveDemoUrl = repo.homepage;
        } else if (repo.name) {
          // GitHub Pages standard URL
          liveDemoUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}/`;
        }

        return {
          id: String(repo.id),
          title: repo.name,
          slug: repo.name,
          description: supabaseMatch?.description || repo.description || 'Public GitHub Repository.',
          cover_image: supabaseMatch?.cover_image || fallbackImages[idx % fallbackImages.length],
          github_url: repo.html_url,
          demo_url: liveDemoUrl,
          tech_stack: Array.from(techSet),
          category: supabaseMatch?.category || repo.language || 'Software',
          language: repo.language || undefined,
          stars: repo.stargazers_count,
          created_date_formatted: formatDate(repo.created_at),
          updated_date_formatted: formatDate(repo.pushed_at || repo.updated_at),
          updated_at_raw: repo.pushed_at || repo.updated_at,
          pushed_at_raw: repo.pushed_at || repo.updated_at,
          readme_summary: supabaseMatch?.readme_summary || undefined,
          deployment: supabaseMatch?.deployment || (liveDemoUrl?.includes('github.io') ? 'GitHub Pages' : 'Netlify'),
          featured: supabaseMatch?.featured || false,
          display_order: supabaseMatch?.display_order || idx + 1
        };
      });

      // SORTING RULES:
      // Priority 1: Featured / Pinned
      // Priority 2: Recently Updated / Pushed (Newest First)
      mergedList.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        const timeA = new Date(a.pushed_at_raw).getTime();
        const timeB = new Date(b.pushed_at_raw).getTime();
        return timeB - timeA;
      });

      return mergedList;
    }
  } catch (err) {
    console.warn('GitHub API fetch failed, falling back to Supabase dataset:', err);
  }

  // Fallback if GitHub API rate-limited or offline
  return supabaseProjects.map((sp, idx) => ({
    id: sp.id,
    title: sp.title,
    slug: sp.slug,
    description: sp.description,
    cover_image: sp.cover_image,
    github_url: sp.github_url || `https://github.com/kskreddy2k7/${sp.slug}`,
    demo_url: sp.demo_url,
    tech_stack: sp.tech_stack || [],
    category: sp.category || 'Software',
    language: sp.tech_stack?.[0],
    created_date_formatted: '2024',
    updated_date_formatted: sp.year || '2024',
    updated_at_raw: new Date().toISOString(),
    pushed_at_raw: new Date().toISOString(),
    readme_summary: sp.readme_summary,
    deployment: sp.deployment,
    featured: sp.featured,
    display_order: sp.display_order || idx + 1
  }));
}
