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

import { DashboardView } from './components/views/DashboardView';
import { TaskBoardView } from './components/views/TaskBoardView';
import { TaskDetailPage } from './components/views/TaskDetailPage';
import { MamaBearView } from './components/views/MamaBearView';
import { CommsHubView } from './components/views/CommsHubView';
import { SchoolHubView } from './components/views/SchoolHubView';
import { GoogleSettingsView } from './components/views/GoogleSettingsView';
import { StoryCardsPageView } from './components/views/StoryCardsPageView';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  // Navigation: 5 core tabs ('dashboard', 'tasks', 'mamabear', 'comms', 'school')
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Full-page task viewing (No dialog boxes - full pager!)
  const [viewingTask, setViewingTask] = useState<TaskItem | null>(null);
  const [showGooglePortal, setShowGooglePortal] = useState<boolean>(false);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [showStoryCardsPage, setShowStoryCardsPage] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

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

  // Core Data State with localStorage caching
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('mb_tasks_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load cached tasks', e);
    }
    return ALL_TASKS;
  });

  const [nudges, setNudges] = useState<VoiceNudge[]>(INITIAL_NUDGES);
  const [inquiries, setInquiries] = useState<ParentInquiry[]>(INITIAL_INQUIRIES);
  const [facilityZones, setFacilityZones] = useState<FacilityZone[]>(INITIAL_FACILITY_ZONES);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [academicPrograms, setAcademicPrograms] = useState<AcademicProgram[]>([]);
  const [vendors, setVendors] = useState<LocalVendor[]>([]);
  const [reviews, setReviews] = useState<QualityReview[]>([]);
  const [handoff, setHandoff] = useState<DailyHandoff | null>(null);

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
          const sData = await statusRes.json();
          setBaileysStatus(sData);
        }
        if (cardsRes && cardsRes.ok) {
          const cData = await cardsRes.json();
          if (cData.story_cards && Array.isArray(cData.story_cards)) {
            setStoryCards(cData.story_cards);
          }
        }
      } catch (err) {
        // silent fallback
      }
    };

    fetchBaileys();
    const interval = setInterval(fetchBaileys, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectBaileys = async () => {
    try {
      const res = await fetch('/api/baileys/connect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBaileysStatus(data);
      }
    } catch (err) {
      console.error('Failed to trigger Baileys connect', err);
    }
  };

  const handleDisconnectBaileys = async () => {
    try {
      const res = await fetch('/api/baileys/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBaileysStatus(data);
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
        if (data.academicPrograms) setAcademicPrograms(data.academicPrograms);
        if (data.vendors) setVendors(data.vendors);
        if (data.reviews) setReviews(data.reviews);
        if (data.handoff) setHandoff(data.handoff);
        if (data.setupConfig) {
          setSetupConfig(data.setupConfig);
          try {
            localStorage.setItem('mb_setup_config', JSON.stringify(data.setupConfig));
          } catch (e) {}
        }
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
    } catch (e) {
      // ignore
    }
  }, [tasks]);

  const handleOpenTaskDetail = (task: TaskItem) => {
    setViewingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromTaskDetail = () => {
    setViewingTask(null);
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (viewingTask && viewingTask.id === updatedTask.id) {
      setViewingTask(updatedTask);
    }
    syncTaskToSupabase(updatedTask);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as TaskItem['status'] };
        syncTaskToSupabase(updated);
        return updated;
      }
      return t;
    }));
  };

  const handleSendNudge = (nudge: VoiceNudge) => {
    setNudges(prev => [nudge, ...prev]);
    syncNudgeToSupabase(nudge);
  };

  const handleAddInquiry = (inquiry: ParentInquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
    syncInquiryToSupabase(inquiry);
  };

  const handleUpdateInquiryStatus = (id: string, status: ParentInquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    syncInquiryStatusToSupabase(id, status);
  };

  const handleUpdateZoneProgress = (id: string, progress: number) => {
    setFacilityZones(prev => prev.map(z => {
      if (z.id === id) {
        const status = progress === 100 ? 'Ready for Kids' : progress >= 75 ? 'Furnished' : z.status;
        syncZoneProgressToSupabase(id, progress, status);
        return { ...z, progress, status };
      }
      return z;
    }));
  };

  const handleSaveSetup = (newConfig: SetupConfig) => {
    setSetupConfig(newConfig);
    setShowSetupModal(false);
    try {
      localStorage.setItem('mb_setup_config', JSON.stringify(newConfig));
    } catch (e) {}
    syncSetupToSupabase(newConfig);
  };

  const handleAddStaff = (member: StaffMember) => {
    setStaff(prev => [member, ...prev]);
    syncStaffToSupabase(member);
  };

  const handleUpdateStaffVerification = (id: string, policeVerified?: boolean, firstAidCertified?: boolean) => {
    setStaff(prev => prev.map(m => m.id === id ? {
      ...m,
      policeVerified: policeVerified !== undefined ? policeVerified : m.policeVerified,
      firstAidCertified: firstAidCertified !== undefined ? firstAidCertified : m.firstAidCertified
    } : m));
    syncStaffVerificationToSupabase(id, policeVerified, firstAidCertified);
  };

  const handleAddExpense = (expense: ExpenseItem) => {
    setExpenses(prev => [expense, ...prev]);
    syncExpenseToSupabase(expense);
  };

  const handleSaveAcademicProgram = (program: AcademicProgram) => {
    setAcademicPrograms(prev => {
      const exists = prev.some(p => p.slug === program.slug);
      return exists ? prev.map(p => p.slug === program.slug ? program : p) : [...prev, program];
    });
    syncCurriculumToSupabase(program);
  };

  const handleAddVendor = (vendor: LocalVendor) => {
    setVendors(prev => [vendor, ...prev]);
    syncVendorToSupabase(vendor);
  };

  const handleAddReview = (review: QualityReview) => {
    setReviews(prev => [review, ...prev]);
    syncReviewToSupabase(review);
  };

  const handleUpdateHandoff = (newHandoff: DailyHandoff) => {
    setHandoff(newHandoff);
    syncHandoffToSupabase(newHandoff);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900 font-sans pb-24">
      
      {/* Streamlined Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setViewingTask(null);
          setShowGooglePortal(false);
          setShowSetupModal(false);
          setShowStoryCardsPage(false);
          setCurrentTab(tab);
        }}
        googleUser={googleUser}
        hasGoogleToken={hasGoogleToken}
        isSupabaseConnected={isSupabaseConnected}
        setupConfig={setupConfig}
        onOpenGoogleSettings={() => {
          setViewingTask(null);
          setShowSetupModal(false);
          setShowStoryCardsPage(false);
          setShowGooglePortal(true);
        }}
        onOpenSetup={() => {
          setViewingTask(null);
          setShowGooglePortal(false);
          setShowStoryCardsPage(false);
          setShowSetupModal(true);
        }}
        onOpenStoryCards={() => {
          setViewingTask(null);
          setShowGooglePortal(false);
          setShowSetupModal(false);
          setShowStoryCardsPage(true);
        }}
        onAuthSuccess={(user, token) => {
          setGoogleUser(user);
          setHasGoogleToken(!!token);
        }}
        onAuthLogout={() => {
          setGoogleUser(null);
          setHasGoogleToken(false);
        }}
      />

      {/* Unique Executive Story Cards Screen */}
      {showStoryCardsPage && (
        <StoryCardsPageView
          cards={storyCards}
          onApproveAction={handleApproveStoryCard}
          onDismiss={handleDismissStoryCard}
          onClose={() => setShowStoryCardsPage(false)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {/* Dedicated Setup & School Rules Wizard */}
        {showSetupModal ? (
          <SetupWizard
            initialConfig={setupConfig}
            onSaveConfig={handleSaveSetup}
            onCancel={() => setShowSetupModal(false)}
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
            onConnectBaileys={handleConnectBaileys}
            onDisconnectBaileys={handleDisconnectBaileys}
          />
        ) : viewingTask ? (
          <TaskDetailPage
            task={viewingTask}
            onBack={handleBackFromTaskDetail}
            onTaskUpdated={handleUpdateTask}
            userEmail={googleUser?.email}
          />
        ) : (
          <>
            {/* 1. Launch Hub (Home / Dashboard) */}
            {currentTab === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                setupConfig={setupConfig}
                storyCards={storyCards}
                baileysStatus={baileysStatus}
                onConnectBaileys={handleConnectBaileys}
                onDisconnectBaileys={handleDisconnectBaileys}
                onApproveStoryCard={handleApproveStoryCard}
                onDismissStoryCard={handleDismissStoryCard}
                onOpenTaskModal={handleOpenTaskDetail}
                onToggleTask={handleToggleTaskStatus}
                onNavigateTab={(tab) => {
                  if (['admissions', 'facility', 'academics', 'toddlerlab', 'finance', 'staff', 'kotahub', 'settings'].includes(tab)) {
                    setCurrentTab('school');
                  } else {
                    setCurrentTab(tab);
                  }
                }}
              />
            )}

            {/* 2. Master Tasks Library (All 400 Tasks Shared & Reassignable) */}
            {currentTab === 'tasks' && (
              <TaskBoardView
                tasks={tasks}
                onOpenTaskModal={handleOpenTaskDetail}
                onUpdateTask={handleUpdateTask}
              />
            )}

            {/* 3. MamaBear AI 🐻 Center Tab */}
            {currentTab === 'mamabear' && (
              <MamaBearView
                activeFounder="academics"
                onNavigateToTasks={() => setCurrentTab('tasks')}
              />
            )}

            {/* 4. Chats Tab (Google Chat, Gmail, WhatsApp) */}
            {currentTab === 'comms' && (
              <CommsHubView
                nudges={nudges}
                onSendNudge={handleSendNudge}
                inquiries={inquiries}
                staff={staff}
                vendors={vendors}
                setupConfig={setupConfig}
                baileysStatus={baileysStatus}
                onConnectBaileys={handleConnectBaileys}
                onDisconnectBaileys={handleDisconnectBaileys}
              />
            )}

            {/* 5. School Operations Hub (Admissions, Facility, Academics, Toddlers, Capex/Finances, Staff, Kota Hub, Google) */}
            {currentTab === 'school' && (
              <SchoolHubView
                activeFounder="academics"
                inquiries={inquiries}
                onAddInquiry={handleAddInquiry}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
                facilityZones={facilityZones}
                onUpdateZoneProgress={handleUpdateZoneProgress}
                setupConfig={setupConfig}
                staff={staff}
                onAddStaff={handleAddStaff}
                onUpdateStaffVerification={handleUpdateStaffVerification}
                expenses={expenses}
                onAddExpense={handleAddExpense}
                academicPrograms={academicPrograms}
                onSaveAcademicProgram={handleSaveAcademicProgram}
                vendors={vendors}
                onAddVendor={handleAddVendor}
                reviews={reviews}
                onAddReview={handleAddReview}
                handoff={handoff}
                onUpdateHandoff={handleUpdateHandoff}
                googleUser={googleUser}
                hasGoogleToken={hasGoogleToken}
                onAuthSuccess={(u, t) => {
                  setGoogleUser(u);
                  setHasGoogleToken(!!t);
                }}
                onAuthLogout={() => {
                  setGoogleUser(null);
                  setHasGoogleToken(false);
                }}
                baileysStatus={baileysStatus}
                onConnectBaileys={handleConnectBaileys}
                onDisconnectBaileys={handleDisconnectBaileys}
              />
            )}
          </>
        )}
      </main>

      {/* Locked Bottom Footer Navigation (5 Tabs: Home, Tasks, MamaBear AI, Chats, School) */}
      <LockedFooter
        currentTab={viewingTask ? 'tasks' : currentTab}
        onSelectTab={(tab) => {
          setViewingTask(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalTaskCount={tasks.length}
        unreadCommsCount={nudges.length > 0 ? nudges.length : 3}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

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
