import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { calculateProgress, getNextSection, getPrevSection } from '../lib/courseStructure';

export default function InteractiveActivity() {
  const { activity } = useParams<{ activity: string }>();
  const navigate = useNavigate();
  const { saveProgress } = useAppStore();
  
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    saveProgress(activity === 'theme-match' ? 'theme-match' : 'interactive', calculateProgress('theme-match'));
    window.scrollTo(0, 0);
  }, [activity, saveProgress]);

  const themes = [
    { id: '1', name: 'Committed to learning' },
    { id: '2', name: 'It is a safe space' },
    { id: '3', name: 'Natural leader' }
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    setAnswered(true);
  };

  const nextSection = getNextSection('theme-match');
  const prevSection = getPrevSection('theme-match');

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold">
        <Lightbulb size={16} />
        Metod-detektiv
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Testa din förståelse</h1>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <p className="text-lg text-slate-700 mb-6 font-medium">
          "Jag tycker att det är en svår fråga. Eftersom kirurgerna ibland byts ut, ibland går den ansvariga sjuksköterskan ut och kommer tillbaka i slutet. Så egentligen borde det finnas någon som naturligt träder fram och leder debriefingen."
        </p>
        
        <p className="text-sm text-slate-500 mb-6 font-semibold uppercase tracking-wider">
          Vilket tema hör detta citat främst till?
        </p>

        <div className="space-y-3">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => !answered && handleSelect(t.id)}
              disabled={answered}
              className={`w-full text-left px-5 py-4 rounded-xl font-medium border-2 transition-all ${
                answered
                  ? t.id === '3' 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : selected === t.id 
                      ? 'border-red-300 bg-red-50 text-red-800 opacity-50' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{t.name}</span>
                {answered && t.id === '3' && <CheckCircle2 className="text-green-500" size={20} />}
              </div>
            </button>
          ))}
        </div>

        {answered && (
          <div className="mt-8 p-5 bg-slate-100 rounded-xl text-slate-700 animate-fade-in text-sm border border-slate-200">
            <p className="font-bold mb-2">Rätt svar: Natural leader</p>
            <p className="mb-2">
              Deltagarna var oense om vem som faktiskt borde leda debriefingen, även om många refererade till traditionella hierarkier som kirurgen eller anestesiläkaren. Detta belyser hur idén om "naturliga ledare" ofta förstärker befintliga hierarkiska maktstrukturer i operationssalen.
            </p>
            <p className="text-xs text-slate-500 font-medium">Källa: McElroy et al., Table 2, s. 570</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevSection && (
          <button 
            onClick={() => navigate(prevSection.path)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Föregående
          </button>
        )}

        {nextSection && (
          <button 
            onClick={() => navigate(nextSection.path)}
            disabled={!answered}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fortsätt till granskningen
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
