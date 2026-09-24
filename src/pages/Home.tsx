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
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Så fungerar det</h3>
          <ul className="space-y-3 text-slate-700 font-medium">
            <li className="flex items-center gap-3"><span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> Förstå studien</li>
            <li className="flex items-center gap-3"><span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> Utforska resultaten</li>
            <li className="flex items-center gap-3"><span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> Granska metoden med SBU</li>
            <li className="flex items-center gap-3"><span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span> Jämför din bedömning med kollegornas</li>
            <li className="flex items-center gap-3"><span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span> Gör en samlad bedömning</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4 font-semibold text-center">Beräknad tid: ca 15-20 minuter</p>
        </div>

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

        <div className="mt-12 pt-10 border-t border-slate-100 text-left">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Källmaterial</h3>
          <p className="text-sm text-slate-600 mb-6">
            Vill du hellre göra granskningen manuellt kan du ladda ner SBU-mallen och använda originalartikeln vid sidan av.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">Originalstudien</h4>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">McElroy et al. 2023. Psychological Safety and Hierarchy in Operating Room Debriefing.</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => navigate('/article?page=1')}
                  className="text-xs font-semibold bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-center"
                >
                  Öppna studien i appen
                </button>
                <a 
                  href={`${import.meta.env.BASE_URL}mcelroy2023.pdf`}
                  download
                  className="text-xs font-semibold bg-slate-200 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-center"
                >
                  Ladda ner PDF
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">SBU:s granskningsmall</h4>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">Bedömning av studier med kvalitativ metodik.</p>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://www.sbu.se/globalassets/ebm/mallar/kvalitativa_studier.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold bg-indigo-100 text-indigo-700 py-2 px-3 rounded-lg hover:bg-indigo-200 transition-colors text-center"
                >
                  Öppna SBU-mallen
                </a>
                <a 
                  href="https://www.sbu.se/globalassets/ebm/mallar/kvalitativa_studier.pdf"
                  download
                  className="text-xs font-semibold bg-slate-200 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-center"
                >
                  Ladda ner SBU-mallen
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
