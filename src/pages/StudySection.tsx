import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Quote } from 'lucide-react';
import { STUDY_CONTENT } from '../content/mcelroy2023';
import { useAppStore } from '../lib/store';
import { calculateProgress, getNextSection, getPrevSection } from '../lib/courseStructure';

export default function StudySection() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { saveProgress } = useAppStore();

  const sectionData = STUDY_CONTENT[section as keyof typeof STUDY_CONTENT];
  
  useEffect(() => {
    if (sectionData) {
      const sectionId = section; // 'background', 'methods', 'results'
      const progress = calculateProgress(sectionId!);
      saveProgress(sectionId!, progress);
      window.scrollTo(0, 0);
    }
  }, [section, sectionData, saveProgress]);

  if (!sectionData) {
    return <div className="p-8 text-center text-red-500">Avsnittet hittades inte.</div>;
  }

  const nextSection = getNextSection(section!);
  const prevSection = getPrevSection(section!);

  // Split content by newlines to render paragraphs
  const paragraphs = sectionData.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6 inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-semibold">
        <BookOpen size={16} />
        Läs och förstå
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">{sectionData.title}</h1>
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <div className="prose prose-slate max-w-none">
          {paragraphs.map((p, i) => {
            // Very basic markdown formatting for bold text (**)
            const formatted = p.split(/(\*\*.*?\*\*)/g).map((chunk, j) => {
              if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return <strong key={j} className="text-slate-900">{chunk.slice(2, -2)}</strong>;
              }
              return chunk;
            });
            return <p key={i} className="text-slate-700 leading-relaxed mb-4">{formatted}</p>;
          })}
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 flex items-start gap-3 mb-12">
        <Quote className="text-slate-400 shrink-0 mt-1" size={20} />
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Källa</p>
          <p className="text-sm text-slate-600">{sectionData.reference}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevSection ? (
          <button 
            onClick={() => navigate(prevSection.path)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Föregående
          </button>
        ) : <div />}

        {nextSection && (
          <button 
            onClick={() => navigate(nextSection.path)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Nästa steg
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
