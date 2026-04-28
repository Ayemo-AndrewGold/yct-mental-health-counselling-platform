'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ResourceStatus   = 'Published' | 'Pending' | 'Draft' | 'Flagged';
type ResourceCategory = 'Stress Management' | 'Anxiety' | 'Depression' | 'Sleep & Wellness' | 'Crisis' | 'Wellbeing' | 'Awareness';

interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  readTime: string;
  downloads: number;
  status: ResourceStatus;
  uploadedBy: string;
  uploadedDate: string;
  emoji: string;
  bgColor: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const RESOURCES: Resource[] = [
  { id: '1',  title: 'Managing Exam Stress Effectively',            category: 'Stress Management', readTime: '5 min',  downloads: 342, status: 'Published', uploadedBy: 'Mr. Alomaja',  uploadedDate: 'Apr 10', emoji: '📋', bgColor: 'bg-[#e8f5ec]', description: 'Practical techniques to manage academic pressure during examination periods.' },
  { id: '2',  title: 'Understanding Anxiety — A Student\'s Guide',  category: 'Anxiety',           readTime: '8 min',  downloads: 289, status: 'Published', uploadedBy: 'Dr. Fashola',  uploadedDate: 'Apr 08', emoji: '🧠', bgColor: 'bg-amber-50',  description: 'A comprehensive guide to recognizing and coping with anxiety symptoms.' },
  { id: '3',  title: 'Better Sleep for Better Mental Health',        category: 'Sleep & Wellness',  readTime: '4 min',  downloads: 198, status: 'Published', uploadedBy: 'Mrs. Bello',   uploadedDate: 'Apr 05', emoji: '🌙', bgColor: 'bg-blue-50',   description: 'The connection between sleep hygiene and mental wellbeing for students.' },
  { id: '4',  title: 'When to Seek Professional Help',               category: 'Awareness',         readTime: '6 min',  downloads: 176, status: 'Pending',   uploadedBy: 'Miss Okafor',  uploadedDate: 'Apr 19', emoji: '💬', bgColor: 'bg-purple-50', description: 'Signs that indicate you should speak to a mental health professional.' },
  { id: '5',  title: 'Breathing Techniques for Panic Attacks',       category: 'Crisis',            readTime: '3 min',  downloads: 154, status: 'Pending',   uploadedBy: 'Dr. Fashola',  uploadedDate: 'Apr 18', emoji: '🧘', bgColor: 'bg-red-50',    description: 'Step-by-step breathing exercises to manage acute anxiety and panic.' },
  { id: '6',  title: 'Financial Stress & Student Mental Health',     category: 'Wellbeing',         readTime: '7 min',  downloads: 112, status: 'Draft',     uploadedBy: 'Mr. Alomaja',  uploadedDate: 'Apr 15', emoji: '📖', bgColor: 'bg-green-50',  description: 'How financial challenges affect mental health and strategies to cope.' },
  { id: '7',  title: 'Overcoming Loneliness on Campus',              category: 'Wellbeing',         readTime: '5 min',  downloads: 98,  status: 'Published', uploadedBy: 'Mrs. Bello',   uploadedDate: 'Apr 02', emoji: '🤝', bgColor: 'bg-pink-50',   description: 'Building social connections and combating isolation in tertiary institutions.' },
  { id: '8',  title: 'Depression: Myths and Facts',                  category: 'Depression',        readTime: '9 min',  downloads: 87,  status: 'Flagged',   uploadedBy: 'Admin',        uploadedDate: 'Mar 28', emoji: '☁️', bgColor: 'bg-gray-50',   description: 'Debunking common misconceptions about depression in Nigerian students.' },
  { id: '9',  title: 'Self-Care Routines for Busy Students',         category: 'Wellbeing',         readTime: '4 min',  downloads: 74,  status: 'Published', uploadedBy: 'Miss Okafor',  uploadedDate: 'Mar 20', emoji: '🌟', bgColor: 'bg-yellow-50', description: 'Simple daily self-care practices that fit into a hectic academic schedule.' },
];

