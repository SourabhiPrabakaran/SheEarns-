import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SheScorePage } from './pages/SheScorePage';
import { IndependencePage } from './pages/IndependencePage';
import { CommunityPage } from './pages/CommunityPage';
import { LessonPage } from './pages/LessonPage';
import { SheAIAssistant } from './components/common/SheAIAssistant';
import { InteractiveGradientBackground } from './components/InteractiveGradientBackground';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'landing',
        'onboarding',
        'dashboard',
        'score',
        'independence',
        'community',
        'learning-m1',
        'learning-m2',
        'learning-m3'
      ];
      if (validPages.includes(hash)) {
        return hash;
      }
    }
    return 'landing';
  });

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'landing',
        'onboarding',
        'dashboard',
        'score',
        'independence',
        'community',
        'learning-m1',
        'learning-m2',
        'learning-m3'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1e191b] font-sans selection:bg-[#f2ebe0] relative">
      {/* Subtle, interactive, slow-moving gradient mesh background */}
      <InteractiveGradientBackground />

      {/* Content Layer situated above the gradient mesh */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navbar appears on all views except the initial landing view */}
        {currentPage !== 'landing' && (
          <Navbar currentPage={currentPage} onNavigate={navigate} />
        )}

        {/* Main Content View Coordinator */}
        <main className="flex-1">
          {currentPage === 'landing' && (
            <LandingPage onStart={() => navigate('onboarding')} />
          )}

          {currentPage === 'onboarding' && (
            <OnboardingPage onComplete={() => navigate('dashboard')} />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={navigate} />
          )}

          {currentPage === 'score' && (
            <SheScorePage onNavigate={navigate} />
          )}

          {currentPage === 'independence' && (
            <IndependencePage onNavigate={navigate} />
          )}

          {currentPage === 'community' && (
            <CommunityPage onNavigate={navigate} />
          )}

          {currentPage === 'learning-m1' && (
            <LessonPage moduleId="m1" onNavigate={navigate} />
          )}

          {currentPage === 'learning-m2' && (
            <LessonPage moduleId="m2" onNavigate={navigate} />
          )}

          {currentPage === 'learning-m3' && (
            <LessonPage moduleId="m3" onNavigate={navigate} />
          )}
        </main>

        {/* Persistent Educational Disclaimer Footer */}
        <Footer />
      </div>

      {/* Global Floating SheAI Assistant on all in-app pages */}
      {currentPage !== 'landing' && <SheAIAssistant />}
    </div>
  );
};

export default App;
