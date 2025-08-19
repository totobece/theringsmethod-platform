// Mapeo hardcodeado de nombres y descripciones de meditaciones
// Este mapeo permite personalizar el contenido sin modificar Supabase

interface MeditationContent {
  newTitle: string;
  description: string;
  originalTitle?: string; // Para referencia
}

// Mapeo en español
export const spanishMeditationContent: Record<string, MeditationContent> = {
  // Meditación 3 - Respiracion Completa Calma Y Presencia
  'respiracion completa calma y presencia': {
    newTitle: '#3 Meditación Atención Plena: Respiración Consciente',
    description: 'Una práctica de respiración consciente que guía al practicante a respirar de forma completa, llenando los pulmones en tres etapas: zona baja (abdomen), media (costillas), y alta (pecho/clavículas). La visualización acompaña el recorrido del aire en cada inhalación y exhalación.',
    originalTitle: 'Respiracion Completa Calma Y Presencia'
  },
  
  // Spanish mappings
  'meditacion atencion plena respiracion presente1': {
    newTitle: '#1 Meditación Atención Plena: Respiración Presente',
    description: 'Una meditación de atención plena que invita a comenzar con una exploración consciente del entorno y del cuerpo. A través de la observación del espacio físico y una respiración abdominal lenta y profunda, esta práctica ayuda a conectar con el momento presente, cultivar calma interior y traer claridad para el resto del día.'
  },
  'viaje de luz y conciencia corporal': {
    newTitle: '#2 Meditación Atención Plena: Cuerpo Presente',
    description: 'Una meditación que combina visualización con conciencia corporal. Se invita al practicante a imaginar una luz dorada que recorre todo el cuerpo desde la cabeza hasta los pies, llevando relajación y presencia a cada parte. La práctica incluye respiración consciente y conexión profunda con las sensaciones físicas.'
  },
  
  // Meditación 4 - Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso
  'respiracion 4 4 4 4: coherencia y regulacion del sistema nervioso': {
    newTitle: '#4 Meditación: Respiración 4-4-4-4',
    description: 'Esta es una práctica de respiración cuadrada (box breathing o respiración 4-4-4-4), una técnica simple y profunda que se usa tanto en tradiciones ancestrales (como prácticas chamánicas) como en contextos modernos (como entrenamiento de fuerzas especiales o atletas de alto rendimiento). Regular el sistema nervioso (simpático y parasimpático). Restaurar la coherencia cardíaca y respiratorio. Calmar la mente y centrar la atención. Aumentar la autoconciencia corporal y emocional. Reconectar con el poder de la respiración como recurso interno',
    originalTitle: 'Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso'
  },
  
  // Meditación 5 - Nombres exactos de Supabase
  'meditacion atencion plena5': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Meditacion Atencion Plena5'
  },

  'meditacion atencion plena 5': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Meditacion Atencion Plena 5'
  },

  // Meditación 6 - Nombres exactos de Supabase
  'meditacion alineacion energetica6': {
    newTitle: '#6 Meditación de Activación Energética',
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Meditacion Alineacion Energetica6'
  },

  'meditacion alineacion energetica 6': {
    newTitle: '#6 Meditación de Activación Energética',
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Meditacion Alineacion Energetica 6'
  },

  // Meditación 5 - otros nombres posibles
  'meditacion 5': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Meditacion 5'
  },
  
  // Meditación 6 - otros nombres posibles
  'meditacion 6': {
    newTitle: '#6 Meditación de Activación Energética',
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Meditacion 6'
  },
  
  // Variantes adicionales para diferentes nombres posibles - Meditación 5
  'meditacion atencion plena recorrido corporal': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Meditación Atención plena: Recorrido corporal'
  },
  
  'meditacion recorrido corporal': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Meditacion Recorrido Corporal'
  },

  'atencion plena recorrido corporal': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Atencion Plena Recorrido Corporal'
  },
  
  'meditacion de activacion energetica': {
    newTitle: '#6 Meditación de Activación Energética', 
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Meditación de Activación Energética'
  },

  'meditacion activacion energetica': {
    newTitle: '#6 Meditación de Activación Energética',
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Meditacion Activacion Energetica'
  },

  // Variantes con nombres más específicos
  'recorrido corporal': {
    newTitle: '#5 Meditación Atención plena: Recorrido corporal',
    description: 'Una meditación de atención plena centrada en la respiración y la visualización de una luz cálida y curativa que recorre el cuerpo desde la cabeza hasta los pies. Esta práctica promueve la relajación profunda, la liberación de tensiones y el cuidado amoroso del cuerpo y la mente.',
    originalTitle: 'Recorrido Corporal'
  },

  'activacion energetica': {
    newTitle: '#6 Meditación de Activación Energética',
    description: 'Una meditación energética guiada que activa y alinea los centros energéticos del cuerpo (chakras) a través de la respiración, visualización de luz y conexión con el cuerpo. Ideal para comenzar el día o preparar la mente y el cuerpo para un reto, una meta o una práctica creativa.',
    originalTitle: 'Activacion Energetica'
  }
};

