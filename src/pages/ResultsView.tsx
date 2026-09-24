import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mcelroy2023 } from '../content/mcelroy2023';
import { supabase } from '../lib/supabase';
import { FileText, ArrowLeft } from 'lucide-react';

export default function ResultsView() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!code) return;
      const { data: sessionData } = await supabase.from('journal_sessions').select('*').eq('join_code', code.toUpperCase()).single();
      if (!sessionData) return;
      
      const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('session_id', sessionData.id);
      
      const { data: responses } = await supabase.from('responses').select('*').eq('session_id', sessionData.id);
      
      setData({ session: sessionData, participants: count, responses });
      setLoading(false);
    };
    
    fetchResults();
  }, [code]);

  if (loading) return <div className="p-8">Laddar resultat...</div>;
  if (!data) return <div className="p-8">Kunde inte ladda resultat för session {code}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline mb-8">
          <ArrowLeft size={20} /> Tillbaka till startsidan
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resultat: McElroy 2023</h1>
              <p className="text-slate-400">Journal Club Session: {code?.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-400">{data.participants}</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Deltagare</p>
            </div>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <FileText className="text-blue-500" /> SBU Granskning
            </h2>
            
            <div className="space-y-6">
              {mcelroy2023.sbuDomains.map((domain) => {
                const domainResponses = data.responses?.filter((r: any) => r.question_id === domain.id) || [];
                const total = domainResponses.length;
                const dist: Record<string, number> = {};
                domainResponses.forEach((r: any) => {
                  dist[r.answer] = (dist[r.answer] || 0) + 1;
                });
                
                return (
                  <div key={domain.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">{domain.title}</h3>
                    {total === 0 ? (
                      <p className="text-slate-500 italic">Inga svar registrerade.</p>
                    ) : (
                      <div className="space-y-3">
                        {mcelroy2023.sbuOptions.map(opt => {
                          const count = dist[opt.value] || 0;
                          const pct = Math.round((count / total) * 100);
                          if (count === 0) return null;
                          return (
                            <div key={opt.value} className="flex items-center gap-4">
                              <span className="w-24 font-medium text-sm text-slate-700 capitalize">{opt.label}</span>
                              <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-12 text-right font-bold text-slate-700">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
