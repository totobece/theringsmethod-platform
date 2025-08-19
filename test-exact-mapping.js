// Test específico para verificar mapeos correctos de meditaciones
const exactTitles = [
  "Awareness Of Space And Breath",
  "Complete Breathing: Calm And Presence", 
  "Journey Of Light And Body Awareness",
  "4 4 4 4 Breath: Coherence And Nervous System Regulation",
  "Respiracion Completa Calma Y Presencia",
  "Viaje De Luz Y Conciencia Corporal",
  "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso"
];

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

// Mapeos esperados según tu información
const expectedMappings = {
  en: {
    "Awareness Of Space And Breath": "#1 Mindfulness: Present Breathing",
    "Complete Breathing: Calm And Presence": "#2 Mindfulness Meditation: Present Body",
    "Journey Of Light And Body Awareness": "#3 Mindfulness Meditation: Conscious Breathing", 
    "4 4 4 4 Breath: Coherence And Nervous System Regulation": "#4 Meditation: Breathing 4-4-4-4"
  },
  es: {
    "Respiracion Completa Calma Y Presencia": "#1 Meditación Atención Plena: Respiración Presente",
    "Viaje De Luz Y Conciencia Corporal": "#2 Meditación Atención Plena: Cuerpo Presente",
    "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso": "#4 Meditación: Respiración 4-4-4-4"
  }
};

console.log("=== Testing Exact Mappings ===\n");

exactTitles.forEach(title => {
  const normalized = normalizeTitle(title);
  console.log(`Title: "${title}"`);
  console.log(`Normalized: "${normalized}"`);
  
  // Determinar idioma
  const isSpanish = title.includes('Respiracion') || title.includes('Viaje');
  const locale = isSpanish ? 'es' : 'en';
  
  const expected = expectedMappings[locale][title];
  if (expected) {
    console.log(`Expected: "${expected}"`);
  } else {
    console.log(`Expected: No mapping defined yet`);
  }
  
  console.log("");
});

console.log("=== Key Mapping Structure ===");
console.log("English keys should be:");
console.log("- 'awareness of space and breath'");
console.log("- 'complete breathing calm and presence'");
console.log("- 'journey of light and body awareness'"); 
console.log("- '4 4 4 4 breath coherence and nervous system regulation'");
console.log("");
console.log("Spanish keys should be:");
console.log("- 'respiracion completa calma y presencia'");
console.log("- 'viaje de luz y conciencia corporal'");
console.log("- 'respiracion 4 4 4 4 coherencia y regulacion del sistema nervioso'");