// Mapeo en inglés
export const englishMeditationContent: Record<string, MeditationContent> = {
  // Meditation 1 - Awareness Of Space And Breath
  'awareness of space and breath': {
    newTitle: '#1 Mindfulness: Present Breathing',
    description: 'A mindfulness meditation that begins with a conscious exploration of the space around you and your body. Through slow abdominal breathing and awareness of the present moment, this practice helps cultivate calm, clarity, and grounded presence to carry into your day.',
    originalTitle: 'Awareness Of Space And Breath'
  },
  
  // Meditation 2 - Complete Breathing: Calm And Presence
  'complete breathing: calm and presence': {
    newTitle: '#2 Mindfulness Meditation: Present Body',
    description: 'A guided meditation that invites you to scan the body with mindful awareness, observing the breath and visualizing a warm light moving through the entire body from the feet to the crown of the head. It is a deep practice of body awareness, grounding, and energetic connection.',
    originalTitle: 'Complete Breathing: Calm And Presence'
  },
  
  // Meditation 3 - Journey Of Light And Body Awareness
  'journey of light and body awareness': {
    newTitle: '#3 Mindfulness Meditation: Conscious Breathing',
    description: 'A conscious breathing practice that guides the practitioner to breathe fully, filling the lungs in three stages: lower area (abdomen), middle area (ribs), and upper area (chest/clavicles). Visualization supports the journey of the breath with each inhalation and exhalation.',
    originalTitle: 'Journey Of Light And Body Awareness'
  },
  
  // Meditation 4 - 4 4 4 4 Breath: Coherence And Nervous System Regulation
  '4 4 4 4 breath: coherence and nervous system regulation': {
    newTitle: '#4 Meditation: Breathing 4-4-4-4',
    description: 'This is a box breathing practice (also known as 4-4-4-4 breathing), a simple yet profound technique used in both ancestral traditions (such as shamanic practices) and modern contexts (such as special forces training or high-performance athletic preparation). Regulate the nervous system (sympathetic and parasympathetic). Restore cardiac and respiratory coherence. Calm the mind and center attention. Increase bodily and emotional self-awareness. Reconnect with the power of breath as an internal resource',
    originalTitle: '4 4 4 4 Breath: Coherence And Nervous System Regulation'
  },
  
  // Meditation 5 - Body Journey
  'meditation 5': {
    newTitle: '#5 Mindfulness: Body Journey',
    description: 'A mindfulness meditation focused on breathing and visualizing a warm, healing light that travels through the body from head to feet. This practice promotes deep relaxation, tension release, and loving care for both body and mind.',
    originalTitle: 'Meditation 5'
  },
  
  // Meditation 6 - Energy Activation
  'meditation 6': {
    newTitle: '#6 Meditation: Energy Activation',
    description: 'A guided energetic meditation that activates and aligns the body\'s energy centers (chakras) through breathing, light visualization, and body connection. Ideal for starting the day or preparing the mind and body for a challenge, goal, or creative practice.',
    originalTitle: 'Meditation 6'
  },

  // Additional variants for different possible names
  'mindful body scan': {
    newTitle: '#5 Mindfulness: Body Journey',
    description: 'A mindfulness meditation focused on breathing and visualizing a warm, healing light that travels through the body from head to feet. This practice promotes deep relaxation, tension release, and loving care for both body and mind.',
    originalTitle: 'Mindful Body Scan'
  },

  'body scan meditation': {
    newTitle: '#5 Mindfulness: Body Journey', 
    description: 'A mindfulness meditation focused on breathing and visualizing a warm, healing light that travels through the body from head to feet. This practice promotes deep relaxation, tension release, and loving care for both body and mind.',
    originalTitle: 'Body Scan Meditation'
  },

  'body scan': {
    newTitle: '#5 Mindfulness: Body Journey',
    description: 'A mindfulness meditation focused on breathing and visualizing a warm, healing light that travels through the body from head to feet. This practice promotes deep relaxation, tension release, and loving care for both body and mind.',
    originalTitle: 'Body Scan'
  },

  'energy activation': {
    newTitle: '#6 Meditation: Energy Activation',
    description: 'A guided energetic meditation that activates and aligns the body\'s energy centers (chakras) through breathing, light visualization, and body connection. Ideal for starting the day or preparing the mind and body for a challenge, goal, or creative practice.',
    originalTitle: 'Energy Activation'
  },

  'energetic meditation': {
    newTitle: '#6 Meditation: Energy Activation',
    description: 'A guided energetic meditation that activates and aligns the body\'s energy centers (chakras) through breathing, light visualization, and body connection. Ideal for starting the day or preparing the mind and body for a challenge, goal, or creative practice.',
    originalTitle: 'Energetic Meditation'
  },

  'energy meditation': {
    newTitle: '#6 Meditation: Energy Activation',
    description: 'A guided energetic meditation that activates and aligns the body\'s energy centers (chakras) through breathing, light visualization, and body connection. Ideal for starting the day or preparing the mind and body for a challenge, goal, or creative practice.',
    originalTitle: 'Energy Meditation'
  }
};

