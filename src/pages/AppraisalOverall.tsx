import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { calculateProgress, getPrevSection, getNextSection } from '../lib/courseStructure';

export default function AppraisalOverall() {
  const navigate = useNavigate();
  const { userId, saveProgress } = useAppStore();
  
  const [assessment, setAssessment] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      saveProgress('overall', calculateProgress('overall'));
      window.scrollTo(0, 0);
      loadAppraisal();
    }
  }, [userId]);

  const loadAppraisal = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('overall_appraisal')
      .select('assessment')
      .eq('user_id', userId)
      .single();
      
    if (data) {
      setAssessment(data.assessment);
    }
  };

  const saveAppraisal = async () => {
    if (!userId || !assessment) return;
    setSaving(true);
    await supabase.from('overall_appraisal').upsert({
      user_id: userId,
      article_id: 'mcelroy-2023',
      assessment,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    setSaving(false);
  };

  const goNext = async () => {
    await saveAppraisal();
    const next = getNextSection('overall');
    if (next) navigate(next.path);
  };

  const options = [
    "Obetydliga eller mindre brister",
    "Måttliga brister",
    "Stora brister, studien ingår inte i syntesen"
  ];

  const prevSection = getPrevSection('overall');

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-semibold">
        <ShieldCheck size={16} />
        SBU-granskning
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Samlad bedömning</h1>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-12 text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Bra jobbat!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
          Du har nu gått igenom de 5 domänerna i SBU:s mall för kvalitativ granskning. Nu är det dags för din slutgiltiga sammanvägda bedömning av studiens metodologiska kvalitet.
        </p>

        <div className="space-y-4 max-w-md mx-auto text-left">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => setAssessment(opt)}
              className={`w-full p-5 rounded-xl font-medium border-2 transition-all ${
                assessment === opt
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevSection && (
          <button 
            onClick={() => { if(assessment) saveAppraisal(); navigate(prevSection.path); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Föregående
          </button>
        )}

        <button 
          onClick={goNext}
          disabled={!assessment || saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Sparar...' : 'Se gruppresultat'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
