import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ParticipantView from './pages/ParticipantView';
import PresenterView from './pages/PresenterView';
import ResultsView from './pages/ResultsView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join/:code" element={<ParticipantView />} />
        <Route path="/present/:code" element={<PresenterView />} />
        <Route path="/results/:code" element={<ResultsView />} />
      </Routes>
    </Router>
  );
}

export default App;
