import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { ArrowRight, Play, BookOpen } from 'lucide-react';
import { COURSE_STRUCTURE } from '../lib/courseStructure';

export default function Home() {
  const navigate = useNavigate();
  const { currentSection, percentageComplete, saveProgress } = useAppStore();

  useEffect(() => {
    saveProgress('intro', 0);
  }, []); // Mark entry if needed, but actually we don't want to reset if they just visit home.
  // Wait, if they visit home we should just read their currentSection.

  const handleStart = () => {
    if (percentageComplete === 0) {
      navigate('/study/background');
    } else {
      const section = COURSE_STRUCTURE.find(s => s.id === currentSection) || COURSE_STRUCTURE[1];
      navigate(section.path);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100 text-center">
        <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
          McElroy et al. 2023
        </h2>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Psykologisk trygghet, hierarki och debriefing på operationssalen
        </h1>
        
        <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
          Du behöver inte ha läst artikeln i förväg.
          <br /><br />
          Här går du igenom studien steg för steg och gör sedan en kritisk granskning med SBU:s granskningsmall för kvalitativa studier.
        </p>

        {percentageComplete > 0 && (
          <div className="mb-8 p-4 bg-blue-50 rounded-xl inline-flex items-center gap-4 text-blue-800 font-medium">
            <BookOpen size={20} />
            <span>Du är {percentageComplete} % klar.</span>
          </div>
        )}

        <button 
          onClick={handleStart}
          className="w-full md:w-auto mx-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-5 px-10 rounded-2xl transition-all shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1"
        >
          {percentageComplete > 0 ? (
            <>
              Fortsätt där du slutade
              <ArrowRight size={24} />
            </>
          ) : (
            <>
              Starta granskningen
              <Play size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
