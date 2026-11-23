import { useState } from 'react';
import {
  Sparkles,
  Heart,
  MapPin,
  Briefcase,
  Check,
  CheckCircle2,
  MessageCircle,
  X,
  Award,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export default function AiMatchView({
  matches = [],
  connectedIds = [],
  onConnectMatch,
  onDismissMatch,
  onResetDismissed,
  onEditProfile
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    matches[0]?.id || null
  );

  const activeMatch =
    matches.find((m) => m.id === selectedCandidateId) || matches[0] || null;

  if (!activeMatch) {
    return (
      <section className="empty-state" aria-label="Sin sugerencias disponibles">
        <div className="empty-icon-circle">
          <Sparkles size={26} />
        </div>
        <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
          Has revisado todas las recomendaciones actuales de CUPID AI
        </h2>
        <p className="section-description" style={{ margin: '0.5rem auto 1.5rem' }}>
          Puedes restablecer las sugerencias o ajustar tus gustos para recalcular nuevos
          matches.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button type="button" className="btn-primary" onClick={onResetDismissed}>
            <RefreshCw size={17} />
            <span>Restablecer sugerencias IA</span>
          </button>
          <button type="button" className="btn-secondary" onClick={onEditProfile}>
            <SlidersHorizontal size={17} />
            <span>Ajustar mis gustos</span>
          </button>
        </div>
      </section>
    );
  }

  const isConnected = connectedIds.includes(activeMatch.id);
  const initials = activeMatch.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <section aria-labelledby="ai-match-heading">
      <div className="section-header">
        <span className="section-badge">
          <Sparkles size={14} />
          <span>Motor Semantico CUPID AI</span>
        </span>
        <h1 id="ai-match-heading" className="section-title">
          Tus Matches seleccionados por Inteligencia Artificial
        </h1>
        <p className="section-description">
          CUPID AI analizo tus gustos y tu descripcion para encontrar a las personas con
          mayor compatibilidad contigo.
        </p>
      </div>

      <div className="match-layout">
        <article className="featured-match-card" data-testid="featured-match-card">
          <div className="match-top-row">
            <div className="candidate-identity">
              <div className="candidate-avatar" aria-hidden="true">
                {initials}
              </div>
              <div>
                <h2 className="candidate-name">
                  {activeMatch.name}, {activeMatch.age}
                </h2>
                <div className="candidate-meta">
                  <span className="meta-item">
                    <MapPin size={14} />
                    <span>{activeMatch.city}</span>
                  </span>
                  <span className="meta-item">
                    <Briefcase size={14} />
                    <span>{activeMatch.occupation}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="compatibility-badge" data-testid="compatibility-score">
              <Sparkles size={16} />
              <span>{activeMatch.compatibilityScore}% Compatibilidad IA</span>
            </div>
          </div>

          <div className="compatibility-bar-wrap" aria-hidden="true">
            <div
              className="compatibility-bar-fill"
              style={{ width: `${activeMatch.compatibilityScore}%` }}
            />
          </div>

          <p className="candidate-bio">{activeMatch.bio}</p>

          <div className="ai-insight-box">
            <div className="ai-insight-header">
              <Sparkles size={15} />
              <span>Por que CUPID AI les hizo Match</span>
            </div>
            <p className="ai-insight-text" data-testid="ai-match-reason">
              {activeMatch.aiReason}
            </p>
          </div>

          <div className="shared-tastes-section">
            <div className="subsection-label">
              <Check size={15} />
              <span>
                Gustos en comun ({activeMatch.sharedInterests.length} coincidencias)
              </span>
            </div>
            <div className="taste-pills">
              {activeMatch.tastes.map((taste) => {
                const isShared = activeMatch.sharedInterests.includes(taste);
                return (
                  <span
                    key={taste}
                    className={`taste-pill ${isShared ? 'selected' : ''}`}
                    style={{ cursor: 'default' }}
                  >
                    {isShared && <Check size={13} />}
                    <span>{taste}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="icebreaker-box">
            <MessageCircle size={20} color="#e11d48" style={{ flexShrink: 0 }} />
            <div className="icebreaker-content">
              <span className="icebreaker-label">Rompehielos sugerido por CUPID AI</span>
              <span data-testid="ai-icebreaker">{activeMatch.aiIcebreaker}</span>
            </div>
          </div>

          <div className="match-actions">
            {isConnected ? (
              <button type="button" className="btn-primary" disabled>
                <CheckCircle2 size={18} />
                <span>Match Conectado</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => onConnectMatch(activeMatch)}
              >
                <Heart size={18} />
                <span>Aceptar Match de IA</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onDismissMatch(activeMatch.id)}
            >
              <X size={17} />
              <span>Siguiente sugerencia</span>
            </button>
          </div>
        </article>

        <aside className="panel-card" aria-label="Ranking de afinidad">
          <div className="subsection-label" style={{ marginBottom: '0.9rem' }}>
            <Award size={16} />
            <span>Ranking de Compatibilidad IA</span>
          </div>

          <div className="ranking-list">
            {matches.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                className={`ranking-item ${
                  candidate.id === activeMatch.id ? 'active' : ''
                }`}
                onClick={() => setSelectedCandidateId(candidate.id)}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--cupid-ink-900)' }}>
                    {candidate.name}, {candidate.age}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cupid-ink-500)' }}>
                    {candidate.sharedInterests.length} gustos en comun
                  </div>
                </div>
                <span className="ranking-score">{candidate.compatibilityScore}%</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={onEditProfile}
            >
              <SlidersHorizontal size={16} />
              <span>Modificar mis gustos</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