// Función para normalizar títulos para comparación
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remover puntuación
    .replace(/\s+/g, ' '); // Normalizar espacios
}

// Función para obtener el contenido de una meditación por título
export function getMeditationContent(originalTitle: string, locale: 'en' | 'es' = 'es'): MeditationContent | null {
  const normalizedTitle = normalizeTitle(originalTitle);
  const contentMap = locale === 'es' ? spanishMeditationContent : englishMeditationContent;
  
  // Buscar coincidencia exacta primero
  if (contentMap[normalizedTitle]) {
    return contentMap[normalizedTitle];
  }
  
  // Mapeos específicos para evitar confusiones
  if (locale === 'es') {
    // Mapeos específicos en español
    if (originalTitle === 'Respiracion Completa Calma Y Presencia') {
      return contentMap['respiracion completa calma y presencia'];
    }
    if (originalTitle === 'Viaje De Luz Y Conciencia Corporal') {
      return contentMap['viaje de luz y conciencia corporal'];
    }
    if (originalTitle === 'Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso') {
      return contentMap['respiracion 4 4 4 4: coherencia y regulacion del sistema nervioso'];
    }
    // Nuevos mapeos exactos para meditaciones 5 y 6
    if (originalTitle === 'Meditacion Atencion Plena5') {
      return contentMap['meditacion atencion plena5'];
    }
    if (originalTitle === 'Meditacion Alineacion Energetica6') {
      return contentMap['meditacion alineacion energetica6'];
    }
  } else {
    // Mapeos específicos en inglés
    if (originalTitle === 'Awareness Of Space And Breath') {
      return contentMap['awareness of space and breath'];
    }
    if (originalTitle === 'Complete Breathing: Calm And Presence') {
      return contentMap['complete breathing: calm and presence'];
    }
    if (originalTitle === 'Journey Of Light And Body Awareness') {
      return contentMap['journey of light and body awareness'];
    }
    if (originalTitle === '4 4 4 4 Breath: Coherence And Nervous System Regulation') {
      return contentMap['4 4 4 4 breath: coherence and nervous system regulation'];
    }
  }
  
  // Búsqueda más específica para casos especiales usando palabras clave
  if (normalizedTitle.includes('respiracion') && normalizedTitle.includes('completa')) {
    return contentMap['respiracion completa calma y presencia'];
  }
  
  if (normalizedTitle.includes('viaje') && normalizedTitle.includes('luz')) {
    return contentMap['viaje de luz y conciencia corporal'];
  }
  
  if (normalizedTitle.includes('journey') && normalizedTitle.includes('light')) {
    return contentMap['journey of light and body awareness'];
  }
  
  if (normalizedTitle.includes('4 4 4 4') || (normalizedTitle.includes('coherence') && normalizedTitle.includes('nervous'))) {
    return locale === 'es' 
      ? contentMap['respiracion 4 4 4 4: coherencia y regulacion del sistema nervioso']
      : contentMap['4 4 4 4 breath: coherence and nervous system regulation'];
  }
  
  if (normalizedTitle.includes('awareness') && normalizedTitle.includes('space')) {
    return contentMap['awareness of space and breath'];
  }
  
  if (normalizedTitle.includes('complete') && normalizedTitle.includes('breathing')) {
    return contentMap['complete breathing: calm and presence'];
  }

  // Nuevas búsquedas para meditaciones 5 y 6
  if (normalizedTitle.includes('atencion') && normalizedTitle.includes('plena5')) {
    return contentMap['meditacion atencion plena5'];
  }

  if (normalizedTitle.includes('alineacion') && normalizedTitle.includes('energetica6')) {
    return contentMap['meditacion alineacion energetica6'];
  }

  if (normalizedTitle.includes('atencion') && normalizedTitle.includes('plena') && normalizedTitle.includes('5')) {
    return contentMap['meditacion atencion plena 5'] || contentMap['meditacion atencion plena5'];
  }

  if (normalizedTitle.includes('alineacion') && normalizedTitle.includes('energetica') && normalizedTitle.includes('6')) {
    return contentMap['meditacion alineacion energetica 6'] || contentMap['meditacion alineacion energetica6'];
  }

  if (normalizedTitle.includes('recorrido') && normalizedTitle.includes('corporal')) {
    return contentMap['recorrido corporal'];
  }

  if (normalizedTitle.includes('activacion') && normalizedTitle.includes('energetica')) {
    return contentMap['activacion energetica'];
  }

  if (normalizedTitle.includes('body') && (normalizedTitle.includes('scan') || normalizedTitle.includes('journey'))) {
    return contentMap['body scan meditation'] || contentMap['mindful body scan'];
  }

  if (normalizedTitle.includes('energy') && normalizedTitle.includes('activation')) {
    return contentMap['energy activation'];
  }

  // Búsqueda por números de meditación
  if (normalizedTitle.includes('meditacion 5') || normalizedTitle.includes('meditation 5')) {
    return contentMap['meditation 5'] || contentMap['meditacion 5'];
  }

  if (normalizedTitle.includes('meditacion 6') || normalizedTitle.includes('meditation 6')) {
    return contentMap['meditation 6'] || contentMap['meditacion 6'];
  }
  
  return null;
}

// Función para obtener todos los contenidos de meditaciones por idioma
export function getAllMeditationContent(locale: 'en' | 'es' = 'es'): Record<string, MeditationContent> {
  return locale === 'es' ? spanishMeditationContent : englishMeditationContent;
}
