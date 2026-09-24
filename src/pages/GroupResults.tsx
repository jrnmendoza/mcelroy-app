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
    const { data: overallData } = await supabase.from('overall_appraisal').select('user_id, assessment');
    if (overallData) {
      setTotal(overallData.length);
      const agg: Record<string, number> = {};
      overallData.forEach(row => {
        agg[row.assessment] = (agg[row.assessment] || 0) + 1;
        if (row.user_id === userId) {
          setMyAssessment(row.assessment);
        }
      });
      setAggregates(agg);
    }

    const { data: responsesData } = await supabase.from('responses').select('question_id, answer');
    if (responsesData) {
      const qAgg: Record<string, Record<string, number>> = {};
      responsesData.forEach(r => {
        if (!qAgg[r.question_id]) qAgg[r.question_id] = { Ja: 0, Nej: 0, Oklart: 0 };
        qAgg[r.question_id][r.answer] = (qAgg[r.question_id][r.answer] || 0) + 1;
      });
      
      let maxAgreement = 0;
      let minAgreement = 100;
      
      Object.entries(qAgg).forEach(([_, counts]) => {
        const totalForQ = Object.values(counts).reduce((a, b) => a + b, 0);
        if (totalForQ > 0) {
          const maxVotes = Math.max(...Object.values(counts));
          const agreePct = (maxVotes / totalForQ) * 100;
          if (agreePct > maxAgreement) maxAgreement = agreePct;
          if (agreePct < minAgreement) minAgreement = agreePct;
        }
      });

      setAgreementStats({ max: maxAgreement, min: minAgreement });
    }
  };

  const [agreementStats, setAgreementStats] = useState({ max: 0, min: 0 });

  const options = [
    "Obetydliga eller mindre brister",
    "Måttliga brister",
    "Stora brister, studien ingår inte i syntesen"
  ];

  if (total > 0 && total < 3) {
    return (
      <div className="animate-fade-in pb-20 p-8 text-center">
        <Users size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Väntar på fler svar</h2>
        <p className="text-slate-500">Gruppresultat visas när fler deltagare har svarat (minst 3 personer).</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-semibold">
        <BarChart3 size={16} />
        Resultat
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Gruppens sammanvägda bedömning</h1>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Totalt antal bedömningar</h2>
            <p className="text-slate-500 text-sm">Visar anonymiserad aggregerad data.</p>
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

      {total >= 3 && agreementStats.max > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-1">Högsta enighet i en fråga</h3>
            <p className="text-3xl font-extrabold text-green-600 mb-2">{Math.round(agreementStats.max)}%</p>
            <p className="text-xs text-slate-500">I den fråga där gruppen var mest överens svarade en majoritet lika.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-1">Största oenighet i en fråga</h3>
            <p className="text-3xl font-extrabold text-amber-600 mb-2">{Math.round(agreementStats.min)}%</p>
            <p className="text-xs text-slate-500 italic">Delad bedömning — gruppen tolkar artikelunderlaget olika.</p>
          </div>
        </div>
      )}
    </div>
  );
}
