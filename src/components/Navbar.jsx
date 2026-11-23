import { Heart, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, connectionsCount = 0 }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon-wrap" aria-hidden="true">
            <Heart size={22} strokeWidth={2.4} />
          </div>
          <div>
            <span className="brand-title">CUPID AI</span>
            <span className="brand-subtitle">Match inteligente por afinidad de gustos</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Navegacion principal">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onSelectTab('profile')}
          >
            <SlidersHorizontal size={17} />
            <span>Mi Perfil y Gustos</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => onSelectTab('matches')}
          >
            <Sparkles size={17} />
            <span>Match con IA</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => onSelectTab('connections')}
          >
            <Heart size={17} />
            <span>Mis Conexiones</span>
            <span className="nav-badge" data-testid="connections-badge">
              {connectionsCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
