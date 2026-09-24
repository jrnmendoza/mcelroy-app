import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { COURSE_STRUCTURE } from '../lib/courseStructure';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { percentageComplete } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Activity size={24} className="text-blue-600" />
            <span className="font-bold text-slate-800 text-lg">McElroy 2023</span>
          </div>
          
          <button 
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => navigate('/study/background')} className="hover:text-blue-600">Studien</button>
            <button onClick={() => navigate('/appraisal/domain-1')} className="hover:text-blue-600">SBU-granskning</button>
            <button onClick={() => navigate('/results')} className="hover:text-blue-600">Resultat</button>
          </nav>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 sm:hidden">
          <div className="p-4 flex flex-col gap-4">
            {COURSE_STRUCTURE.map(item => (
              <button
                key={item.id}
                className={`text-left p-3 rounded-lg font-medium ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>Ett asynkront utbildningsverktyg för kritisk granskning.</p>
        <p className="mt-2 text-slate-500 text-xs">Baserat på McElroy et al. 2023 och SBU:s granskningsmall.</p>
      </footer>
    </div>
  );
}
