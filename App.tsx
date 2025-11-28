import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/landing/LandingPage';
import { PresenterDashboard } from './components/presenter/PresenterDashboard';
import { ParticipantView } from './components/participant/ParticipantView';
import { SessionState, Slide, SlideType, STORAGE_KEY } from './types';
import { INITIAL_SESSION } from './services/mockData';

const App: React.FC = () => {
  // Initialize view based on URL query parameter
  const [view, setView] = useState<'landing' | 'teacher' | 'student'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'presenter') return 'teacher';
      if (mode === 'participant') return 'student';
    }
    return 'landing';
  });

  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);

  // --- Synchronization Logic using LocalStorage ---
  
  // 1. Load initial state from storage if exists, else use Mock
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    } else {
        // Initialize storage with mock data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SESSION));
    }
  }, []);

  // 2. Listen for storage events (updates from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSession(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Helper to update session state AND local storage
  const updateSessionGlobal = useCallback((newSession: SessionState) => {
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  }, []);

  // --- Handlers ---

  const handleEnterStudent = (code: string) => {
    // Update URL to reflect mode, allowing refresh to stay on page
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'participant');
    window.history.pushState({}, '', url);
    setView('student');
  };

  const handleEnterTeacher = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'presenter');
    window.history.pushState({}, '', url);
    setView('teacher');
  };

  const handleExit = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
    setView('landing');
  };

  const handleStudentResponse = (slideId: string, value: string) => {
    // Simulate backend updating the results
    const newSession = { ...session };
    const slideIndex = newSession.slides.findIndex(s => s.id === slideId);
    
    if (slideIndex === -1) return;

    const slide = newSession.slides[slideIndex];

    if (slide.type === SlideType.POLL && slide.options) {
      const optionIndex = slide.options.findIndex(o => o.id === value);
      if (optionIndex !== -1) {
        slide.options[optionIndex].count += 1;
      }
    } else if (slide.type === SlideType.WORD_CLOUD) {
      if (!slide.words) slide.words = [];
      const existingWord = slide.words.find(w => w.text === value);
      if (existingWord) {
        existingWord.count += 1;
      } else {
        slide.words.push({ text: value, count: 1 });
      }
    } else if (slide.type === SlideType.QNA) {
        if (!slide.qnaEntries) slide.qnaEntries = [];
        slide.qnaEntries.unshift(value);
    }

    updateSessionGlobal(newSession);
  };

  // --- Render ---

  if (view === 'teacher') {
    return (
      <Layout fullScreen>
        <PresenterDashboard 
          session={session} 
          updateSession={updateSessionGlobal}
          onExit={handleExit}
        />
      </Layout>
    );
  }

  if (view === 'student') {
    return (
      <Layout>
        <ParticipantView 
          session={session}
          onResponse={handleStudentResponse}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <LandingPage 
        onEnterStudent={handleEnterStudent}
        onEnterTeacher={handleEnterTeacher}
      />
    </Layout>
  );
};

export default App;