import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProfileForm from './components/ProfileForm';
import AiMatchView from './components/AiMatchView';
import ConnectionsView from './components/ConnectionsView';
import { getTopAiMatches } from './utils/cupidAiEngine';

const DEFAULT_USER_PROFILE = {
  name: 'Alex Rivera',
  age: 23,
  goal: 'authentic',
  tastes: [
    'Rock Indie',
    'Cine Independiente',
    'Cafeterias Tranquilas',
    'Videojuegos Cooperativos'
  ],
  bio: 'Me gusta descubrir cafeterias tranquilas, escuchar rock indie, hablar de cine y programar o jugar videojuegos cooperativos.'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [connections, setConnections] = useState([]);

  const aiMatches = useMemo(() => {
    return getTopAiMatches(userProfile, undefined, dismissedIds);
  }, [userProfile, dismissedIds]);

  const handleSaveAndMatch = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setDismissedIds([]);
    setActiveTab('matches');
  };

  const handleConnectMatch = (candidate) => {
    setConnections((prev) => {
      if (prev.some((item) => item.id === candidate.id)) {
        return prev;
      }
      return [...prev, candidate];
    });
  };

  const handleDismissMatch = (candidateId) => {
    setDismissedIds((prev) => [...prev, candidateId]);
  };

  const handleResetDismissed = () => {
    setDismissedIds([]);
  };

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        connectionsCount={connections.length}
      />

      <main className="main-container">
        {activeTab === 'profile' && (
          <ProfileForm
            userProfile={userProfile}
            onSaveAndMatch={handleSaveAndMatch}
          />
        )}

        {activeTab === 'matches' && (
          <AiMatchView
            matches={aiMatches}
            connectedIds={connections.map((c) => c.id)}
            onConnectMatch={handleConnectMatch}
            onDismissMatch={handleDismissMatch}
            onResetDismissed={handleResetDismissed}
            onEditProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsView
            connections={connections}
            onGoToMatches={() => setActiveTab('matches')}
          />
        )}
      </main>
    </div>
  );
}
