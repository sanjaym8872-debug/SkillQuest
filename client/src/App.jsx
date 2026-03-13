import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CharacterSelect from './pages/CharacterSelect';
import BossBattle from './pages/BossBattle';
import Roadmap from './pages/Roadmap';
import Leaderboard from './pages/Leaderboard';
import GameRun from './pages/GameRun';
import BirdGame from './pages/BirdGame';
import DailySpikeGame from './pages/DailySpikeGame';
import TerminalVelocity from './pages/TerminalVelocity';
import BalloonSurvival from './pages/BalloonSurvival';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';

// Simplified layout component for protected routes
const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-indigo-500 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Initializing Neural Link...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="pt-24 px-4 pb-8 max-w-7xl mx-auto w-full flex-grow relative">
        {children}
      </main>
    </div>
  );
};

// Route wrapper for conditional dashboard/character select
const HomeRoute = () => {
  const { user } = useAuth();
  if (user?.characterClass === 'Unassigned') {
    return <Navigate to="/character-select" replace />;
  }
  return <Dashboard />;
};

function App() {
  React.useEffect(() => {
    console.log('App Mounted');
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes Wrapper */}
            <Route path="/" element={<ProtectedLayout><HomeRoute /></ProtectedLayout>} />
            <Route path="/character-select" element={<ProtectedLayout><CharacterSelect /></ProtectedLayout>} />
            <Route path="/boss-battle" element={<ProtectedLayout><BossBattle /></ProtectedLayout>} />
            <Route path="/roadmap" element={<ProtectedLayout><Roadmap /></ProtectedLayout>} />
            <Route path="/leaderboard" element={<ProtectedLayout><Leaderboard /></ProtectedLayout>} />
            <Route path="/game-run/:skill" element={<ProtectedLayout><GameRun /></ProtectedLayout>} />
            <Route path="/bird-game/:skill" element={<ProtectedLayout><BirdGame /></ProtectedLayout>} />
            <Route path="/terminal-velocity" element={<ProtectedLayout><TerminalVelocity /></ProtectedLayout>} />
            <Route path="/balloon-survival/:skill" element={<ProtectedLayout><BalloonSurvival /></ProtectedLayout>} />
            <Route path="/daily-spike/:stepId/:xp/:taskText" element={<ProtectedLayout><DailySpikeGame /></ProtectedLayout>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
