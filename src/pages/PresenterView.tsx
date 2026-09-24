import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Activity, ChevronRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import type { SessionState } from '../lib/store';
import { mcelroy2023 } from '../content/mcelroy2023';
import classnames from 'classnames';

export default function PresenterView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { session, setSession, isHost } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [responsesCount, setResponsesCount] = useState(0);
  const [responsesDistribution, setResponsesDistribution] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isHost) {
      navigate('/');
      return;
    }

    const initHostSession = async () => {
      const { data, error } = await supabase
        .from('journal_sessions')
        .select('*')
        .eq('join_code', code?.toUpperCase())
        .single();
        
      if (error) {
        navigate('/');
        return;
      }
      
      setSession(data as SessionState);
      setLoading(false);

      // Subscription for participants
      const pChannel = supabase.channel(`public:participants:${data.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${data.id}` }, () => {
          fetchCounts(data.id);
        }).subscribe();

      // Subscription for responses
      const rChannel = supabase.channel(`public:responses:${data.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'responses', filter: `session_id=eq.${data.id}` }, () => {
          fetchResponses(data.id, data.active_question);
        }).subscribe();

      fetchCounts(data.id);
      if (data.active_question) {
        fetchResponses(data.id, data.active_question);
      }

      return () => {
        supabase.removeChannel(pChannel);
        supabase.removeChannel(rChannel);
      };
    };

    initHostSession();
  }, [code, isHost, navigate, setSession]);

  const fetchCounts = async (sessionId: string) => {
    const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('session_id', sessionId);
    setParticipantsCount(count || 0);
  };

  const fetchResponses = async (sessionId: string, activeQ: string | null) => {
    if (!activeQ) return;
    const { data } = await supabase.from('responses').select('answer').eq('session_id', sessionId).eq('question_id', activeQ);
    if (!data) return;
    
    setResponsesCount(data.length);
    
    const dist: Record<string, number> = {};
    data.forEach(r => {
      dist[r.answer] = (dist[r.answer] || 0) + 1;
    });
    setResponsesDistribution(dist);
  };

  const updateSession = async (updates: Partial<SessionState>) => {
    if (!session) return;
    const { data } = await supabase
      .from('journal_sessions')
      .update(updates)
      .eq('id', session.id)
      .select()
      .single();
      
    if (data) {
      setSession(data as SessionState);
      if (updates.active_question !== undefined) {
        fetchResponses(data.id, data.active_question);
      }
    }
  };

  const nextStage = () => {
    if (!session) return;
    const next = session.current_stage + 1;
    let updates: Partial<SessionState> = {
      current_stage: next,
      status: 'active',
      reveal_results: false,
      discussion_mode: false
    };

    if (next === 4) {
      updates.active_question = mcelroy2023.sbuDomains[0].id;
    } else if (next === 5) {
      updates.active_question = 'final_appraisal';
    } else if (next === 6) {
      updates.status = 'completed';
    } else {
      updates.active_question = null;
    }

    setResponsesDistribution({});
    setResponsesCount(0);
    updateSession(updates);
  };

  const SBUStageControl = () => {
    if (!session || session.current_stage !== 4) return null;
    const currentIndex = mcelroy2023.sbuDomains.findIndex(d => d.id === session.active_question);
    
    const handleNextDomain = () => {
      if (currentIndex < mcelroy2023.sbuDomains.length - 1) {
        updateSession({ 
          active_question: mcelroy2023.sbuDomains[currentIndex + 1].id,
          reveal_results: false,
          discussion_mode: false
        });
        setResponsesDistribution({});
        setResponsesCount(0);
      } else {
        nextStage(); // Go to Stage 5
      }
    };

    return (
      <div className="bg-slate-50 border-t border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-slate-800 text-lg">Värd-kontroller: SBU Domän {currentIndex + 1}</h4>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
            {responsesCount} / {participantsCount} svar
          </span>
        </div>

        <div className="flex gap-4">
          <button 
            className={classnames(
              "flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors",
              session.reveal_results 
                ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={() => updateSession({ reveal_results: true, discussion_mode: Object.keys(responsesDistribution).length > 1 })}
            disabled={session.reveal_results}
          >
            <BarChart3 size={20} />
            Visa Resultat
          </button>
          
          <button 
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            onClick={handleNextDomain}
            disabled={!session.reveal_results}
          >
            {currentIndex < mcelroy2023.sbuDomains.length - 1 ? 'Nästa SBU-fråga' : 'Vidare till Slutbedömning'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white p-8">Laddar session...</div>;

  const joinUrl = `${window.location.origin}${window.location.pathname}#/join/${code}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="bg-slate-950 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3 text-blue-400">
          <Activity size={24} />
          <h1 className="text-xl font-bold tracking-wider uppercase text-slate-200">Presenter Mode</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Users size={20} />
            <span className="font-bold text-lg">{participantsCount} anslutna</span>
          </div>
          <button className="text-slate-400 hover:text-white" onClick={() => navigate(`/results/${code}`)}>
            Visa rapport
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 flex flex-col max-w-6xl mx-auto w-full">
        {session?.status === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-3xl border border-slate-700/50 p-12">
            <div className="bg-white p-6 rounded-3xl mb-8">
              <QRCodeSVG value={joinUrl} size={300} />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-wider">{code?.toUpperCase()}</h2>
            <p className="text-xl text-slate-400 mb-12">Skanna QR-koden för att delta</p>
            
            <button 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl py-5 px-12 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
              onClick={nextStage}
            >
              Starta Sessionen <ChevronRight size={24} />
            </button>
          </div>
        )}

        {session?.status === 'active' && session.current_stage === 4 && (
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-800 rounded-t-3xl border border-slate-700 p-10 flex-1 relative overflow-hidden">
              {/* SBU Domain Content */}
              {mcelroy2023.sbuDomains.map((domain) => (
                domain.id === session.active_question && (
                  <div key={domain.id} className="animate-fade-in relative z-10">
                    <h2 className="text-3xl font-bold text-blue-400 mb-2">{domain.title}</h2>
                    <p className="text-2xl text-white font-medium mb-12 leading-relaxed">{domain.question}</p>
                    
                    {session.reveal_results ? (
                      <div className="space-y-6">
                        {mcelroy2023.sbuOptions.map(opt => {
                          const count = responsesDistribution[opt.value] || 0;
                          const percentage = responsesCount > 0 ? Math.round((count / responsesCount) * 100) : 0;
                          return (
                            <div key={opt.value} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                              <div className="flex justify-between items-end mb-3">
                                <span className="text-xl font-bold capitalize">{opt.label}</span>
                                <span className="text-2xl text-blue-400 font-bold">{percentage}% ({count})</span>
                              </div>
                              <div className="h-6 bg-slate-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        
                        {Object.keys(responsesDistribution).length > 1 && (
                          <div className="mt-8 p-6 bg-amber-900/30 border border-amber-700/50 rounded-xl flex items-center gap-4 animate-fade-in text-amber-200">
                            <span className="text-3xl">⚡</span>
                            <span className="text-2xl font-bold uppercase tracking-wider">Delad bedömning – Diskussion rekommenderas</span>
                          </div>
                        )}
                        {Object.keys(responsesDistribution).length === 1 && responsesCount > 0 && (
                          <div className="mt-8 p-6 bg-green-900/30 border border-green-700/50 rounded-xl flex items-center gap-4 animate-fade-in text-green-400">
                            <CheckCircle2 size={32} />
                            <span className="text-2xl font-bold uppercase tracking-wider">Stark samsyn</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-8"></div>
                        <p className="text-2xl text-slate-400 font-medium animate-pulse">Väntar på svar från gruppen...</p>
                        <p className="text-xl font-bold text-blue-400 mt-4">{responsesCount} av {participantsCount} har svarat</p>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
            <SBUStageControl />
          </div>
        )}

        {/* Catch-all for non-SBU stages in active mode */}
        {session?.status === 'active' && session.current_stage !== 4 && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-3xl border border-slate-700/50 p-12">
             <h2 className="text-4xl font-bold text-blue-400 mb-6">Fas {session.current_stage}</h2>
             <p className="text-2xl text-slate-300 mb-12 text-center max-w-3xl leading-relaxed">
               Detta är en platshållare för storskärmsvyn av denna fas. I en fullständig version skulle fasens innehåll (tex Tema-matchning) visualiseras här.
             </p>
             <button 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl py-5 px-12 rounded-2xl transition-all shadow-lg flex items-center gap-3"
              onClick={nextStage}
            >
              Gå till Fas {session.current_stage + 1} <ChevronRight size={24} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
