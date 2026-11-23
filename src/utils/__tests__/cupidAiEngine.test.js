import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  validateUserProfile,
  findSharedInterests,
  analyzeBioAffinity,
  calculateCompatibility,
  generateAiMatchInsight,
  getTopAiMatches
} from '../cupidAiEngine';
import { CANDIDATE_PROFILES } from '../../data/candidates';

describe('cupidAiEngine - Motor de compatibilidad y analisis IA', () => {
  describe('normalizeText', () => {
    it('convierte a minusculas, elimina acentos y espacios laterales', () => {
      expect(normalizeText('  Fotografía Analógica  ')).toBe('fotografia analogica');
      expect(normalizeText('')).toBe('');
    });
  });

  describe('validateUserProfile', () => {
    it('valida correctamente un perfil completo', () => {
      const result = validateUserProfile({
        name: 'Alejandro',
        age: 23,
        goal: 'serious',
        tastes: ['Rock Indie', 'Programacion y Tech'],
        bio: 'Me gusta programar de noche, el cafe y los videojuegos cooperativos.'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detecta errores cuando faltan campos o son invalidos', () => {
      const result = validateUserProfile({
        name: 'A',
        age: 16,
        tastes: ['Rock Indie'],
        bio: 'Corto'
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
    });
  });

  describe('findSharedInterests', () => {
    it('encuentra gustos compartidos ignorando mayusculas y acentos', () => {
      const userTastes = ['rock indie', 'Fotografía Analógica', 'Senderismo'];
      const candidateTastes = ['Rock Indie', 'Fotografia Analogica', 'Arte y Museos'];

      const shared = findSharedInterests(userTastes, candidateTastes);
      expect(shared).toEqual(['Rock Indie', 'Fotografia Analogica']);
    });

    it('retorna arreglo vacio si los parametros no son arreglos', () => {
      expect(findSharedInterests(null, undefined)).toEqual([]);
    });
  });

  describe('analyzeBioAffinity', () => {
    it('detecta palabras clave del candidato dentro de la bio del usuario', () => {
      const candidate = {
        keywords: ['programar', 'videojuegos', 'cafe', 'gatos']
      };
      const bio = 'Amo programar con una taza de cafe mientras juego videojuegos';

      const result = analyzeBioAffinity(bio, candidate);
      expect(result.matchedKeywords).toEqual(['programar', 'videojuegos', 'cafe']);
      expect(result.bonusScore).toBe(18);
    });

    it('retorna puntaje 0 si la bio esta vacia', () => {
      expect(analyzeBioAffinity('', { keywords: ['cafe'] })).toEqual({
        matchedKeywords: [],
        bonusScore: 0
      });
    });
  });

  describe('calculateCompatibility', () => {
    it('otorga alta compatibilidad cuando coinciden gustos, meta y palabras clave en bio', () => {
      const userProfile = {
        name: 'Alex',
        age: 24,
        goal: 'serious',
        tastes: [
          'Jazz y Lo-Fi',
          'Videojuegos Cooperativos',
          'Lectura Sci-Fi',
          'Programacion y Tech'
        ],
        bio: 'Me encanta programar proyectos, jugar videojuegos y tomar cafe.'
      };

      const mateo = CANDIDATE_PROFILES.find((c) => c.id === 'cand-2');
      const metrics = calculateCompatibility(userProfile, mateo);

      expect(metrics.score).toBeGreaterThanOrEqual(85);
      expect(metrics.goalAligned).toBe(true);
      expect(metrics.sharedInterests).toContain('Programacion y Tech');
      expect(metrics.matchedKeywords).toContain('programar');
    });

    it('otorga puntaje base bajo cuando no hay gustos ni meta en comun', () => {
      const userProfile = {
        name: 'Alex',
        age: 24,
        goal: 'serious',
        tastes: ['Electronica'],
        bio: 'Sin palabras clave coincidentes.'
      };
      const camila = CANDIDATE_PROFILES.find((c) => c.id === 'cand-3');
      const metrics = calculateCompatibility(userProfile, camila);

      expect(metrics.score).toBeLessThan(40);
      expect(metrics.goalAligned).toBe(false);
    });
  });

  describe('generateAiMatchInsight', () => {
    it('genera razon personalizada con multiples gustos compartidos y rompehielos', () => {
      const candidate = CANDIDATE_PROFILES[0];
      const insight = generateAiMatchInsight(
        { name: 'Alex' },
        candidate,
        {
          sharedInterests: ['Rock Indie', 'Cine Independiente'],
          matchedKeywords: ['cafe'],
          goalAligned: true
        }
      );

      expect(insight.reason).toContain('Rock Indie, Cine Independiente');
      expect(insight.reason).toContain('cafe');
      expect(insight.icebreaker).toContain(candidate.name);
      expect(insight.icebreaker).toContain('Rock Indie');
    });

    it('genera razon para 1 solo gusto compartido y para 0 gustos compartidos', () => {
      const candidate = CANDIDATE_PROFILES[1];
      const singleInsight = generateAiMatchInsight(
        {},
        candidate,
        { sharedInterests: ['Jazz y Lo-Fi'], matchedKeywords: [], goalAligned: false }
      );
      expect(singleInsight.reason).toContain('punto de conexion clave');

      const zeroInsight = generateAiMatchInsight(
        {},
        candidate,
        { sharedInterests: [], matchedKeywords: [], goalAligned: false }
      );
      expect(zeroInsight.reason).toContain('complemento interesante');
    });
  });

  describe('getTopAiMatches', () => {
    it('ordena los candidatos de mayor a menor porcentaje de compatibilidad y excluye IDs indicados', () => {
      const userProfile = {
        name: 'Laura',
        age: 23,
        goal: 'authentic',
        tastes: ['Rock Indie', 'Cine Independiente', 'Fotografia Analogica'],
        bio: 'Disfruto tomar cafe y sacar fotos con mi camara en tardes de cine.'
      };

      const matches = getTopAiMatches(userProfile, CANDIDATE_PROFILES, ['cand-4']);

      expect(matches).toHaveLength(CANDIDATE_PROFILES.length - 1);
      expect(matches.some((m) => m.id === 'cand-4')).toBe(false);
      expect(matches[0].id).toBe('cand-1');
      expect(matches[0].compatibilityScore).toBeGreaterThanOrEqual(
        matches[1].compatibilityScore
      );
    });
  });
});
