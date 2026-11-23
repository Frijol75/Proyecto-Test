export const TASTE_CATEGORIES = [
  {
    id: 'music',
    label: 'Musica y Conciertos',
    iconName: 'Music',
    options: [
      'Rock Indie',
      'Synthpop',
      'Jazz y Lo-Fi',
      'R&B Alternativo',
      'Electronica',
      'Acustico y Folk'
    ]
  },
  {
    id: 'hobbies',
    label: 'Pasatiempos y Cultura',
    iconName: 'Compass',
    options: [
      'Videojuegos Cooperativos',
      'Cine Independiente',
      'Lectura Sci-Fi',
      'Fotografia Analogica',
      'Programacion y Tech',
      'Arte y Museos'
    ]
  },
  {
    id: 'lifestyle',
    label: 'Planes y Estilo de Vida',
    iconName: 'Coffee',
    options: [
      'Cafeterias Tranquilas',
      'Senderismo y Naturaleza',
      'Viajes de Fin de Semana',
      'Gastronomia Local',
      'Mascotas y Animales',
      'Noches de Juegos de Mesa'
    ]
  }
];

export const RELATIONSHIP_GOALS = [
  { id: 'serious', label: 'Relacion estable a largo plazo' },
  { id: 'authentic', label: 'Conexion autentica y ver que fluye' },
  { id: 'companion', label: 'Compania para planes, cultura y viajes' }
];

export const CANDIDATE_PROFILES = [
  {
    id: 'cand-1',
    name: 'Valeria Montes',
    age: 23,
    city: 'Ciudad de Mexico',
    occupation: 'Disenadora UX / Fotografa',
    goal: 'authentic',
    bio: 'Me apasiona recorrer cafeterias tranquilas con mi camara analogica, escuchar rock indie y descubrir cine independiente los fines de semana.',
    tastes: [
      'Rock Indie',
      'Cine Independiente',
      'Fotografia Analogica',
      'Cafeterias Tranquilas',
      'Arte y Museos',
      'Mascotas y Animales'
    ],
    keywords: ['camara', 'cafe', 'indie', 'cine', 'arte', 'gatos', 'fotografia', 'tranquila']
  },
  {
    id: 'cand-2',
    name: 'Mateo Salazar',
    age: 25,
    city: 'Guadalajara',
    occupation: 'Ingeniero de Software',
    goal: 'serious',
    bio: 'Desarrollador nocturno, fan de los videojuegos cooperativos, la ciencia ficcion y el jazz lo-fi mientras programo o tomo un buen cafe.',
    tastes: [
      'Jazz y Lo-Fi',
      'Videojuegos Cooperativos',
      'Lectura Sci-Fi',
      'Programacion y Tech',
      'Cafeterias Tranquilas',
      'Noches de Juegos de Mesa'
    ],
    keywords: ['programar', 'codigo', 'videojuegos', 'juegos', 'sci-fi', 'cafe', 'tecnologia']
  },
  {
    id: 'cand-3',
    name: 'Camila Duarte',
    age: 24,
    city: 'Monterrey',
    occupation: 'Arquitecta Paisajista',
    goal: 'companion',
    bio: 'Siempre lista para una ruta de senderismo al amanecer, escapadas de fin de semana, conciertos acusticos y probar gastronomia local.',
    tastes: [
      'Acustico y Folk',
      'Senderismo y Naturaleza',
      'Viajes de Fin de Semana',
      'Gastronomia Local',
      'Mascotas y Animales',
      'Fotografia Analogica'
    ],
    keywords: ['naturaleza', 'viajar', 'montana', 'senderismo', 'comida', 'perros', 'aire libre']
  },
  {
    id: 'cand-4',
    name: 'Diego Villalobos',
    age: 26,
    city: 'Ciudad de Mexico',
    occupation: 'Productor Musical',
    goal: 'authentic',
    bio: 'Vivo entre sintetizadores, vinilos de synthpop y electronica. Busco alguien con quien compartir conciertos, noches de juegos de mesa y buenas charlas.',
    tastes: [
      'Synthpop',
      'Electronica',
      'Rock Indie',
      'Noches de Juegos de Mesa',
      'Cine Independiente',
      'Gastronomia Local'
    ],
    keywords: ['musica', 'conciertos', 'vinilos', 'synth', 'juegos', 'cine', 'charlas']
  },
  {
    id: 'cand-5',
    name: 'Sofia Navarro',
    age: 22,
    city: 'Puebla',
    occupation: 'Investigadora de Datos & IA',
    goal: 'serious',
    bio: 'Curiosa por la inteligencia artificial, lectora empedernida de ciencia ficcion, amante del R&B alternativo y las tardes de museo y cafe.',
    tastes: [
      'R&B Alternativo',
      'Lectura Sci-Fi',
      'Programacion y Tech',
      'Arte y Museos',
      'Cafeterias Tranquilas',
      'Videojuegos Cooperativos'
    ],
    keywords: ['ia', 'ciencia', 'libros', 'lectura', 'museos', 'cafe', 'tech', 'juegos']
  }
];
