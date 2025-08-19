// Script para generar todas las variantes posibles de nombres para meditaciones 5 y 6
const possibleNames5 = [
  "Recorrido Corporal",
  "Meditacion Recorrido Corporal", 
  "Meditacion Atencion Plena Recorrido Corporal",
  "Atencion Plena Recorrido Corporal",
  "Body Scan",
  "Meditation 5",
  "Meditacion 5",
  "5 Recorrido Corporal",
  "#5 Recorrido Corporal"
];

const possibleNames6 = [
  "Activacion Energetica",
  "Meditacion Activacion Energetica",
  "Meditacion de Activacion Energetica", 
  "Energy Activation",
  "Energetic Meditation",
  "Meditation 6",
  "Meditacion 6",
  "6 Activacion Energetica",
  "#6 Activacion Energetica"
];

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

console.log("=== Posibles nombres para Meditación 5 (Recorrido Corporal) ===");
possibleNames5.forEach(name => {
  console.log(`"${name}" -> normalized: "${normalizeTitle(name)}"`);
});

console.log("\n=== Posibles nombres para Meditación 6 (Activación Energética) ===");
possibleNames6.forEach(name => {
  console.log(`"${name}" -> normalized: "${normalizeTitle(name)}"`);
});

console.log("\n=== Keys en el mapeo que deberían coincidir ===");
console.log("Para Meditación 5:");
console.log("- 'recorrido corporal'");
console.log("- 'meditacion 5'");
console.log("- 'meditacion atencion plena recorrido corporal'");

console.log("\nPara Meditación 6:");
console.log("- 'activacion energetica'");
console.log("- 'meditacion 6'");
console.log("- 'meditacion de activacion energetica'");
