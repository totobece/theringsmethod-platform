// Test meditation language detection
const titles = [
  "4 4 4 4 Breath: Coherence And Nervous System Regulation",
  "Awareness Of Space And Breath",
  "Complete Breathing: Calm And Presence", 
  "Journey Of Light And Body Awareness",
  "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso",
  "Respiracion Completa Calma Y Presencia",
  "Viaje De Luz Y Conciencia Corporal"
];

function detectMeditationLanguage(title) {
  if (!title) return 'unknown';
  
  const titleLower = title.toLowerCase();
  
  // Spanish indicators
  const spanishPatterns = [
    /respiraci[oó]n/i,
    /meditaci[oó]n/i,
    /relajaci[oó]n/i,
    /concentraci[oó]n/i,
    /atenci[oó]n/i,
    /consciencia/i,
    /conciencia/i,
    /presente/i,
    /momento/i,
    /calma/i,
    /paz/i,
    /serenidad/i,
    /tranquilidad/i,
    /viaje/i,
    /luz/i,
    /cuerpo/i,
    /corporal/i,
    /coherencia/i,
    /regulacion/i,
    /sistema/i,
    /nervioso/i,
    /presencia/i,
    /completa/i,
    /completo/i,
    /[áéíóúñ]/
  ];
  
  // English indicators
  const englishPatterns = [
    /meditation/i,
    /relaxation/i,
    /breathing/i,
    /breath/i,
    /concentration/i,
    /awareness/i,
    /present/i,
    /moment/i,
    /calm/i,
    /peace/i,
    /serenity/i,
    /tranquility/i,
    /focus/i,
    /guided/i,
    /journey/i,
    /light/i,
    /body/i,
    /coherence/i,
    /regulation/i,
    /system/i,
    /nervous/i,
    /presence/i,
    /complete/i,
    /space/i,
    /and/i
  ];
  
  const spanishMatches = spanishPatterns.filter(pattern => pattern.test(titleLower)).length;
  const englishMatches = englishPatterns.filter(pattern => pattern.test(titleLower)).length;
  
  if (spanishMatches > 0 && englishMatches === 0) return 'es';
  if (englishMatches > 0 && spanishMatches === 0) return 'en';
  if (spanishMatches > englishMatches) return 'es';
  if (englishMatches > spanishMatches) return 'en';
  
  return 'unknown';
}

console.log("=== Language Detection Test ===");
titles.forEach(title => {
  const detected = detectMeditationLanguage(title);
  console.log(`"${title}" -> ${detected}`);
});
