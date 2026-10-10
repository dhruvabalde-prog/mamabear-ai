import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  initAuth 
} from './services/firebaseAuth';
import { ALL_TASKS } from './data/tasksLibrary';
import { 
  CO_FOUNDERS, 
  INITIAL_NUDGES, 
  INITIAL_INQUIRIES, 
  INITIAL_FACILITY_ZONES,
  INITIAL_STAFF,
  INITIAL_EXPENSES,
  DEFAULT_SETUP_CONFIG,
  getCoFounders
} from './data/initialData';
import { TaskItem, VoiceNudge, ParentInquiry, FacilityZone, SetupConfig, StoryCard, BaileysConnectionStatus } from './types';
import { 
  fetchInitialDataFromSupabase, 
  syncTaskToSupabase, 
  syncInquiryToSupabase, 
  syncInquiryStatusToSupabase,
  syncZoneProgressToSupabase,
  syncNudgeToSupabase,
  syncSetupToSupabase
} from './services/supabaseService';

import { Navbar } from './components/Navbar';
import { LockedFooter } from './components/LockedFooter';
import { SetupWizard } from './components/SetupWizard';
import { AppDrawer, ChatSessionSummary } from './components/AppDrawer';

import { DashboardView } from './components/views/DashboardView';
import { TaskBoardView } from './components/views/TaskBoardView';
import { TaskDetailPage } from './components/views/TaskDetailPage';
import { MamaBearView } from './components/views/MamaBearView';
import { CommsHubView } from './components/views/CommsHubView';
import { SchoolHubView } from './components/views/SchoolHubView';
import { GoogleSettingsView } from './components/views/GoogleSettingsView';
import { WhatsAppPairingPageView } from './components/views/WhatsAppPairingPageView';
import { StoryCardsPageView } from './components/views/StoryCardsPageView';
import { ConnectedAppsView } from './components/views/ConnectedAppsView';
import { LibraryView } from './components/views/LibraryView';
import { ScheduleAutomationsView } from './components/views/ScheduleAutomationsView';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  // Navigation: 5 core tabs ('dashboard', 'tasks', 'mamabear', 'comms', 'school')
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Full-page task viewing (No dialog boxes - full pager!)
  const [viewingTask, setViewingTask] = useState<TaskItem | null>(null);
  const [showGooglePortal, setShowGooglePortal] = useState<boolean>(false);
  const [showWhatsAppPairing, setShowWhatsAppPairing] = useState<boolean>(false);
  const [showConnectedApps, setShowConnectedApps] = useState<boolean>(false);
  const [showLibrary, setShowLibrary] = useState<boolean>(false);
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [showStoryCardsPage, setShowStoryCardsPage] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Chat sessions list for left drawer
  const [chatSessions, setChatSessions] = useState<ChatSessionSummary[]>(() => {
    try {
      const saved = localStorage.getItem('mb_chat_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'default', title: 'Main Operations Chat', timestamp: 'Today', lastMessage: 'MamaBear AI ready' }
    ];
  });
  const [activeChatId, setActiveChatId] = useState<string>('default');

  // Baileys WhatsApp & Executive Operations Story Cards State
  const [baileysStatus, setBaileysStatus] = useState<BaileysConnectionStatus>({ status: 'disconnected' });
  const [storyCards, setStoryCards] = useState<StoryCard[]>([]);

  // Setup / School Configuration State
  const [setupConfig, setSetupConfig] = useState<SetupConfig | null>(() => {
    try {
      const saved = localStorage.getItem('mb_setup_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_SETUP_CONFIG;
  });

  // Core Data State
  const DATA_VERSION = 'v3_zero_clean';
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const savedVersion = localStorage.getItem('mb_data_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('mb_tasks_data');
        if (saved) return JSON.parse(saved);
      } else {
        localStorage.removeItem('mb_tasks_data');
        localStorage.setItem('mb_data_version', DATA_VERSION);
      }
    } catch (e) {
      console.warn('Failed to load cached tasks', e);
    }
    return ALL_TASKS;
  });

  const [nudges, setNudges] = useState<VoiceNudge[]>(INITIAL_NUDGES);
  const [inquiries, setInquiries] = useState<ParentInquiry[]>(INITIAL_INQUIRIES);
  const [facilityZones, setFacilityZones] = useState<FacilityZone[]>(INITIAL_FACILITY_ZONES);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [handoff, setHandoff] = useState(null);

  // Google Workspace Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(false);

  // Poll / Fetch Baileys status and Story Cards
  useEffect(() => {
    const fetchBaileys = async () => {
      try {
        const [statusRes, cardsRes] = await Promise.all([
          fetch('/api/baileys/status').catch(() => null),
          fetch('/api/baileys/cards').catch(() => null)
        ]);
        if (statusRes && statusRes.ok) {
          const rawText = await statusRes.text();
          try {
            const sData = JSON.parse(rawText);
            setBaileysStatus(sData);
          } catch (e) {}
        }
        if (cardsRes && cardsRes.ok) {
          const rawText = await cardsRes.text();
          try {
            const cData = JSON.parse(rawText);
            if (cData.story_cards && Array.isArray(cData.story_cards)) {
              setStoryCards(cData.story_cards);
            }
          } catch (e) {}
        }
      } catch (err) {}
    };

    fetchBaileys();
    const interval = setInterval(fetchBaileys, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectBaileys = async () => {
    try {
      const res = await fetch('/api/baileys/connect', { method: 'POST' });
      if (res.ok) {
        const raw = await res.text();
        try {
          const data = JSON.parse(raw);
          setBaileysStatus(data);
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to trigger Baileys connect', err);
    }
  };

  const handleDisconnectBaileys = async () => {
    try {
      const res = await fetch('/api/baileys/disconnect', { method: 'POST' });
      if (res.ok) {
        const raw = await res.text();
        try {
          const data = JSON.parse(raw);
          setBaileysStatus(data);
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to trigger Baileys disconnect', err);
    }
  };

  const handleApproveStoryCard = async (card: StoryCard) => {
    try {
      if (card.pre_drafted_action.reply_text) {
        await fetch('/api/baileys/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: card.chat_id,
            text: card.pre_drafted_action.reply_text,
            cardId: card.card_id
          })
        });
      }
      setStoryCards(prev => prev.filter(c => c.card_id !== card.card_id));
    } catch (err) {
      console.error('Failed to dispatch story card action', err);
    }
  };

  const handleDismissStoryCard = async (cardId: string) => {
    try {
      await fetch('/api/baileys/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId })
      });
      setStoryCards(prev => prev.filter(c => c.card_id !== cardId));
    } catch (err) {
      console.error('Failed to dismiss card', err);
    }
  };

  // Fetch initial state from Supabase
  useEffect(() => {
    fetchInitialDataFromSupabase().then(data => {
      if (data) {
        if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
        if (data.inquiries && data.inquiries.length > 0) setInquiries(data.inquiries);
        if (data.facilityZones && data.facilityZones.length > 0) setFacilityZones(data.facilityZones);
        if (data.nudges && data.nudges.length > 0) setNudges(data.nudges);
        if (data.staff) setStaff(data.staff);
        if (data.expenses) setExpenses(data.expenses);
        setIsSupabaseConnected(true);
      }
    });
  }, []);

  // Initialize Auth Listener on Mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasGoogleToken(!!token);
      },
      () => {
        setGoogleUser(null);
        setHasGoogleToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save modified tasks with execution plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mb_tasks_data', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  const handleSaveSetup = (newConfig: SetupConfig) => {
    setSetupConfig(newConfig);
    try {
      localStorage.setItem('mb_setup_config', JSON.stringify(newConfig));
    } catch (e) {}
    syncSetupToSupabase(newConfig);
    setShowSetupModal(false);
  };

  const handleOpenTaskDetail = (task: TaskItem) => {
    setViewingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromTaskDetail = () => {
    setViewingTask(null);
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (viewingTask?.id === updatedTask.id) {
      setViewingTask(updatedTask);
    }
    syncTaskToSupabase(updatedTask);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated = { ...task, status: nextStatus };
    handleUpdateTask(updated);
  };

  const handleAddInquiry = (inquiry: ParentInquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
    syncInquiryToSupabase(inquiry);
  };

  const handleUpdateInquiryStatus = (id: string, status: ParentInquiry['status']) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    syncInquiryStatusToSupabase(id, status);
  };

  const handleUpdateZoneProgress = (id: string, progress: number) => {
    setFacilityZones(prev => prev.map(z => z.id === id ? { ...z, progress } : z));
    syncZoneProgressToSupabase(id, progress);
  };

  const handleSendNudge = (nudge: VoiceNudge) => {
    setNudges(prev => [nudge, ...prev]);
    syncNudgeToSupabase(nudge);
  };

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newSession: ChatSessionSummary = {
      id: newId,
      title: `Chat ${chatSessions.length + 1}`,
      timestamp: 'Just now',
      lastMessage: 'Started new chat'
    };
    const updated = [newSession, ...chatSessions];
    setChatSessions(updated);
    setActiveChatId(newId);
    try {
      localStorage.setItem('mb_chat_sessions', JSON.stringify(updated));
    } catch (e) {}
    setCurrentTab('mamabear');
  };

  const handleUpdateChatHistory = (id: string, text: string) => {
    setChatSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, lastMessage: text, timestamp: 'Just now' } : s);
      try {
        localStorage.setItem('mb_chat_sessions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Determine current page title (1-2 words)
  const isSpecialPage = showGooglePortal || showWhatsAppPairing || showConnectedApps || showLibrary || showScheduled || viewingTask;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900 font-sans pb-20">
      
      {/* Top Navbar: Heading locked in header, configure button removed, logo opens left drawer */}
      {!isSpecialPage && (
        <Navbar
          currentTab={currentTab}
          onOpenDrawer={() => setShowDrawer(true)}
          googleUser={googleUser}
          hasGoogleToken={hasGoogleToken}
          onOpenGoogleSettings={() => {
            setViewingTask(null);
            setShowWhatsAppPairing(false);
            setShowGooglePortal(true);
          }}
          onOpenStoryCards={() => {
            setViewingTask(null);
            setShowStoryCardsPage(true);
          }}
        />
      )}

      {/* Left Drawer */}
      <AppDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onNewChat={handleNewChat}
        onOpenScheduled={() => {
          setShowScheduled(true);
        }}
        onOpenLibrary={() => {
          setShowLibrary(true);
        }}
        onOpenConnectedApps={() => {
          setShowConnectedApps(true);
        }}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setCurrentTab('mamabear');
        }}
      />

      {/* Executive Story Cards Screen */}
      {showStoryCardsPage && (
        <StoryCardsPageView
          cards={storyCards}
          onApproveAction={handleApproveStoryCard}
          onDismiss={handleDismissStoryCard}
          onClose={() => setShowStoryCardsPage(false)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full mx-auto">
        {showLibrary ? (
          <LibraryView
            onBack={() => setShowLibrary(false)}
            tasks={tasks}
            inquiries={inquiries}
          />
        ) : showScheduled ? (
          <ScheduleAutomationsView
            onBack={() => setShowScheduled(false)}
          />
        ) : showConnectedApps ? (
          <ConnectedAppsView
            onBack={() => setShowConnectedApps(false)}
            user={googleUser}
            hasToken={hasGoogleToken}
            onAuthSuccess={(u, t) => {
              setGoogleUser(u);
              setHasGoogleToken(!!t);
            }}
            onAuthLogout={() => {
              setGoogleUser(null);
              setHasGoogleToken(false);
            }}
          />
        ) : showWhatsAppPairing ? (
          <WhatsAppPairingPageView
            onBack={() => setShowWhatsAppPairing(false)}
            status={baileysStatus}
            onConnect={handleConnectBaileys}
            onDisconnect={handleDisconnectBaileys}
          />
        ) : showGooglePortal ? (
          <GoogleSettingsView
            user={googleUser}
            hasToken={hasGoogleToken}
            onAuthSuccess={(u, t) => {
              setGoogleUser(u);
              setHasGoogleToken(!!t);
            }}
            onAuthLogout={() => {
              setGoogleUser(null);
              setHasGoogleToken(false);
            }}
            onClose={() => setShowGooglePortal(false)}
            baileysStatus={baileysStatus}
            onOpenWhatsAppPairing={() => {
              setShowGooglePortal(false);
              setShowWhatsAppPairing(true);
            }}
            onOpenAdmin={() => {
              setShowGooglePortal(false);
              setShowAdminModal(true);
            }}
          />
        ) : viewingTask ? (
          <TaskDetailPage
            task={viewingTask}
            onBack={handleBackFromTaskDetail}
            onTaskUpdated={handleUpdateTask}
            userEmail={googleUser?.email}
          />
        ) : (
          <div className="px-3 sm:px-6 pt-3 sm:pt-4">
            {/* 1. Launch Hub (Home) */}
            {currentTab === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                setupConfig={setupConfig}
                storyCards={storyCards}
                baileysStatus={baileysStatus}
                onConnectBaileys={() => setShowWhatsAppPairing(true)}
                onDisconnectBaileys={handleDisconnectBaileys}
                onApproveStoryCard={handleApproveStoryCard}
                onDismissStoryCard={handleDismissStoryCard}
                onOpenTaskModal={handleOpenTaskDetail}
                onToggleTask={handleToggleTaskStatus}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {/* 2. Master Tasks */}
            {currentTab === 'tasks' && (
              <TaskBoardView
                tasks={tasks}
                onOpenTaskModal={handleOpenTaskDetail}
                onUpdateTask={handleUpdateTask}
              />
            )}

            {/* 3. MamaBear AI */}
            {currentTab === 'mamabear' && (
              <MamaBearView
                activeChatId={activeChatId}
                onUpdateChatHistory={handleUpdateChatHistory}
                onNavigateToTasks={() => setCurrentTab('tasks')}
              />
            )}

            {/* 4. Chats Tab */}
            {currentTab === 'comms' && (
              <CommsHubView
                nudges={nudges}
                onSendNudge={handleSendNudge}
                inquiries={inquiries}
                vendors={vendors}
                setupConfig={setupConfig}
              />
            )}

            {/* 5. School Operations Hub */}
            {currentTab === 'school' && (
              <SchoolHubView
                inquiries={inquiries}
                onAddInquiry={handleAddInquiry}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
                facilityZones={facilityZones}
                onUpdateZoneProgress={handleUpdateZoneProgress}
                setupConfig={setupConfig}
                staff={staff}
                expenses={expenses}
              />
            )}
          </div>
        )}
      </main>

      {/* Locked Bottom Footer Navigation (Hidden on detail / special pages) */}
      {!isSpecialPage && (
        <LockedFooter
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setViewingTask(null);
            setShowGooglePortal(false);
            setShowWhatsAppPairing(false);
            setShowConnectedApps(false);
            setShowLibrary(false);
            setShowScheduled(false);
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          totalTaskCount={tasks.length}
          unreadCommsCount={nudges.length > 0 ? nudges.length : 0}
          onOpenAdmin={() => setShowAdminModal(true)}
        />
      )}

      {/* Global Secure Admin Console Modal */}
      <AdminPanelModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        baileysStatus={baileysStatus}
        onResetBaileys={handleDisconnectBaileys}
      />
    </div>
  );
}
