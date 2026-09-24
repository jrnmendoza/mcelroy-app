import { CheckCircle2 } from 'lucide-react';

export function Stage2Detective() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-fade-in">
      <CheckCircle2 size={48} className="text-blue-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-800 mb-2">Fas 2: Metoddetektiven</h3>
      <p className="text-slate-600">Följ med på storskärmen när vi granskar studiens metodval. Deltagande sker i helgrupp.</p>
    </div>
  );
}
