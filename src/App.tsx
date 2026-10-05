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
  INITIAL_FACILITY_ZONES 
} from './data/initialData';
import { TaskItem, VoiceNudge, ParentInquiry, FacilityZone } from './types';
import { 
  fetchInitialDataFromSupabase, 
  syncTaskToSupabase, 
  syncInquiryToSupabase, 
  syncNudgeToSupabase 
} from './services/supabaseService';

import { Navbar } from './components/Navbar';
import { LockedFooter } from './components/LockedFooter';

import { DashboardView } from './components/views/DashboardView';
import { TaskBoardView } from './components/views/TaskBoardView';
import { TaskDetailPage } from './components/views/TaskDetailPage';
import { MamaBearView } from './components/views/MamaBearView';
import { CommsHubView } from './components/views/CommsHubView';
import { SchoolHubView } from './components/views/SchoolHubView';
import { GoogleSettingsView } from './components/views/GoogleSettingsView';

export default function App() {
  // Navigation: 5 core tabs ('dashboard', 'tasks', 'mamabear', 'comms', 'school')
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Full-page task viewing (No dialog boxes - full pager!)
  const [viewingTask, setViewingTask] = useState<TaskItem | null>(null);
  const [showGooglePortal, setShowGooglePortal] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

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

  // Google Workspace Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(false);

  // Fetch initial state from Supabase
  useEffect(() => {
    fetchInitialDataFromSupabase().then(data => {
      if (data) {
        if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
        if (data.inquiries && data.inquiries.length > 0) setInquiries(data.inquiries);
        if (data.facilityZones && data.facilityZones.length > 0) setFacilityZones(data.facilityZones);
        if (data.nudges && data.nudges.length > 0) setNudges(data.nudges);
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
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900 font-sans pb-24">
      
      {/* Streamlined Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setViewingTask(null);
          setShowGooglePortal(false);
          setCurrentTab(tab);
        }}
        googleUser={googleUser}
        hasGoogleToken={hasGoogleToken}
        isSupabaseConnected={isSupabaseConnected}
        onOpenGoogleSettings={() => {
          setViewingTask(null);
          setShowGooglePortal(true);
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

      {/* Main View Area */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {/* Dedicated Google Workspace & Gmail Portal */}
        {showGooglePortal ? (
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
      />
    </div>
  );
}
