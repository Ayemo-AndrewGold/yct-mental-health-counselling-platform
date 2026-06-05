'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Search, Star, BookOpen, CheckSquare, Video, FileText, AlertTriangle } from 'lucide-react';

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

const TYPE_ICON: Record<Resource['type'], React.ElementType> = {
  Article: BookOpen, Guide: CheckSquare, Video: Video, PDF: FileText,
};

const CTA_LABEL: Record<Resource['type'], string> = {
  Article: 'Read', Guide: 'Read', Video: 'Watch', PDF: 'Open',
};

// ── Dark-aware style builders ──
function categoryStyle(cat: Exclude<Category,'All'>, dm: boolean): React.CSSProperties {
  const map: Record<Exclude<Category,'All'>, { light: React.CSSProperties; dark: React.CSSProperties }> = {
    Anxiety:    { light:{ background:'#eef5fd', color:'#185FA5' },                                    dark:{ background:'#0c1f3d', color:'#7ab8f5' } },
    Depression: { light:{ background:'#f3f1fe', color:'#534AB7' },                                    dark:{ background:'#15123d', color:'#a49cf5' } },
    Stress:     { light:{ background:'#fdf6e8', color:'#854F0B', border:'1px solid #f0d08a' },         dark:{ background:'#1f1500', color:'#fbbf24', border:'1px solid #3d2e00' } },
    Wellness:   { light:{ background:'#008751', color:'#fff' },                                        dark:{ background:'#00451a', color:'#4ade80' } },
    Crisis:     { light:{ background:'#fdf0f0', color:'#A32D2D', border:'1px solid #f5bebe' },         dark:{ background:'#1f0d0d', color:'#fca5a5', border:'1px solid #3d1a1a' } },
  };
  return dm ? map[cat].dark : map[cat].light;
}

function typeStyle(type: Resource['type'], dm: boolean): React.CSSProperties {
  const map: Record<Resource['type'], { light: React.CSSProperties; dark: React.CSSProperties }> = {
    Article: { light:{ background:'rgba(0,135,81,0.08)', color:'#3B6D11' }, dark:{ background:'rgba(0,135,81,0.15)', color:'#4ade80' } },
    Guide:   { light:{ background:'rgba(0,135,81,0.15)', color:'#008751' }, dark:{ background:'rgba(0,135,81,0.20)', color:'#6ee7a0' } },
    Video:   { light:{ background:'#f3f1fe', color:'#7F77DD' },             dark:{ background:'#15123d', color:'#a49cf5' } },
    PDF:     { light:{ background:'#fdf6e8', color:'#BA7517' },             dark:{ background:'#1f1500', color:'#fbbf24' } },
  };
  return dm ? map[type].dark : map[type].light;
}

