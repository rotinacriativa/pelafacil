
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CreateGroup = React.lazy(() => import('./pages/CreateGroup'));
const ScheduleMatch = React.lazy(() => import('./pages/ScheduleMatch'));
const RosterManagement = React.lazy(() => import('./pages/RosterManagement'));

const TeamGenerator = React.lazy(() => import('./pages/TeamGenerator'));
const Scoreboard = React.lazy(() => import('./pages/Scoreboard'));
const StatsPage = React.lazy(() => import('./pages/StatsPage'));
const FinancialPage = React.lazy(() => import('./pages/FinancialPage'));
const MatchDetail = React.lazy(() => import('./pages/MatchDetail'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ExploreMatches = React.lazy(() => import('./pages/ExploreMatches'));

const ManageRequests = React.lazy(() => import('./pages/ManageRequests'));
const UserRequests = React.lazy(() => import('./pages/UserRequests'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<ExploreMatches />} />

          <Route path="/my-requests" element={<UserRequests />} />
          <Route path="/requests" element={<ManageRequests />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/schedule-match" element={<ScheduleMatch />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/roster" element={<RosterManagement />} />

          <Route path="/generator" element={<TeamGenerator />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/financial" element={<FinancialPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
};

export default App;
