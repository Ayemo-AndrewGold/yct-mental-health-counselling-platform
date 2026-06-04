'use client';

import { useState } from 'react';
import { ArrowRight, Search, Star, BookOpen, CheckSquare, Video, FileText, AlertTriangle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA — unchanged
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

const RESOURCES: Resource[] = [
  { id:'r1', title:'Managing Exam Anxiety: A Student Guide', description:'Practical strategies to help you stay calm and focused during exam season including breathing techniques and study habits.', category:'Anxiety', readTime:'5 min read', type:'Guide', date:'12 May 2026', featured:true },
  { id:'r2', title:'Understanding Depression in Young Adults', description:'Learn the signs, symptoms, and effective coping strategies for depression among university and polytechnic students.', category:'Depression', readTime:'8 min read', type:'Article', date:'8 May 2026', featured:true },
  { id:'r3', title:'The 5-4-3-2-1 Grounding Technique', description:'A simple mindfulness exercise to help you manage anxiety and panic attacks in the moment.', category:'Anxiety', readTime:'3 min read', type:'Guide', date:'1 May 2026' },
  { id:'r4', title:'Sleep and Mental Health: What You Need to Know', description:'How sleep affects your mood, focus and overall mental wellbeing and what you can do to improve your sleep quality.', category:'Wellness', readTime:'6 min read', type:'Article', date:'28 Apr 2026' },
  { id:'r5', title:'Stress Management for Students', description:'Evidence-based techniques to manage academic pressure, deadlines and the stress of student life in Nigeria.', category:'Stress', readTime:'7 min read', type:'Article', date:'20 Apr 2026' },
  { id:'r6', title:'When to Seek Help: Recognising a Mental Health Crisis', description:'Know the warning signs that indicate you or someone you know needs urgent professional support.', category:'Crisis', readTime:'4 min read', type:'Guide', date:'15 Apr 2026', featured:true },
  { id:'r7', title:'Building Resilience as a Student', description:'How to develop emotional resilience to bounce back from setbacks, failure and difficult life events.', category:'Wellness', readTime:'5 min read', type:'Article', date:'10 Apr 2026' },
  { id:'r8', title:'NDPR 2019 & Your Mental Health Data Rights', description:'Understand your rights regarding how your personal mental health data is stored and used under Nigerian law.', category:'Wellness', readTime:'4 min read', type:'PDF', date:'5 Apr 2026' },
  { id:'r9', title:'Breathing Exercises for Anxiety Relief', description:'Step-by-step video guide to box breathing, 4-7-8 breathing and other calming techniques.', category:'Anxiety', readTime:'10 min', type:'Video', date:'1 Apr 2026' },
  { id:'r10', title:'Coping with Academic Failure and Disappointment', description:'Healthy ways to process and recover from failing an exam or not meeting your academic expectations.', category:'Stress', readTime:'6 min read', type:'Article', date:'25 Mar 2026' },
];

const CATEGORIES: Category[] = ['All', 'Anxiety', 'Depression', 'Stress', 'Wellness', 'Crisis'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<Exclude<Category,'All'>, React.CSSProperties> = {
  Anxiety:    { background: '#eef5fd', color: '#185FA5' },
  Depression: { background: '#f3f1fe', color: '#534AB7' },
  Stress:     { background: '#fdf6e8', color: '#854F0B', border: '1px solid #f0d08a' },
  Wellness:   { background: '#008751', color: '#fff' },
  Crisis:     { background: '#fdf0f0', color: '#A32D2D', border: '1px solid #f5bebe' },
};

const TYPE_STYLE: Record<Resource['type'], React.CSSProperties> = {
  Article: { background: 'rgba(0,135,81,0.08)', color: '#3B6D11' },
  Guide:   { background: 'rgba(0,135,81,0.15)', color: '#008751' },
  Video:   { background: '#f3f1fe', color: '#7F77DD' },
  PDF:     { background: '#fdf6e8', color: '#BA7517' },
};

const TYPE_ICON: Record<Resource['type'], React.ElementType> = {
  Article: BookOpen,
  Guide:   CheckSquare,
  Video:   Video,
  PDF:     FileText,
};

const CTA_LABEL: Record<Resource['type'], string> = {
  Article: 'Read', Guide: 'Read', Video: 'Watch', PDF: 'Open',
};

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ResourceCard({ resource }: { resource: Resource }) {
  const TypeIcon = TYPE_ICON[resource.type];
  return (
    <div
      className="relative rounded-[20px] p-5 flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-[3px] cursor-pointer"
      style={{ background: '#f0faf4', border: '1px solid #b6e6cc' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,135,81,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Deco */}
      <div className="absolute bottom-[-18px] right-[-18px] w-[70px] h-[70px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: '#008751' }} />

      {/* Top badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold px-2.5 py-[3px] rounded-full"
            style={CATEGORY_STYLE[resource.category]}>
            {resource.category}
          </span>
          <span className="text-[13px] font-semibold px-2.5 py-[3px] rounded-full inline-flex items-center gap-1"
            style={TYPE_STYLE[resource.type]}>
            <TypeIcon size={10} /> {resource.type}
          </span>
        </div>
        {resource.featured && (
          <span className="text-[13px] font-bold px-2 py-[3px] rounded-full shrink-0 whitespace-nowrap"
            style={{ background: '#fdf6e8', color: '#854F0B', border: '1px solid #f0d08a' }}>
            ★ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold leading-snug mb-2" style={{ color: '#1a3d1f' }}>
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-relaxed flex-1 mb-4" style={{ color: '#3B6D11' }}>
        {resource.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto"
        style={{ borderTop: '1px solid #b6e6cc' }}>
        <div className="flex items-center gap-1.5 text-[13px]" style={{ color: '#3B6D11' }}>
          <span>{resource.readTime}</span>
          <span className="w-[3px] h-[3px] rounded-full" style={{ background: '#b6e6cc' }} />
          <span>{resource.date}</span>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#008751', background: 'none', border: 'none', cursor: 'pointer' }}>
          {CTA_LABEL[resource.type]} <ArrowRight size={13} />
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
  const [search,   setSearch]   = useState('');

  const filtered = RESOURCES.filter(r => {
    const matchCat    = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = RESOURCES.filter(r => r.featured);

  return (
    <div className="px-6 py-5 pb-10">

      {/* ── Page Header ── */}
      <div className="mb-5">
        <h2 className="text-[30px] font-bold" style={{ color: '#1a3d1f' }}>Mental Health Resources</h2>
        <p className="text-[17px] mt-1" style={{ color: '#3B6D11' }}>
          Curated articles, guides and videos to support your mental wellbeing
        </p>
      </div>

      {/* ── Featured Banner ── */}
      <div className="relative rounded-[20px] p-6 mb-5 overflow-hidden">
        {/* Photo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80')" }} />
        {/* Overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,40,20,0.96) 0%, rgba(0,70,35,0.90) 100%)' }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Star size={15} className="text-yellow-300" fill="currentColor" />
            <p className="text-[14px] font-bold text-yellow-300 uppercase tracking-[0.1em]">Featured Resources</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map(r => (
              <button key={r.id}
                className="text-left rounded-[14px] p-3.5 transition-all duration-150 hover:bg-white/[0.14]"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <span className="text-[14px] font-bold px-2.5 py-[3px] rounded-full inline-block mb-2"
                  style={CATEGORY_STYLE[r.category]}>
                  {r.category}
                </span>
                <p className="text-[15px] font-semibold text-white leading-snug mb-1.5">{r.title}</p>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.readTime} · {r.type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#3B6D11' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full h-10 pl-10 pr-4 rounded-full text-[12px] focus:outline-none transition-all"
            style={{ background: '#fff', border: '1px solid #b6e6cc', color: '#1a3d1f' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#008751'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,135,81,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#b6e6cc'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-4 py-[6px] rounded-full text-[12px] font-semibold transition-all duration-150"
              style={category === c
                ? { background: '#008751', color: '#fff', border: '1px solid #008751' }
                : { background: '#f0faf4', border: '1px solid #b6e6cc', color: '#3B6D11' }
              }
              onMouseEnter={e => { if (category !== c) e.currentTarget.style.borderColor = '#008751'; }}
              onMouseLeave={e => { if (category !== c) e.currentTarget.style.borderColor = '#b6e6cc'; }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count ── */}
      <p className="text-[16px] mb-4" style={{ color: '#3B6D11' }}>
        Showing {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        {category !== 'All' ? ` in ${category}` : ''}
        {search ? ` for "${search}"` : ''}
      </p>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] p-10 text-center"
          style={{ background: '#f0faf4', border: '1px solid #b6e6cc' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0,135,81,0.1)' }}>
            <Search size={20} style={{ color: '#008751' }} />
          </div>
          <p className="text-[18px] font-bold mb-1" style={{ color: '#1a3d1f' }}>No resources found</p>
          <p className="text-[17px]" style={{ color: '#3B6D11' }}>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}

      {/* ── Crisis Box ── */}
      <div className="mt-6 rounded-[20px] px-5 py-5 flex items-start gap-4"
        style={{ background: '#fdf0f0', border: '1px solid #f5bebe' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0"
          style={{ background: '#E24B4A' }}>
          <AlertTriangle size={18} />
        </div>
        <div>
          <p className="text-[15px] font-bold mb-1" style={{ color: '#501313' }}>
            In crisis or need urgent help?
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: '#A32D2D' }}>
            If you are experiencing a mental health emergency, please contact the Yabatech counselling unit immediately or call the Nigerian suicide prevention line:{' '}
            <strong>0800-SUICIDE</strong>.
          </p>
        </div>
      </div>

    </div>
  );
}