// ── Resource Card ──
function ResourceCard({ resource, dm }: { resource: Resource; dm: boolean }) {
  const TypeIcon = TYPE_ICON[resource.type];
  const C = {
    cardBg:    dm ? '#0d1f14' : '#f0faf4',
    cardBorder:dm ? '#1a3d2a' : '#b6e6cc',
    h:         dm ? '#d1fae5' : '#1a3d1f',
    sub:       dm ? '#6ee7a0' : '#3B6D11',
    divider:   dm ? '#1a3d2a' : '#b6e6cc',
    featBg:    dm ? '#1f1500' : '#fdf6e8',
    featColor: dm ? '#fbbf24' : '#854F0B',
    featBorder:dm ? '#3d2e00' : '#f0d08a',
    dot:       dm ? '#1a3d2a' : '#b6e6cc',
  };
  return (
    <div
      className="relative rounded-[20px] p-5 flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-[3px] cursor-pointer"
      style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,135,81,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="absolute bottom-[-18px] right-[-18px] w-[70px] h-[70px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: '#008751' }} />

      {/* Badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full"
            style={categoryStyle(resource.category, dm)}>
            {resource.category}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full inline-flex items-center gap-1"
            style={typeStyle(resource.type, dm)}>
            <TypeIcon size={10} /> {resource.type}
          </span>
        </div>
        {resource.featured && (
          <span className="text-[10px] font-bold px-2 py-[3px] rounded-full shrink-0 whitespace-nowrap"
            style={{ background: C.featBg, color: C.featColor, border: `1px solid ${C.featBorder}` }}>
            ★ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold leading-snug mb-2" style={{ color: C.h }}>
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: C.sub }}>
        {resource.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto"
        style={{ borderTop: `1px solid ${C.divider}` }}>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: C.sub }}>
          <span>{resource.readTime}</span>
          <span className="w-[3px] h-[3px] rounded-full" style={{ background: C.dot }} />
          <span>{resource.date}</span>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-bold"
          style={{ color: '#00a86b', background: 'none', border: 'none', cursor: 'pointer' }}>
          {CTA_LABEL[resource.type]} <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function ResourcesPage() {
  const [dm,       setDm]       = useState(false);
  const [category, setCategory] = useState<Category>('All');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setDm(true);
    const handler = (e: Event) =>
      setDm((e as CustomEvent<{ isDarkMode: boolean }>).detail.isDarkMode);
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);

  const filtered = RESOURCES.filter(r => {
    const matchCat    = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = RESOURCES.filter(r => r.featured);

  // ── colour tokens ──
  const C = {
    h:          dm ? '#d1fae5' : '#1a3d1f',
    sub:        dm ? '#6ee7a0' : '#3B6D11',
    cardBg:     dm ? '#0d1f14' : '#f0faf4',
    cardBorder: dm ? '#1a3d2a' : '#b6e6cc',
    inputBg:    dm ? '#0d1f14' : '#fff',
    inputText:  dm ? '#d1fae5' : '#1a3d1f',
    filterIdle: dm ? '#0d1f14' : '#f0faf4',
    filterBdr:  dm ? '#1a3d2a' : '#b6e6cc',
    filterTxt:  dm ? '#6ee7a0' : '#3B6D11',
    countTxt:   dm ? '#4ade80' : '#3B6D11',
    crisisBg:   dm ? '#1f0d0d' : '#fdf0f0',
    crisisBdr:  dm ? '#3d1a1a' : '#f5bebe',
    crisisH:    dm ? '#fca5a5' : '#501313',
    crisisTxt:  dm ? '#f87171' : '#A32D2D',
    emptyIcon:  dm ? '#0d2e1a' : 'rgba(0,135,81,0.1)',
  };

  return (
    <div className="px-6 py-5 pb-10" style={{ background: dm ? '#0a130d' : 'transparent' }}>

      {/* ── Header ── */}
      <div className="mb-5">
        <h2 className="text-[22px] font-bold" style={{ color: C.h }}>Mental Health Resources</h2>
        <p className="text-[15px] mt-1" style={{ color: C.sub }}>
          Curated articles, guides and videos to support your mental wellbeing
        </p>
      </div>

      {/* ── Featured Banner — always dark by nature, works in both modes ── */}
      <div className="relative rounded-[20px] p-6 mb-5 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage:"url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80')" }} />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(135deg, rgba(0,40,20,0.96) 0%, rgba(0,70,35,0.90) 100%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Star size={13} className="text-yellow-300" fill="currentColor" />
            <p className="text-[12px] font-bold text-yellow-300 uppercase tracking-[0.1em]">Featured Resources</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map(r => (
              <button key={r.id}
                className="text-left rounded-[14px] p-3.5 transition-all duration-150 hover:bg-white/[0.14]"
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)' }}>
                <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full inline-block mb-2"
                  style={categoryStyle(r.category, dm)}>
                  {r.category}
                </span>
                <p className="text-[13px] font-semibold text-white leading-snug mb-1.5">{r.title}</p>
                <p className="text-[11px]" style={{ color:'rgba(255,255,255,0.45)' }}>{r.readTime} · {r.type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.sub }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full h-10 pl-10 pr-4 rounded-full text-[12px] focus:outline-none transition-all"
            style={{ background: C.inputBg, border: `1px solid ${C.cardBorder}`, color: C.inputText }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#008751';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,135,81,0.15)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = C.cardBorder;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-4 py-[6px] rounded-full text-[12px] font-semibold transition-all duration-150"
              style={category === c
                ? { background:'#008751', color:'#fff', border:'1px solid #008751' }
                : { background: C.filterIdle, border:`1px solid ${C.filterBdr}`, color: C.filterTxt }
              }
              onMouseEnter={e => { if (category !== c) e.currentTarget.style.borderColor = '#008751'; }}
              onMouseLeave={e => { if (category !== c) e.currentTarget.style.borderColor = C.filterBdr; }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count ── */}
      <p className="text-[12px] mb-4" style={{ color: C.countTxt }}>
        Showing {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        {category !== 'All' ? ` in ${category}` : ''}
        {search ? ` for "${search}"` : ''}
      </p>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] p-10 text-center"
          style={{ background: C.cardBg, border:`1px solid ${C.cardBorder}` }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: C.emptyIcon }}>
            <Search size={20} style={{ color:'#008751' }} />
          </div>
          <p className="text-[14px] font-bold mb-1" style={{ color: C.h }}>No resources found</p>
          <p className="text-[13px]" style={{ color: C.sub }}>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => <ResourceCard key={r.id} resource={r} dm={dm} />)}
        </div>
      )}

      {/* ── Crisis Box ── */}
      <div className="mt-6 rounded-[20px] px-5 py-5 flex items-start gap-4"
        style={{ background: C.crisisBg, border:`1px solid ${C.crisisBdr}` }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0"
          style={{ background:'#E24B4A' }}>
          <AlertTriangle size={18} />
        </div>
        <div>
          <p className="text-[14px] font-bold mb-1" style={{ color: C.crisisH }}>
            In crisis or need urgent help?
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: C.crisisTxt }}>
            If you are experiencing a mental health emergency, please contact the Yabatech counselling unit immediately or call the Nigerian suicide prevention line:{' '}
            <strong>0800-SUICIDE</strong>.
          </p>
        </div>
      </div>

    </div>
  );
}