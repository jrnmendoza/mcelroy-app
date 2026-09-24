import { useState } from 'react';
import { mcelroy2023 } from '../../content/mcelroy2023';
import { useAppStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export function Stage1Snapshot() {
  const { session, participantId } = useAppStore();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [, setSubmitted] = useState(false);

  // If host reveals results and we have submitted, we just wait.
  // Actually, Stage 1 is a tutorial/snapshot stage, participants can step through themselves.

  // Question 1 logic
  const question = {
    id: "q1_1",
    question: "Vad var studiens huvudsakliga syfte?",
    options: [
      "Att utvärdera en ny operationsmetod för barn.",
      "Att utforska personalens erfarenheter av debriefing och dess koppling till psykologisk trygghet.",
      "Att mäta exakt hur många minuter en debriefing tar."
    ],
    correctAnswerIndex: 1,
    explanation: "Studiens syfte var att förstå hur en effektiv debriefing-policy kan upprättas och reflektera över psykologisk trygghet, hierarki och lagarbete.",
    reference: "Introduction, s. 568"
  };

  const handleAnswer = async () => {
    if (selectedOption === null) return;
    setShowAnswer(true);
    
    // Save response
    await supabase.from('responses').upsert({
      session_id: session!.id,
      user_id: participantId!,
      question_id: question.id,
      answer: question.options[selectedOption]
    }, { onConflict: 'session_id,user_id,question_id' });
    
    setSubmitted(true);
  };

  if (step === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-blue-400" /> 
            Fas 1: Studiefakta
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Syfte</h4>
            <p className="text-slate-700">{mcelroy2023.snapshot.aim}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Miljö</h4>
            <p className="text-slate-700">{mcelroy2023.snapshot.setting}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deltagare</h4>
            <p className="text-slate-700">{mcelroy2023.snapshot.participants}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Design</h4>
            <p className="text-slate-700">{mcelroy2023.snapshot.design}</p>
          </div>

          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            onClick={() => setStep(1)}
          >
            Jag har förstått, vidare till testet <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-blue-400" /> 
          Snabbtest
        </h3>
      </div>
      <div className="p-6">
        <p className="text-lg font-semibold text-slate-800 mb-6">{question.question}</p>
        
        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswerIndex;
            
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ";
            
            if (showAnswer) {
              if (isCorrect) {
                btnClass += "bg-green-50 border-green-500 text-green-900";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-50 border-red-300 text-red-900 opacity-70";
              } else {
                btnClass += "bg-slate-50 border-slate-200 opacity-50";
              }
            } else {
              if (isSelected) {
                btnClass += "bg-blue-50 border-blue-500 text-blue-900";
              } else {
                btnClass += "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
              }
            }

            return (
              <button 
                key={idx} 
                className={btnClass}
                onClick={() => setSelectedOption(idx)}
                disabled={showAnswer}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {!showAnswer ? (
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleAnswer}
            disabled={selectedOption === null}
          >
            Svara
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 p-5 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-green-900 font-medium mb-1">Rätt svar!</p>
                <p className="text-green-800 text-sm mb-3">{question.explanation}</p>
                <p className="text-xs text-green-600/70 font-medium uppercase tracking-wider">Källa: {question.reference}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-green-200 text-center text-sm text-green-800 font-medium">
              Väntar på spelledaren för att gå till nästa fas...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