const CATEGORIES: ResourceCategory[] = ['Stress Management', 'Anxiety', 'Depression', 'Sleep & Wellness', 'Crisis', 'Wellbeing', 'Awareness'];

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ResourceStatus }) {
  const map: Record<ResourceStatus, string> = {
    Published: 'bg-green-50 text-green-700',
    Pending:   'bg-amber-50 text-amber-700',
    Draft:     'bg-gray-100 text-gray-500',
    Flagged:   'bg-red-50 text-red-600',
  };
  return <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>{status}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD MODAL
// ─────────────────────────────────────────────────────────────────────────────
function UploadModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState('');
  const [description, setDesc]  = useState('');

  const inputCls = 'w-full h-10 border border-gray-200 rounded-lg px-3 text-[12px] text-gray-900 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a]/10 transition placeholder:text-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-[14px] font-semibold text-gray-900">Upload Resource</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* File drop zone */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1a5c2a]/40 hover:bg-[#e8f5ec]/30 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#e8f5ec] flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#1a5c2a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-[12px] font-medium text-gray-700">Drop file here or click to browse</p>
            <p className="text-[10.5px] text-gray-400 mt-0.5">PDF, DOCX, or MP4 up to 50MB</p>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Resource Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Managing Exam Stress" className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of this resource..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[12px] text-gray-900 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a]/10 transition placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 h-9 border border-gray-200 rounded-lg text-[12px] text-gray-500 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 h-9 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg text-[12px] font-medium transition-colors">
            Upload Resource
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ResourceCard({ resource, onApprove, onRemove }: {
  resource: Resource;
  onApprove: (id: string) => void;
  onRemove:  (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className={`h-[80px] flex items-center justify-center text-[32px] ${resource.bgColor}`}>
        {resource.emoji}
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1">
        <h4 className="text-[12px] font-semibold text-gray-900 mb-1 leading-snug line-clamp-2">{resource.title}</h4>
        <p className="text-[10.5px] text-gray-400 leading-snug line-clamp-2">{resource.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-[1px] rounded-md font-medium">{resource.category}</span>
          <span className="text-[10px] text-gray-400">{resource.readTime} read</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={resource.status} />
          <span className="text-[10px] text-gray-400">↓ {resource.downloads.toLocaleString()}</span>
        </div>
        <div className="flex gap-1.5">
          {resource.status === 'Pending' ? (
            <>
              <button onClick={() => onApprove(resource.id)} className="h-6 px-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-[10.5px] font-medium rounded-md transition-colors">Approve</button>
              <button onClick={() => onRemove(resource.id)}  className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">Reject</button>
            </>
          ) : resource.status === 'Flagged' ? (
            <>
              <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">Review</button>
              <button onClick={() => onRemove(resource.id)} className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">Remove</button>
            </>
          ) : (
            <>
              <button className="h-6 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10.5px] font-medium rounded-md transition-colors">Edit</button>
              <button onClick={() => onRemove(resource.id)} className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">{resource.status === 'Draft' ? 'Delete' : 'Remove'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('All Categories');
  const [statusFilter, setStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);

  function approveResource(id: string) {
    setResources((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Published' as ResourceStatus } : r));
  }

  function removeResource(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchCat    = catFilter    === 'All Categories' || r.category === catFilter;
    const matchStatus = statusFilter === 'All Status'     || r.status   === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] transition';

  const statCards = [
    { label: 'Published',       value: String(resources.filter(r => r.status === 'Published').length), accent: 'bg-[#1a5c2a]' },
    { label: 'Pending Review',  value: String(resources.filter(r => r.status === 'Pending').length),   accent: 'bg-[#f5a623]' },
    { label: 'Total Downloads', value: resources.reduce((a, r) => a + r.downloads, 0).toLocaleString(), accent: 'bg-blue-500' },
    { label: 'Flagged',         value: String(resources.filter(r => r.status === 'Flagged').length),   accent: 'bg-red-500'   },
  ];

  return (
    <>
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}

      <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Resources</h2>
            <p className="text-[12px] text-gray-500 mt-1">{resources.filter(r => r.status === 'Published').length} published · {resources.filter(r => r.status === 'Pending').length} pending review</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-500 font-medium transition-colors">Filter</button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">
              + Upload Resource
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <p className="text-[24px] font-bold text-gray-900 tracking-tight leading-none mt-1">{s.value}</p>
              <p className="text-[11.5px] text-gray-500 mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className={`${inputCls} w-full pl-8`} />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={inputCls}>
            {['All Categories', ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
            {['All Status', 'Published', 'Pending', 'Draft', 'Flagged'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-[12px] font-medium text-gray-500">No resources found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters or upload a new resource</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} onApprove={approveResource} onRemove={removeResource} />
            ))}
          </div>
        )}

      </main>
    </>
  );
}