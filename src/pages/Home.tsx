import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setIsHost = useAppStore(state => state.setIsHost);

  const handleCreateSession = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;

      const joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();

      const { error: insertError } = await supabase
        .from('journal_sessions')
        .insert([
          { 
            join_code: joinCode,
            host_id: authData.user?.id,
            status: 'lobby',
            current_stage: 0
          }
        ]);
        
      if (insertError) throw insertError;

      setIsHost(true);
      navigate(`/present/${joinCode}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ett fel uppstod vid skapandet av sessionen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <Activity size={56} className="text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">McElroy 2023</h1>
          <h2 className="text-blue-200 text-lg font-medium tracking-wide uppercase">The OR Debrief Challenge</h2>
        </div>
        
        <div className="p-8">
          <p className="text-slate-600 text-center mb-8 leading-relaxed">
            Psykologisk trygghet, hierarki och debriefing på operationssalen. Ett interaktivt journal club-format baserat på SBU:s mall för kvalitativ metodik.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
              <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-70" 
            onClick={handleCreateSession}
            disabled={loading}
          >
            {loading ? 'Skapar miljö...' : 'Starta Journal Club Session'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
