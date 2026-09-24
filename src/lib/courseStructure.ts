export const COURSE_STRUCTURE = [
  { id: 'intro', type: 'home', title: 'Start', path: '/' },
  { id: 'background', type: 'study', title: 'Bakgrund & syfte', path: '/study/background' },
  { id: 'methods', type: 'study', title: 'Metod', path: '/study/methods' },
  { id: 'results', type: 'study', title: 'Resultat', path: '/study/results' },
  { id: 'theme-match', type: 'interactive', title: 'Förstå studien', path: '/interactive/theme-match' },
  { id: 'domain-1', type: 'appraisal', title: 'Teoretisk underbyggnad', path: '/appraisal/domain-1' },
  { id: 'domain-2', type: 'appraisal', title: 'Urval', path: '/appraisal/domain-2' },
  { id: 'domain-3', type: 'appraisal', title: 'Datainsamling', path: '/appraisal/domain-3' },
  { id: 'domain-4', type: 'appraisal', title: 'Analys', path: '/appraisal/domain-4' },
  { id: 'domain-5', type: 'appraisal', title: 'Forskarens roll', path: '/appraisal/domain-5' },
  { id: 'overall', type: 'appraisal', title: 'Samlad bedömning', path: '/appraisal/overall' },
  { id: 'results', type: 'results', title: 'Gruppens granskning', path: '/results' },
];

export function getNextSection(currentId: string) {
  const currentIndex = COURSE_STRUCTURE.findIndex(s => s.id === currentId);
  if (currentIndex >= 0 && currentIndex < COURSE_STRUCTURE.length - 1) {
    return COURSE_STRUCTURE[currentIndex + 1];
  }
  return null;
}

export function getPrevSection(currentId: string) {
  const currentIndex = COURSE_STRUCTURE.findIndex(s => s.id === currentId);
  if (currentIndex > 0) {
    return COURSE_STRUCTURE[currentIndex - 1];
  }
  return null;
}

export function calculateProgress(currentId: string) {
  const currentIndex = COURSE_STRUCTURE.findIndex(s => s.id === currentId);
  if (currentIndex === -1) return 0;
  return Math.round((currentIndex / (COURSE_STRUCTURE.length - 1)) * 100);
}
