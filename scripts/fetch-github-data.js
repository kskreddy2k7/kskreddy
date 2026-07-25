import fs from 'fs';
import path from 'path';
import https from 'https';

const USERNAME = 'kskreddy2k7';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/github-projects.json');
const SKILLS_FILE = path.resolve(process.cwd(), 'src/data/github-skills.json');

// Helper to make HTTPS requests
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Node.js Fetcher',
      ...options.headers
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const req = https.get(url, {
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        data: data
      }));
    });
    req.on('error', reject);
  });
}

const CATEGORY_MAP = {
  'frontend': ['react', 'vue', 'angular', 'svelte', 'nextjs', 'css', 'html', 'tailwind', 'sass', 'gsap', 'framer-motion', 'frontend', 'ui', 'ux', 'web'],
  'backend': ['node', 'express', 'nestjs', 'django', 'flask', 'spring', 'laravel', 'backend', 'api', 'graphql', 'rest', 'ruby-on-rails'],
  'languages': ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin'],
  'ai_ml': ['ai', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'openai', 'llm'],
  'databases': ['mongodb', 'postgres', 'mysql', 'redis', 'firebase', 'supabase', 'sql', 'nosql', 'prisma', 'mongoose'],
  'cloud': ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci-cd', 'serverless', 'vercel', 'netlify', 'cloudflare', 'devops']
};

function getCategoryForTopic(topic) {
  const t = topic.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.includes(t)) return cat;
  }
  return 'tools'; // default fallback
}

// Function to fetch README and extract first paragraph
async function fetchReadmeSummary(repoName) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`);
    if (res.status !== 200) {
      const resMaster = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${repoName}/master/README.md`);
      if (resMaster.status !== 200) return null;
      return extractFirstParagraph(resMaster.data);
    }
    return extractFirstParagraph(res.data);
  } catch (e) {
    return null;
  }
}

function extractFirstParagraph(markdown) {
  const lines = markdown.split('\n');
  let paragraph = '';
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines, headers, html tags, badges, images, codeblocks
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('<') || trimmed.startsWith('[!') || trimmed.startsWith('![') || trimmed.startsWith('```')) {
      if (paragraph.length > 0) break; // We got a paragraph and hit something else
      continue;
    }
    paragraph += trimmed + ' ';
    if (paragraph.length > 200) break; // limit length
  }
  paragraph = paragraph.trim();
  // Simple markdown stripping for common things
  paragraph = paragraph.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // links
  paragraph = paragraph.replace(/[*_~`]/g, ''); // formatting
  return paragraph.length > 150 ? paragraph.substring(0, 150) + '...' : paragraph;
}

async function run() {
  console.log(`[GitHub Fetcher] Fetching pinned repositories for @${USERNAME}...`);

  try {
    const profileRes = await fetch(`https://github.com/${USERNAME}`);
    if (profileRes.status !== 200) throw new Error(`Failed to fetch profile HTML. Status: ${profileRes.status}`);

    const pinnedRegex = /<span class="repo"[^>]*title="([^"]+)"/g;
    const matches = [...profileRes.data.matchAll(pinnedRegex)];
    let pinnedNames = matches.map(m => m[1]);

    if (pinnedNames.length === 0) {
      const itemRegex = /pinned-item-list-item-content[^>]*>[\s\S]*?<a[^>]*href="\/kskreddy2k7\/([^"]+)"/g;
      const m2 = [...profileRes.data.matchAll(itemRegex)];
      pinnedNames = m2.map(m => m[1]);
    }
    
    pinnedNames = [...new Set(pinnedNames)];
    console.log(`[GitHub Fetcher] Found pinned repos: ${pinnedNames.join(', ')}`);

    console.log(`[GitHub Fetcher] Fetching live data for repositories...`);
    const allReposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`);
    if (allReposRes.status !== 200) throw new Error(`Failed to fetch repositories API. Status: ${allReposRes.status}`);

    const allRepos = JSON.parse(allReposRes.data);
    let finalProjects = [];

    // Map pinned repos first
    for (const name of pinnedNames) {
      const repo = allRepos.find(r => r.name.toLowerCase() === name.toLowerCase());
      if (repo) finalProjects.push(repo);
    }

    const projectsData = [];
    const skillsMap = new Map(); // to aggregate skills

    for (const repo of finalProjects) {
      console.log(`Processing ${repo.name}...`);
      let imageUrl = null;
      const extensions = ['webp', 'png', 'jpg', 'jpeg'];
      const repoDir = path.resolve(process.cwd(), `public/projects/${repo.name}`);
      
      for (const ext of extensions) {
        if (fs.existsSync(path.join(repoDir, `cover.${ext}`))) {
          imageUrl = `/projects/${repo.name}/cover.${ext}`;
          break;
        }
      }

      const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
      const updatedDate = new Date(repo.pushed_at || repo.updated_at).toLocaleDateString('en-GB', dateOpts);
      const createdDate = new Date(repo.created_at).toLocaleDateString('en-GB', dateOpts);

      // Only fetch README for pinned repos to avoid rate limits
      let readmeSummary = null;
      if (pinnedNames.includes(repo.name) || finalProjects.indexOf(repo) < 10) {
        readmeSummary = await fetchReadmeSummary(repo.name);
      }

      // Aggregate skills
      const topics = repo.topics || [];
      if (repo.language && !topics.includes(repo.language.toLowerCase())) {
        topics.push(repo.language.toLowerCase());
      }

      for (const topic of topics) {
        const cat = getCategoryForTopic(topic);
        if (!skillsMap.has(topic)) {
          skillsMap.set(topic, { name: topic, count: 0, category: cat, repos: [] });
        }
        const skill = skillsMap.get(topic);
        skill.count += 1;
        if (skill.repos.length < 3) skill.repos.push(repo.name);
      }

      projectsData.push({
        id: String(repo.id),
        name: repo.name,
        description: repo.description || '',
        readme_summary: readmeSummary,
        github_url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language || null,
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: updatedDate,
        created_at: createdDate,
        license: repo.license ? (repo.license.name || repo.license.spdx_id) : null,
        is_open_source: repo.private === false,
        image: imageUrl
      });
    }

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Sort skills by count
    const skillsData = Array.from(skillsMap.values()).sort((a, b) => b.count - a.count);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projectsData, null, 2));
    fs.writeFileSync(SKILLS_FILE, JSON.stringify(skillsData, null, 2));
    
    console.log(`[GitHub Fetcher] Successfully generated ${projectsData.length} projects to ${OUTPUT_FILE}`);
    console.log(`[GitHub Fetcher] Successfully generated ${skillsData.length} skills to ${SKILLS_FILE}`);

  } catch (err) {
    console.error('[GitHub Fetcher] Error:', err);
    process.exit(1);
  }
}

run();
