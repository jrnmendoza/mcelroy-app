import { useState } from 'react';
import { mcelroy2023 } from '../../content/mcelroy2023';
import { useAppStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { Scale, CheckCircle2 } from 'lucide-react';

export function Stage5Final() {
  const { session, participantId } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = async () => {
    if (!selectedOption) return;
    
    await supabase.from('responses').upsert({
      session_id: session!.id,
      user_id: participantId!,
      question_id: 'final_appraisal',
      answer: selectedOption
    }, { onConflict: 'session_id,user_id,question_id' });
    
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale className="text-blue-400" /> 
          Fas 5: Slutlig bedömning
        </h3>
        <p className="text-slate-400 text-sm mt-1">Sammanvägd bedömning av metodologiska brister</p>
      </div>
      
      <div className="p-6">
        <p className="text-slate-700 mb-6">
          Gör en total bedömning av risken för att metodproblem påverkar resultaten utifrån de fem områden vi just granskat.
        </p>

        <div className="space-y-3 mb-6">
          {mcelroy2023.finalAppraisalOptions.map((opt) => {
            const isSelected = selectedOption === opt.value;
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
              Bedömning sparad
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
