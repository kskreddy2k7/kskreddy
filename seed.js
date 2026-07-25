import { createClient } from '@supabase/supabase-js';

const url = "https://lezqwqquyzdstaxbchlj.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlenF3cXF1eXpkc3RheGJjaGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTI0NjgsImV4cCI6MjEwMDQ4ODQ2OH0.Y0bGJaypp-7iMK8tHVmKPiHDc68jnmaw7O2CXIOxIiA";

if (!url || !key) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const initialProjects = [
  {
    title: 'Sri Sai Traders Management',
    slug: 'sri-sai-traders',
    description: 'Comprehensive business management system for a wholesale trading company. Features robust inventory tracking, automated invoicing, customer analytics, and real-time financial reporting.',
    cover_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Express'],
    category: 'Enterprise',
    year: '2023',
    featured: true,
    display_order: 1
  },
  {
    title: 'AI Resume Screening System',
    slug: 'ai-resume-screen',
    description: 'Intelligent recruitment platform utilizing Natural Language Processing to automatically parse, evaluate, and rank candidate resumes against specific job descriptions.',
    cover_image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2070',
    tech_stack: ['Python', 'TensorFlow', 'FastAPI', 'React', 'MongoDB'],
    category: 'Machine Learning',
    year: '2024',
    featured: true,
    display_order: 2
  },
  {
    title: 'Health-Sense Wearable App',
    slug: 'health-sense',
    description: 'Real-time health monitoring application connecting to IoT wearables. Features predictive heart-rate analysis, sleep tracking algorithms, and emergency alert systems.',
    cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
    tech_stack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    category: 'Mobile Application',
    year: '2023',
    featured: true,
    display_order: 3
  },
  {
    title: 'Neural Network Visualizer',
    slug: 'neural-viz',
    description: 'Educational tool for visualizing backpropagation and weight adjustments in real-time. Allows students to build and train custom deep learning models directly in the browser.',
    cover_image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070',
    tech_stack: ['Vue.js', 'WebGL', 'D3.js', 'Python', 'Flask'],
    category: 'Data Visualization',
    year: '2024',
    featured: true,
    display_order: 4
  },
  {
    title: 'Quantum Cryptography Simulator',
    slug: 'quantum-crypto',
    description: 'Advanced simulation environment for quantum key distribution protocols (BB84). Demonstrates quantum entanglement and interception detection mechanisms.',
    cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070',
    tech_stack: ['C++', 'WebAssembly', 'React', 'Three.js'],
    category: 'Cybersecurity',
    year: '2024',
    featured: true,
    display_order: 5
  }
];

async function seed() {
  console.log("Seeding Supabase Database...");
  
  // Clear existing
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Insert new
  const { data, error } = await supabase.from('projects').insert(initialProjects).select();
  
  if (error) {
    console.error("Error seeding:", error.message);
  } else {
    console.log(`Successfully inserted ${data.length} projects!`);
  }
}

seed();
