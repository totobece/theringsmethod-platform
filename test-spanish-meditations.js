// Script para verificar las 6 meditaciones en español
const { getMeditationContent, normalizeTitle } = require('./utils/meditation-content.ts');

console.log('=== VERIFICANDO MEDITACIONES EN ESPAÑOL ===
');

const spanishMeditations = [
  'Meditacion Atencion Plena Respiracion Presente1',
  'Viaje De Luz Y Conciencia Corporal',
  'Respiracion Completa Calma Y Presencia',
  'Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso',
  'Meditacion Atencion Plena5',
  'Meditacion Alineacion Energetica6'
];

spanishMeditations.forEach((meditation, index) => {
  console.log(`--- Meditación ${index + 1} ---`);
  console.log(`Nombre original: ${meditation}`);
  console.log(`Nombre normalizado: ${normalizeTitle(meditation)}`);
  
  const content = getMeditationContent(meditation, 'es');
  if (content) {
    console.log(`Título mapeado: ${content.newTitle}`);
    console.log(`Descripción: ${content.description.substring(0, 100)}...`);
  } else {
    console.log('❌ NO SE ENCONTRÓ MAPEO');
  }
  console.log('');
});

console.log('=== RESUMEN ===');
console.log(`Total de meditaciones verificadas: ${spanishMeditations.length}`);

// Extraer solo las meditaciones numeradas (#1, #2, etc.)
const numberedMeditations = {};

Object.entries(spanishMeditationContent).forEach(([key, content]) => {
  if (content.newTitle.includes('#')) {
    const number = content.newTitle.match(/#(\d+)/)?.[1];
    if (number && !numberedMeditations[number]) {
      numberedMeditations[number] = {
        key,
        newTitle: content.newTitle,
        originalTitle: content.originalTitle
      };
    }
  }
});

// Mostrar en orden
for (let i = 1; i <= 6; i++) {
  const meditation = numberedMeditations[i.toString()];
  if (meditation) {
    console.log(`✅ Meditación #${i}:`);
    console.log(`   Título: ${meditation.newTitle}`);
    console.log(`   Nombre original: ${meditation.originalTitle}`);
    console.log(`   Clave de búsqueda: "${meditation.key}"`);
  } else {
    console.log(`❌ Meditación #${i}: NO ENCONTRADA`);
  }
  console.log('');
}

console.log('=== RESUMEN ===');
console.log(`Total de meditaciones mapeadas: ${Object.keys(numberedMeditations).length}/6`);
const missing = [];
for (let i = 1; i <= 6; i++) {
  if (!numberedMeditations[i.toString()]) {
    missing.push(`#${i}`);
  }
}
if (missing.length > 0) {
  console.log(`Faltantes: ${missing.join(', ')}`);
} else {
  console.log('✅ Todas las meditaciones están mapeadas');
}
