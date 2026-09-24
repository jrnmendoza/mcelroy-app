import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import type { SessionState } from '../lib/store';

// Placeholder for Stage components
import { Stage1Snapshot } from '../components/stages/Stage1Snapshot';
import { Stage2Detective } from '../components/stages/Stage2Detective';
import { Stage3Themes } from '../components/stages/Stage3Themes';
import { Stage4SBU } from '../components/stages/Stage4SBU';
import { Stage5Final } from '../components/stages/Stage5Final';

export default function ParticipantView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { session, setSession, setParticipantId } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!code) return;
      
      const { data, error } = await supabase
        .from('journal_sessions')
        .select('*')
        .eq('join_code', code.toUpperCase())
        .single();
        
      if (error) {
        setError('Ogiltig kod eller så kunde sessionen inte hittas.');
        setLoading(false);
        return;
      }
      
      setSession(data as SessionState);
      
      // Setup realtime subscription for session updates
      const channel = supabase.channel(`session_${data.id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'journal_sessions',
          filter: `id=eq.${data.id}`
        }, (payload) => {
          setSession(payload.new as SessionState);
        })
        .subscribe();
        
      setLoading(false);
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    fetchSession();
  }, [code, setSession]);

  const handleJoin = async () => {
    if (!session) return;
    setLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;
      
      const uid = authData.user?.id;
      
      // Try to join
      const { error: joinError } = await supabase
        .from('participants')
        .upsert([{ id: uid, session_id: session.id }], { onConflict: 'id,session_id' });
        
      if (joinError) throw joinError;
      
      setParticipantId(uid!);
      setJoined(true);
    } catch (err: any) {
      console.error(err);
      setError('Kunde inte ansluta till sessionen.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !joined) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">Laddar...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Ett fel uppstod</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg font-medium">Tillbaka</button>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-slate-900 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Gå med i session</h1>
            <div className="inline-block bg-slate-800 text-blue-400 font-mono text-xl font-bold px-4 py-2 rounded-lg mt-2 tracking-widest">
              {code?.toUpperCase()}
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-slate-600 mb-6">McElroy 2023 - The OR Debrief Challenge</p>
            <p className="text-xs text-slate-500 mb-6 text-left bg-slate-50 p-4 rounded-lg border border-slate-100">
              Du ansluter anonymt. Inga personuppgifter, namn eller e-postadresser sparas. Skriv aldrig in patientuppgifter eller identifierbar information om kollegor under övningen.
            </p>
            <button 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-70" 
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? 'Ansluter...' : 'Delta anonymt'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Game State
  const stage = session?.current_stage || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          <span className="font-bold text-slate-800 text-sm hidden sm:inline">McElroy 2023</span>
        </div>
        <div className="flex items-center gap-2">
          {session?.status === 'lobby' ? (
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">Väntar i lobby</span>
          ) : (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Uppdrag {stage} / 5</span>
          )}
        </div>
      </header>
      
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {session?.status === 'lobby' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Välkommen!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Ni ska tillsammans undersöka studien, testa er förståelse och göra en kritisk granskning enligt SBU.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Väntar på att spelledaren ska starta...
            </div>
          </div>
        )}

        {session?.status === 'active' && (
          <div className="animate-fade-in">
            {stage === 1 && <Stage1Snapshot />}
            {stage === 2 && <Stage2Detective />}
            {stage === 3 && <Stage3Themes />}
            {stage === 4 && <Stage4SBU />}
            {stage === 5 && <Stage5Final />}
          </div>
        )}

        {session?.status === 'completed' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mt-8 animate-fade-in">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Granskning klar!</h2>
            <p className="text-slate-600 mb-6 text-lg">
              Ni har nu genomfört en komplett SBU-granskning av artikeln.
            </p>
            <p className="text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              Titta på storskärmen för att se det gemensamma resultatet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
