import React, { useState } from 'react';
import { 
  ArrowLeft, Search, FileText, Copy, Check, Download, 
  MessageCircle, ExternalLink, Calendar, CheckSquare, Sparkles 
} from 'lucide-react';
import { TaskItem, ParentInquiry } from '../../types';

interface LibraryViewProps {
  onBack: () => void;
  tasks?: TaskItem[];
  inquiries?: ParentInquiry[];
}

interface LibraryDocItem {
  id: string;
  title: string;
  category: string;
  type: 'plan' | 'checklist' | 'draft' | 'inquiry';
  date: string;
  content: string;
  downloadFilename: string;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onBack,
  tasks = [],
  inquiries = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Synthesize library items from tasks with execution plans + inquiries with drafts
  const documents: LibraryDocItem[] = [];

  tasks.forEach((t) => {
    if (t.executionPlan) {
      if (t.executionPlan.summary || t.executionPlan.steps?.length) {
        const text = `TASK EXECUTION PLAN: ${t.title}\nID: ${t.id}\nCategory: ${t.category}\nAssignee: ${t.assignedTo}\n\nSUMMARY:\n${t.executionPlan.summary}\n\nEXECUTION STEPS:\n${t.executionPlan.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nCHECKLIST:\n${t.executionPlan.checklist?.map(c => `[${c.done ? 'X' : ' '}] ${c.text}`).join('\n') || ''}\n\nTIPS:\n${t.executionPlan.founderTips || ''}`;
        
        documents.push({
          id: `doc-plan-${t.id}`,
          title: `${t.title} (Action Plan)`,
          category: t.category,
          type: 'plan',
          date: 'Active',
          content: text,
          downloadFilename: `${t.id}_action_plan.txt`
        });
      }

      if (t.executionPlan.draftMessage) {
        documents.push({
          id: `doc-draft-${t.id}`,
          title: `Pre-Drafted Message: ${t.title}`,
          category: t.category,
          type: 'draft',
          date: 'Active',
          content: t.executionPlan.draftMessage,
          downloadFilename: `${t.id}_message_draft.txt`
        });
      }
    }
  });

  inquiries.forEach((inq) => {
    const draft = `Dear ${inq.parentName},\nThank you for reaching out regarding admission for ${inq.childName} (${inq.grade}). We invite you for a tour of our learning campus.`;
    documents.push({
      id: `doc-inq-${inq.id}`,
      title: `Parent Tour Inquiry: ${inq.parentName}`,
      category: 'Admissions',
      type: 'inquiry',
      date: inq.dateLogged || 'Recent',
      content: draft,
      downloadFilename: `inquiry_${inq.id}_draft.txt`
    });
  });

  const filteredDocs = documents.filter((doc) => {
    if (selectedType !== 'all' && doc.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return doc.title.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDocId(id);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  const handleDownload = (doc: LibraryDocItem) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header: Locked 1-word heading with Back arrow */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Library
          </h1>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
          {documents.length} Items
        </span>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents & drafts..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'plan', 'draft', 'inquiry'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                  selectedType === type
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type === 'all' ? 'All Files' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Document Cards List */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-700">No Documents Found</h3>
            <p className="text-xs text-slate-400">
              Generated execution briefs, message drafts, and parent correspondence will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
                        {doc.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {doc.category}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1 truncate">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(doc.id, doc.content)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      title="Copy Content"
                    >
                      {copiedDocId === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(doc.content)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                  {doc.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
