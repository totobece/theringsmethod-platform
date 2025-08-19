// Test de mapeo directo
const testTitles = [
  "4 4 4 4 Breath: Coherence And Nervous System Regulation",
  "Awareness Of Space And Breath", 
  "Complete Breathing: Calm And Presence",
  "Journey Of Light And Body Awareness",
  "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso",
  "Respiracion Completa Calma Y Presencia",
  "Viaje De Luz Y Conciencia Corporal"
];

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remover puntuación
    .replace(/\s+/g, ' '); // Normalizar espacios
}

// Test basic normalization
console.log("=== Testing Title Normalization ===");
testTitles.forEach(title => {
  const normalized = normalizeTitle(title);
  console.log(`"${title}" -> "${normalized}"`);
});

console.log("\n=== Expected Mappings ===");
console.log("respiracion completa calma y presencia -> #1 Meditación");
console.log("viaje de luz y conciencia corporal -> #2 Meditación");
console.log("journey of light and body awareness -> #3 Meditación");
console.log("respiracion 4 4 4 4 coherencia y regulacion del sistema nervioso -> #4 Meditación");
console.log("awareness of space and breath -> #1 Mindfulness");
console.log("complete breathing calm and presence -> #2 Mindfulness");
console.log("4 4 4 4 breath coherence and nervous system regulation -> #4 Meditation");
