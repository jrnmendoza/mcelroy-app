import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAppStore } from './lib/store';

import Layout from './components/Layout';
import Home from './pages/Home';
import StudySection from './pages/StudySection';
import InteractiveActivity from './pages/InteractiveActivity';
import AppraisalDomain from './pages/AppraisalDomain';
import AppraisalOverall from './pages/AppraisalOverall';
import GroupResults from './pages/GroupResults';
import ArticleViewer from './pages/ArticleViewer';

export default function App() {
  const { setUserId, loadProgress } = useAppStore();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
        } else {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          if (data.user) {
            setUserId(data.user.id);
          }
        }
        await loadProgress();
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [setUserId, loadProgress]);

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">Laddar McElroy 2023...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/study/:section" element={<StudySection />} />
          <Route path="/interactive/:activity" element={<InteractiveActivity />} />
          <Route path="/appraisal/overall" element={<AppraisalOverall />} />
          <Route path="/appraisal/:domain" element={<AppraisalDomain />} />
          <Route path="/results" element={<GroupResults />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/article" element={<ArticleViewer />} />
      </Routes>
    </Router>
  );
}
