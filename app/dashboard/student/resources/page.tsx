'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Category = 'All' | 'Anxiety' | 'Depression' | 'Stress' | 'Wellness' | 'Crisis';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'All'>;
  readTime: string;
  type: 'Article' | 'Guide' | 'Video' | 'PDF';
  date: string;
  featured?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Managing Exam Anxiety: A Student Guide',
    description: 'Practical strategies to help you stay calm and focused during exam season including breathing techniques and study habits.',
    category: 'Anxiety',
    readTime: '5 min read',
    type: 'Guide',
    date: '12 May 2026',
    featured: true,
  },
  {
    id: 'r2',
    title: 'Understanding Depression in Young Adults',
    description: 'Learn the signs, symptoms, and effective coping strategies for depression among university and polytechnic students.',
    category: 'Depression',
    readTime: '8 min read',
    type: 'Article',
    date: '8 May 2026',
    featured: true,
  },
  {
    id: 'r3',
    title: 'The 5-4-3-2-1 Grounding Technique',
    description: 'A simple mindfulness exercise to help you manage anxiety and panic attacks in the moment.',
    category: 'Anxiety',
    readTime: '3 min read',
    type: 'Guide',
    date: '1 May 2026',
  },
  {
    id: 'r4',
    title: 'Sleep and Mental Health: What You Need to Know',
    description: 'How sleep affects your mood, focus and overall mental wellbeing and what you can do to improve your sleep quality.',
    category: 'Wellness',
    readTime: '6 min read',
    type: 'Article',
    date: '28 Apr 2026',
  },
  {
    id: 'r5',
    title: 'Stress Management for Students',
    description: 'Evidence-based techniques to manage academic pressure, deadlines and the stress of student life in Nigeria.',
    category: 'Stress',
    readTime: '7 min read',
    type: 'Article',
    date: '20 Apr 2026',
  },
  {
    id: 'r6',
    title: 'When to Seek Help: Recognising a Mental Health Crisis',
    description: 'Know the warning signs that indicate you or someone you know needs urgent professional support.',
    category: 'Crisis',
    readTime: '4 min read',
    type: 'Guide',
    date: '15 Apr 2026',
    featured: true,
  },
  {
    id: 'r7',
    title: 'Building Resilience as a Student',
    description: 'How to develop emotional resilience to bounce back from setbacks, failure and difficult life events.',
    category: 'Wellness',
    readTime: '5 min read',
    type: 'Article',
    date: '10 Apr 2026',
  },
  {
    id: 'r8',
    title: 'NDPR 2019 & Your Mental Health Data Rights',
    description: 'Understand your rights regarding how your personal mental health data is stored and used under Nigerian law.',
    category: 'Wellness',
    readTime: '4 min read',
    type: 'PDF',
    date: '5 Apr 2026',
  },
  {
    id: 'r9',
    title: 'Breathing Exercises for Anxiety Relief',
    description: 'Step-by-step video guide to box breathing, 4-7-8 breathing and other calming techniques.',
    category: 'Anxiety',
    readTime: '10 min',
    type: 'Video',
    date: '1 Apr 2026',
  },
  {
    id: 'r10',
    title: 'Coping with Academic Failure and Disappointment',
    description: 'Healthy ways to process and recover from failing an exam or not meeting your academic expectations.',
    category: 'Stress',
    readTime: '6 min read',
    type: 'Article',
    date: '25 Mar 2026',
  },
];

const CATEGORIES: Category[] = ['All', 'Anxiety', 'Depression', 'Stress', 'Wellness', 'Crisis'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function categoryColor(cat: Exclude<Category, 'All'>) {
  const map: Record<Exclude<Category, 'All'>, string> = {
    Anxiety:    'bg-blue-50 text-blue-700',
    Depression: 'bg-purple-50 text-purple-700',
    Stress:     'bg-orange-50 text-orange-700',
    Wellness:   'bg-green-50 text-green-700',
    Crisis:     'bg-red-50 text-red-600',
  };
  return map[cat];
}

function typeColor(type: Resource['type']) {
  const map: Record<Resource['type'], string> = {
    Article: 'bg-gray-100 text-gray-600',
    Guide:   'bg-[#e8f5ec] text-[#1a5c2a]',
    Video:   'bg-purple-50 text-purple-700',
    PDF:     'bg-orange-50 text-orange-700',
  };
  return map[type];
}

function typeIcon(type: Resource['type']) {
  if (type === 'Article') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
  if (type === 'Guide') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  );
  if (type === 'Video') return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  );
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-200 group flex flex-col">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-[3px] rounded-full ${categoryColor(resource.category)}`}>
            {resource.category}
          </span>
          <span className={`text-[10px] font-medium px-2 py-[3px] rounded-md flex items-center gap-1 ${typeColor(resource.type)}`}>
            {typeIcon(resource.type)}
            {resource.type}
          </span>
        </div>
        {resource.featured && (
          <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-yellow-50 text-yellow-700 shrink-0">
            ★ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1a5c2a] transition-colors">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-[11.5px] text-gray-500 leading-relaxed mb-4 flex-1">
        {resource.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400">{resource.readTime}</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">{resource.date}</span>
        </div>
        <button className="flex items-center gap-1 text-[11px] text-[#1a5c2a] font-medium hover:underline">
          Read
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [category, setCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const filtered = RESOURCES.filter((r) => {
    const matchCat = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = RESOURCES.filter((r) => r.featured);

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
          Mental Health Resources
        </h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Curated articles, guides and videos to support your mental wellbeing
        </p>
      </div>

      {/* Featured banner */}
      <div className="bg-[#1a5c2a] rounded-2xl px-6 py-5 mb-5">
        <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.08em] mb-2">
          Featured Resources
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featured.map((r) => (
            <button
              key={r.id}
              className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-left hover:bg-white/15 transition group"
            >
              <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full mb-2 inline-block ${categoryColor(r.category)}`}>
                {r.category}
              </span>
              <p className="text-[12px] font-semibold text-white leading-snug group-hover:text-yellow-300 transition-colors">
                {r.title}
              </p>
              <p className="text-[10px] text-white/50 mt-1">{r.readTime}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-xl text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`h-10 px-4 rounded-xl text-[12px] font-medium transition-all
                ${category === c
                  ? 'bg-[#1a5c2a] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a5c2a]'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[11px] text-gray-400 mb-3">
        Showing {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        {category !== 'All' ? ` in ${category}` : ''}
        {search ? ` for "${search}"` : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <p className="text-[12px] text-gray-400">No resources found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}

      {/* Crisis box */}
      <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 stroke-red-600" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-red-700 mb-0.5">In crisis or need urgent help?</p>
          <p className="text-[11px] text-red-600 leading-relaxed">
            If you are experiencing a mental health emergency, please contact the Yabatech counselling unit immediately or call the Nigerian suicide prevention line: <strong>0800-SUICIDE</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}