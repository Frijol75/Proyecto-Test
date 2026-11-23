import { CANDIDATE_PROFILES, RELATIONSHIP_GOALS } from '../data/candidates';

/**
 * Normaliza un texto eliminando acentos y convirtiendo a minusculas.
 */
export function normalizeText(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Valida que el perfil del usuario tenga la informacion necesaria para que CUPID AI genere matches.
 */
export function validateUserProfile(profile = {}) {
  const errors = [];
  const trimmedName = String(profile.name || '').trim();
  const numericAge = Number(profile.age);
  const tastes = Array.isArray(profile.tastes) ? profile.tastes : [];
  const trimmedBio = String(profile.bio || '').trim();

  if (trimmedName.length < 2) {
    errors.push('Ingresa tu nombre (minimo 2 caracteres).');
  }

  if (!Number.isFinite(numericAge) || numericAge < 18 || numericAge > 99) {
    errors.push('La edad debe estar entre 18 y 99 anos.');
  }

  if (tastes.length < 2) {
    errors.push('Selecciona al menos 2 gustos para que la IA analice tu afinidad.');
  }

  if (trimmedBio.length < 10) {
    errors.push('Describe un poco mas sobre ti y lo que te gusta (minimo 10 caracteres).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Obtiene la lista de gustos en comun entre el usuario y un candidato.
 */
export function findSharedInterests(userTastes = [], candidateTastes = []) {
  if (!Array.isArray(userTastes) || !Array.isArray(candidateTastes)) {
    return [];
  }

  const normalizedCandidateMap = new Map(
    candidateTastes.map((taste) => [normalizeText(taste), taste])
  );

  const shared = [];
  userTastes.forEach((taste) => {
    const key = normalizeText(taste);
    if (normalizedCandidateMap.has(key)) {
      shared.push(normalizedCandidateMap.get(key));
    }
  });

  return shared;
}

/**
 * Analiza el texto libre (bio) del usuario frente a las palabras clave e intereses del candidato.
 */
export function analyzeBioAffinity(userBio = '', candidate = {}) {
  const normalizedBio = normalizeText(userBio);
  if (!normalizedBio) {
    return { matchedKeywords: [], bonusScore: 0 };
  }

  const candidateKeywords = Array.isArray(candidate.keywords) ? candidate.keywords : [];
  const matchedKeywords = candidateKeywords.filter((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedKeyword && normalizedBio.includes(normalizedKeyword);
  });

  const bonusScore = Math.min(matchedKeywords.length * 6, 18);

  return {
    matchedKeywords,
    bonusScore
  };
}

/**
 * Calcula el porcentaje de compatibilidad y metricas detalladas entre el usuario y un candidato.
 */
export function calculateCompatibility(userProfile = {}, candidate = {}) {
  const userTastes = Array.isArray(userProfile.tastes) ? userProfile.tastes : [];
  const candidateTastes = Array.isArray(candidate.tastes) ? candidate.tastes : [];

  const sharedInterests = findSharedInterests(userTastes, candidateTastes);
  const referenceDenominator = Math.max(
    Math.min(userTastes.length || 1, candidateTastes.length || 1),
    3
  );

  const tasteRatio = Math.min(sharedInterests.length / referenceDenominator, 1);
  const tasteScore = Math.round(tasteRatio * 62);

  const goalAligned = Boolean(
    userProfile.goal && candidate.goal && userProfile.goal === candidate.goal
  );
  const goalScore = goalAligned ? 20 : 10;

  const { matchedKeywords, bonusScore } = analyzeBioAffinity(userProfile.bio, candidate);

  const rawScore = tasteScore + goalScore + bonusScore;
  const score = Math.max(18, Math.min(99, rawScore));

  return {
    score,
    sharedInterests,
    matchedKeywords,
    goalAligned
  };
}

/**
 * Genera la explicacion de compatibilidad y el mensaje rompehielos personalizado de CUPID AI.
 */
export function generateAiMatchInsight(userProfile = {}, candidate = {}, metrics = {}) {
  const shared = metrics.sharedInterests || [];
  const matchedKeywords = metrics.matchedKeywords || [];
  const userName = String(userProfile.name || '').trim();
  const goalObj = RELATIONSHIP_GOALS.find((g) => g.id === candidate.goal);
  const goalText = goalObj ? goalObj.label.toLowerCase() : 'una conexion genuina';

  let reason = '';
  if (shared.length >= 2) {
    const topShared = shared.slice(0, 3).join(', ');
    reason = `CUPID AI detecto una alta resonancia entre ${userName || 'tu perfil'} y ${candidate.name || 'este candidato'} porque ambos disfrutan de ${topShared}.`;
  } else if (shared.length === 1) {
    reason = `CUPID AI encontro un punto de conexion clave en su gusto compartido por ${shared[0]}.`;
  } else {
    reason = `CUPID AI sugiere este perfil como un complemento interesante para ampliar tus horizontes con alguien afin a tu estilo.`;
  }

  if (metrics.goalAligned) {
    reason += ` Ademas, coinciden en buscar ${goalText}.`;
  }

  if (matchedKeywords.length > 0) {
    reason += ` Tu descripcion personal conecta directamente con su afinidad por ${matchedKeywords.slice(0, 2).join(' y ')}.`;
  }

  const primaryTopic = shared[0] || (candidate.tastes && candidate.tastes[0]) || 'sus proyectos';
  const icebreaker = `Hola ${candidate.name}, CUPID AI nos hizo match por nuestra afinidad en ${primaryTopic}. ¿Cual ha sido tu experiencia o plan favorito relacionado con eso ultimamente?`;

  return {
    reason,
    icebreaker
  };
}

/**
 * Obtiene y ordena los mejores matches generados por CUPID AI para el usuario.
 */
export function getTopAiMatches(
  userProfile,
  candidates = CANDIDATE_PROFILES,
  excludedIds = []
) {
  const excludedSet = new Set(excludedIds);

  return candidates
    .filter((candidate) => !excludedSet.has(candidate.id))
    .map((candidate) => {
      const metrics = calculateCompatibility(userProfile, candidate);
      const insight = generateAiMatchInsight(userProfile, candidate, metrics);

      return {
        ...candidate,
        compatibilityScore: metrics.score,
        sharedInterests: metrics.sharedInterests,
        matchedKeywords: metrics.matchedKeywords,
        goalAligned: metrics.goalAligned,
        aiReason: insight.reason,
        aiIcebreaker: insight.icebreaker
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
