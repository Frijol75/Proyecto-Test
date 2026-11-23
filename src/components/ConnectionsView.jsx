import { useState } from 'react';
import {
  Heart,
  Sparkles,
  MessageCircle,
  Send,
  CheckCircle2,
  MapPin
} from 'lucide-react';

export default function ConnectionsView({ connections = [], onGoToMatches }) {
  const [sentMessages, setSentMessages] = useState({});

  const handleSendIcebreaker = (candidate) => {
    setSentMessages((prev) => ({
      ...prev,
      [candidate.id]: candidate.aiIcebreaker
    }));
  };

  if (connections.length === 0) {
    return (
      <section className="empty-state" aria-label="Sin conexiones guardadas">
        <div className="empty-icon-circle">
          <Heart size={26} />
        </div>
        <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
          Aun no tienes conexiones confirmadas
        </h2>
        <p className="section-description" style={{ margin: '0.5rem auto 1.5rem' }}>
          Revisa los matches que CUPID AI selecciono para ti segun tus gustos y acepta los
          que mas te interesen.
        </p>
        <button type="button" className="btn-primary" onClick={onGoToMatches}>
          <Sparkles size={17} />
          <span>Ir a mis Matches con IA</span>
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="connections-heading">
      <div className="section-header">
        <span className="section-badge">
          <Heart size={14} />
          <span>Conexiones Confirmadas</span>
        </span>
        <h1 id="connections-heading" className="section-title">
          Tus Matches aceptados en CUPID AI
        </h1>
        <p className="section-description">
          Inicia la conversacion usando el rompehielos personalizado que genero la IA para
          ustedes.
        </p>
      </div>

      <div className="connections-grid">
        {connections.map((person) => {
          const sentText = sentMessages[person.id];
          return (
            <article key={person.id} className="connection-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {person.name}, {person.age}
                  </h2>
                  <span
                    className="meta-item"
                    style={{ fontSize: '0.82rem', color: 'var(--cupid-ink-500)' }}
                  >
                    <MapPin size={13} />
                    <span>{person.city}</span>
                  </span>
                </div>
                <span className="compatibility-badge" style={{ fontSize: '0.8rem' }}>
                  <Sparkles size={14} />
                  <span>{person.compatibilityScore}% IA</span>
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--cupid-ink-700)' }}>
                {person.aiReason}
              </p>

              {sentText ? (
                <div
                  className="ai-insight-box"
                  style={{ marginBottom: 0 }}
                  data-testid={`sent-message-${person.id}`}
                >
                  <div className="ai-insight-header">
                    <CheckCircle2 size={15} />
                    <span>Mensaje enviado</span>
                  </div>
                  <p className="ai-insight-text">{sentText}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleSendIcebreaker(person)}
                >
                  <MessageCircle size={16} />
                  <span>Enviar rompehielos de IA</span>
                  <Send size={15} />
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
