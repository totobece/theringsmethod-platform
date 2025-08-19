// Test script para verificar el mapeo de meditaciones
import { getMeditationContent } from './utils/meditation-content.js';

const testTitles = [
  "4 4 4 4 Breath: Coherence And Nervous System Regulation",
  "Awareness Of Space And Breath", 
  "Complete Breathing: Calm And Presence",
  "Journey Of Light And Body Awareness",
  "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso",
  "Respiracion Completa Calma Y Presencia",
  "Viaje De Luz Y Conciencia Corporal"
];

console.log("=== Testing Meditation Content Mapping ===\n");

testTitles.forEach(title => {
  console.log(`Original Title: "${title}"`);
  
  // Test Spanish mapping
  const spanishContent = getMeditationContent(title, 'es');
  if (spanishContent) {
    console.log(`  🇪🇸 Spanish: "${spanishContent.newTitle}"`);
    console.log(`  📝 Description: ${spanishContent.description.substring(0, 100)}...`);
  } else {
    console.log(`  🇪🇸 Spanish: No mapping found`);
  }
  
  // Test English mapping  
  const englishContent = getMeditationContent(title, 'en');
  if (englishContent) {
    console.log(`  🇺🇸 English: "${englishContent.newTitle}"`);
    console.log(`  📝 Description: ${englishContent.description.substring(0, 100)}...`);
  } else {
    console.log(`  🇺🇸 English: No mapping found`);
  }
  
  console.log("");
});
