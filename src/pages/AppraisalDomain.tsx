import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, Users, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { SBU_DOMAINS } from '../content/mcelroy2023';
import { calculateProgress, getNextSection, getPrevSection } from '../lib/courseStructure';

export default function AppraisalDomain() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const { userId, saveProgress } = useAppStore();
  
  const domainData = SBU_DOMAINS.find(d => d.id === domain);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [aggregates, setAggregates] = useState<Record<string, Record<string, number>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (domainData && userId) {
      saveProgress(domain!, calculateProgress(domain!));
      window.scrollTo(0, 0);
      loadUserResponses();
      loadAggregates();
    }
  }, [domain, userId]);

  const loadUserResponses = async () => {
    if (!domainData || !userId) return;
    const qIds = domainData.questions.map(q => q.id);
    const { data } = await supabase
      .from('responses')
      .select('question_id, answer, comment')
      .eq('user_id', userId)
      .in('question_id', qIds);
      
    if (data) {
      const newAns: Record<string, string> = {};
      const newCom: Record<string, string> = {};
      data.forEach(r => {
        newAns[r.question_id] = r.answer;
        if (r.comment) newCom[r.question_id] = r.comment;
      });
      setAnswers(newAns);
      setComments(newCom);
    }
  };

  const loadAggregates = async () => {
    if (!domainData) return;
    const qIds = domainData.questions.map(q => q.id);
    const { data } = await supabase
      .from('responses')
      .select('question_id, answer')
      .in('question_id', qIds);
      
    if (data) {
      const agg: Record<string, Record<string, number>> = {};
      data.forEach(r => {
        if (!agg[r.question_id]) agg[r.question_id] = {};
        agg[r.question_id][r.answer] = (agg[r.question_id][r.answer] || 0) + 1;
      });
      setAggregates(agg);
    }
  };

  const handleSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleComment = (qId: string, val: string) => {
    setComments(prev => ({ ...prev, [qId]: val }));
  };

  const saveResponses = async () => {
    if (!userId) return;
    setSaving(true);
    const upserts = Object.keys(answers).map(qId => ({
      user_id: userId,
      question_id: qId,
      answer: answers[qId],
      comment: comments[qId] || null,
      updated_at: new Date().toISOString()
    }));

    if (upserts.length > 0) {
      await supabase.from('responses').upsert(upserts, { onConflict: 'user_id,question_id' });
    }
    setSaving(false);
  };

  const goNext = async () => {
    await saveResponses();
    const next = getNextSection(domain!);
    if (next) navigate(next.path);
  };

  if (!domainData) return <div>Domain not found</div>;

  const allAnswered = domainData.questions.every(q => answers[q.id]);
  const prevSection = getPrevSection(domain!);

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-semibold">
        <ShieldCheck size={16} />
        SBU-granskning
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">{domainData.title}</h1>
      
      <div className="space-y-12 mb-12">
        {domainData.questions.map((q) => {
          const qAgg = aggregates[q.id] || {};
          const totalAnswers = Object.values(qAgg).reduce((a, b) => a + b, 0);
          
          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6">{q.text}</h2>
              
              {q.article_evidence && (
                <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Info size={18} className="text-blue-500" />
                      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Vad säger McElroy?</h3>
                    </div>
                    <p className="text-slate-700 mb-3">{q.article_evidence.reported}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-4">Var hittar du det? {q.article_evidence.reference}</p>
                    
                    {q.article_evidence.extraContext && (
                      <details className="group">
                        <summary className="text-sm font-semibold text-blue-600 cursor-pointer list-none flex items-center gap-1 hover:text-blue-700">
                          Visa mer kontext
                        </summary>
                        <div className="mt-3 p-4 bg-white border border-slate-100 rounded-lg text-sm text-slate-600">
                          {q.article_evidence.extraContext}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <h4 className="font-semibold text-slate-700 mb-4 text-sm">Din bedömning</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`py-3 px-4 rounded-xl font-medium border-2 transition-all ${
                      answers[q.id] === opt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-2 text-sm">Motivering (Frivilligt)</h4>
                <textarea
                  placeholder="Motivera gärna din bedömning utifrån artikeln. Skriv endast om artikeln. Ange inga namn, patientuppgifter eller information om kollegor."
                  value={comments[q.id] || ''}
                  onChange={(e) => handleComment(q.id, e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  rows={2}
                />
              </div>

              {answers[q.id] && totalAnswers >= 3 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-slate-400" />
                    <h4 className="text-sm font-semibold text-slate-600">Gruppens bedömningar hittills ({totalAnswers} svar)</h4>
                  </div>
                  <div className="space-y-3">
                    {q.options.map(opt => {
                      const count = qAgg[opt] || 0;
                      const pct = Math.round((count / totalAnswers) * 100);
                      return (
                        <div key={opt} className="flex items-center gap-3 text-sm">
                          <div className="w-16 font-medium text-slate-600">{opt}</div>
                          <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                            <div className="bg-indigo-300 h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-12 text-right font-semibold text-slate-500">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-slate-500 italic">Gruppen bedömer denna del olika? Fundera över vad i artikeln som kan förklara skillnaderna.</p>
                </div>
              )}
              {answers[q.id] && totalAnswers < 3 && (
                <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500 italic">
                  Gruppresultat visas när fler deltagare har svarat.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevSection && (
          <button 
            onClick={() => { saveResponses(); navigate(prevSection.path); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Föregående
          </button>
        )}

        <button 
          onClick={goNext}
          disabled={!allAnswered || saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Sparar...' : 'Nästa steg'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
