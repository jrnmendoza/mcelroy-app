import { useState } from 'react';
import { mcelroy2023 } from '../../content/mcelroy2023';
import { useAppStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { FileSearch, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function Stage4SBU() {
  const { session, participantId } = useAppStore();
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const domain = mcelroy2023.sbuDomains[currentDomainIdx];

  const handleAnswer = async () => {
    if (!selectedOption) return;
    
    await supabase.from('responses').upsert({
      session_id: session!.id,
      user_id: participantId!,
      question_id: domain.id,
      answer: selectedOption
    }, { onConflict: 'session_id,user_id,question_id' });
    
    setSubmitted(true);
  };

  // If host changes the active question, we should reset our local state
  // This is a simple implementation: in a full app we'd sync `currentDomainIdx` with `session.active_question`
  if (session?.active_question && session.active_question !== domain.id) {
    const newIdx = mcelroy2023.sbuDomains.findIndex(d => d.id === session.active_question);
    if (newIdx !== -1 && newIdx !== currentDomainIdx) {
      setCurrentDomainIdx(newIdx);
      setSubmitted(false);
      setSelectedOption(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileSearch className="text-blue-400" /> 
          SBU Granskning
        </h3>
        <p className="text-slate-400 text-sm mt-1">{domain.title}</p>
      </div>
      
      <div className="p-6">
        {/* Evidence Card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 relative">
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
            Bevis från studien
          </div>
          <p className="text-slate-700 italic mb-3 mt-2">"{domain.evidence}"</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Källa: {domain.reference}</p>
        </div>

        <h4 className="text-lg font-bold text-slate-800 mb-4">{domain.question}</h4>

        <div className="space-y-3 mb-6">
          {mcelroy2023.sbuOptions.map((opt) => {
            const isSelected = selectedOption === opt.value;
            
            // Disable if we've submitted and host hasn't unlocked/moved on
            const isDisabled = submitted && session?.reveal_results;
            
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
            
            if (isSelected) {
              btnClass += "bg-blue-50 border-blue-500 text-blue-900";
            } else {
              btnClass += "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
            }

            return (
              <button 
                key={opt.value} 
                className={btnClass}
                onClick={() => setSelectedOption(opt.value)}
                disabled={isDisabled}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50"
            onClick={handleAnswer}
            disabled={!selectedOption}
          >
            Spara min bedömning
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <CheckCircle2 size={20} className="text-green-600" />
              Svar sparat
            </div>
            {session?.reveal_results ? (
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Resultat visas på skärmen</span>
            ) : (
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider animate-pulse">Väntar på gruppen...</span>
            )}
          </div>
        )}

        {session?.reveal_results && session.discussion_mode && (
          <div className="mt-6 bg-amber-50 border border-amber-200 p-5 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-amber-900 font-bold mb-1">Dags för diskussion!</p>
                <p className="text-amber-800 text-sm">Titta på storskärmen. Finns det spridda åsikter? Diskutera vad i artikeln som leder till olika tolkningar.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
