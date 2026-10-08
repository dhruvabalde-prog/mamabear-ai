import React from 'react';
import { 
  Home, CheckSquare, MessageCircle, Building2 
} from 'lucide-react';

interface LockedFooterProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  totalTaskCount?: number;
  unreadCommsCount?: number;
  onOpenAdmin?: () => void;
}

export const LockedFooter: React.FC<LockedFooterProps> = ({
  currentTab,
  onSelectTab,
  totalTaskCount = 400,
  unreadCommsCount = 3,
  onOpenAdmin
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
        
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">Home</span>
        </button>

        {/* Tab 2: Tasks */}
        <button
          type="button"
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            currentTab === 'tasks' || currentTab === 'task-detail'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CheckSquare className={`w-5 h-5 ${currentTab === 'tasks' || currentTab === 'task-detail' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="absolute -top-1 -right-2 px-1 rounded-full bg-slate-100 text-slate-700 text-[8px] font-extrabold border border-slate-200">
              {totalTaskCount}
            </span>
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Tasks</span>
        </button>

        {/* Tab 3: CENTER AI AGENT - Inside boundary */}
        <button
          type="button"
          onClick={() => onSelectTab('mamabear')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            currentTab === 'mamabear'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            currentTab === 'mamabear'
              ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
              : 'bg-slate-100 text-slate-700'
          }`}>
            <span className="text-base select-none">🐻</span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">MamaBear</span>
        </button>

        {/* Tab 4: Chats Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('comms')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
            currentTab === 'comms'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageCircle className={`w-5 h-5 ${currentTab === 'comms' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {unreadCommsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 rounded-full bg-emerald-500 text-white text-[8px] font-extrabold">
                {unreadCommsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Chats</span>
        </button>

        {/* Tab 5: School */}
        <button
          type="button"
          onClick={() => onSelectTab('school')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            currentTab === 'school'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className={`w-5 h-5 ${currentTab === 'school' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">School</span>
        </button>

        {/* Discrete Admin Console trigger at the bottom */}
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors cursor-pointer shrink-0 ml-1 opacity-40 hover:opacity-100"
            title="Console"
          >
            <span className="text-[10px] select-none font-mono">⚙</span>
          </button>
        )}

      </div>
    </nav>
  );
};
