import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { BarChart3, Users, CheckCircle2 } from 'lucide-react';
import { calculateProgress } from '../lib/courseStructure';

export default function GroupResults() {
  const { userId, saveProgress } = useAppStore();
  const [aggregates, setAggregates] = useState<Record<string, number>>({});
  const [myAssessment, setMyAssessment] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (userId) {
      saveProgress('results', calculateProgress('results'));
      window.scrollTo(0, 0);
      fetchResults();
    }
    
    // Subscribe to changes in overall_appraisal
    const channel = supabase.channel('public:overall_appraisal')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'overall_appraisal' }, () => {
        fetchResults();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchResults = async () => {
    const { data } = await supabase.from('overall_appraisal').select('user_id, assessment');
    if (data) {
      setTotal(data.length);
      const agg: Record<string, number> = {};
      data.forEach(row => {
        agg[row.assessment] = (agg[row.assessment] || 0) + 1;
        if (row.user_id === userId) {
          setMyAssessment(row.assessment);
        }
      });
      setAggregates(agg);
    }
  };

  const options = [
    "Obetydliga eller mindre brister",
    "Måttliga brister",
    "Stora brister, studien ingår inte i syntesen"
  ];

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-semibold">
        <BarChart3 size={16} />
        Resultat
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Gruppens sammanvägda bedömning</h1>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Totalt antal bedömningar</h2>
            <p className="text-slate-500 text-sm">Denna sida uppdateras i realtid när kollegor svarar.</p>
          </div>
          <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Users size={20} />
            {total}
          </div>
        </div>

        <div className="space-y-6">
          {options.map(opt => {
            const count = aggregates[opt] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isMine = opt === myAssessment;
            
            return (
              <div key={opt}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{opt}</span>
                    {isMine && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Din bedömning</span>}
                  </div>
                  <span className="font-bold text-slate-600">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden flex items-center">
                  <div 
                    className={`h-full transition-all duration-1000 ${isMine ? 'bg-green-500' : 'bg-indigo-400'}`} 
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{count} röster</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
