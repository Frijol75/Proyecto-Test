import { useState } from 'react';
import {
  User,
  Calendar,
  Target,
  Sparkles,
  Music,
  Compass,
  Coffee,
  Check,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { TASTE_CATEGORIES, RELATIONSHIP_GOALS } from '../data/candidates';
import { validateUserProfile } from '../utils/cupidAiEngine';

const CATEGORY_ICONS = {
  Music,
  Compass,
  Coffee
};

export default function ProfileForm({ userProfile, onSaveAndMatch }) {
  const [formData, setFormData] = useState(userProfile);
  const [errors, setErrors] = useState([]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleTaste = (taste) => {
    setFormData((prev) => {
      const exists = prev.tastes.includes(taste);
      const updatedTastes = exists
        ? prev.tastes.filter((t) => t !== taste)
        : [...prev.tastes, taste];
      return {
        ...prev,
        tastes: updatedTastes
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateUserProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSaveAndMatch({
      ...formData,
      age: Number(formData.age)
    });
  };

  return (
    <section aria-labelledby="profile-heading">
      <div className="section-header">
        <span className="section-badge">
          <Sparkles size={14} />
          <span>Configuracion de Afinidad IA</span>
        </span>
        <h1 id="profile-heading" className="section-title">
          Define tus gustos para que CUPID AI encuentre tu match
        </h1>
        <p className="section-description">
          En lugar de deslizar perfiles al azar, cuentanos que te apasiona y nuestra IA
          calculara tu compatibilidad real con cada persona.
        </p>
      </div>

      <form className="panel-card" onSubmit={handleSubmit} noValidate>
        {errors.length > 0 && (
          <div className="alert-error" role="alert">
            <AlertCircle size={18} />
            <div>
              {errors.map((err) => (
                <div key={err}>{err}</div>
              ))}
            </div>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="user-name" className="form-label">
              <User size={16} />
              <span>Tu Nombre</span>
            </label>
            <input
              id="user-name"
              type="text"
              className="form-input"
              placeholder="Ej. Sofia"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-age" className="form-label">
              <Calendar size={16} />
              <span>Edad</span>
            </label>
            <input
              id="user-age"
              type="number"
              min="18"
              max="99"
              className="form-input"
              value={formData.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-goal" className="form-label">
              <Target size={16} />
              <span>Que buscas en CUPID AI</span>
            </label>
            <select
              id="user-goal"
              className="form-select"
              value={formData.goal}
              onChange={(e) => handleFieldChange('goal', e.target.value)}
            >
              {RELATIONSHIP_GOALS.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="taste-categories">
          {TASTE_CATEGORIES.map((category) => {
            const CategoryIcon = CATEGORY_ICONS[category.iconName] || Compass;
            return (
              <div key={category.id} className="taste-category-block">
                <div className="taste-category-title">
                  <CategoryIcon size={17} />
                  <span>{category.label}</span>
                </div>
                <div className="taste-pills">
                  {category.options.map((taste) => {
                    const isSelected = formData.tastes.includes(taste);
                    return (
                      <button
                        key={taste}
                        type="button"
                        aria-pressed={isSelected}
                        className={`taste-pill ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToggleTaste(taste)}
                      >
                        {isSelected && <Check size={14} />}
                        <span>{taste}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="user-bio" className="form-label">
            <Sparkles size={16} />
            <span>Prompt personal para CUPID AI (sobre ti y tu plan ideal)</span>
          </label>
          <textarea
            id="user-bio"
            className="form-textarea"
            placeholder="Describe tus hobbies, musica, planes de fin de semana y que valoras en una persona..."
            value={formData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          <Sparkles size={18} />
          <span>Analizar Perfil y Generar Match con IA</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}
