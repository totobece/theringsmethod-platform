// Test específico para los nombres exactos de las meditaciones 5 y 6
const exactTitlesFromSupabase = [
  "Meditacion Atencion Plena5",
  "Meditacion Alineacion Energetica6"
];

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

console.log("=== Test de nombres exactos de Supabase ===\n");

exactTitlesFromSupabase.forEach(title => {
  const normalized = normalizeTitle(title);
  console.log(`Original: "${title}"`);
  console.log(`Normalized: "${normalized}"`);
  
  if (title === "Meditacion Atencion Plena5") {
    console.log(`Expected: "#5 Meditación Atención plena: Recorrido corporal"`);
    console.log(`Description: "Una meditación de atención plena centrada en la respiración..."`);
  }
  
  if (title === "Meditacion Alineacion Energetica6") {
    console.log(`Expected: "#6 Meditación de Activación Energética"`);
    console.log(`Description: "Una meditación energética guiada que activa y alinea..."`);
  }
  
  console.log("");
});

console.log("=== Keys que deberían coincidir ===");
console.log("- 'meditacion atencion plena5'");
console.log("- 'meditacion alineacion energetica6'");
console.log("");

console.log("=== Palabras clave de búsqueda ===");
console.log("Para Meditación 5: 'atencion' + 'plena5' o 'atencion' + 'plena' + '5'");
console.log("Para Meditación 6: 'alineacion' + 'energetica6' o 'alineacion' + 'energetica' + '6'");
