// Limpa medidas e quantidades de um ingrediente, deixando só o nome.
// Ex: "2 colheres de chá de Canela" -> "Canela"
//     "500g de Ricota" -> "Ricota"
//     "1/2 xícara de passas de uva" -> "passas de uva"
export function cleanIngredient(ing: string): string {
  let t = (ing || '').trim();

  // Remove números, frações e faixas do início: "2", "1/2", "1-2", "500"
  t = t.replace(/^[\d½¼¾⅓⅔][\d½¼¾⅓⅔\s\/,\.x-]*/i, '');

  // Remove unidades coladas ao número que sobraram: "g de", "kg de", "ml de"
  t = t.replace(/^(g|kg|mg|ml|l|oz|lb)\s+(de\s+)?/i, '');

  // Palavras de medida (PT/EN/ES/FR) e conectores no início — remove em loop
  const medida = /^(colheres?|colherinhas?|xícaras?|copos?|pitadas?|fatias?|dentes?|folhas?|ramos?|fios?|punhados?|tabletes?|latas?|pacotes?|sachês?|unidades?|pedaços?|gramas?|quilos?|litros?|tablespoons?|teaspoons?|tbsp|tsp|cups?|cloves?|slices?|pinch(es)?|cucharadas?|cucharaditas?|tazas?|dientes?|cuill[èe]res?|tasses?)\s+/i;
  const contexto = /^(chá|sopa|café|soup|tea)\s+de\s+/i;
  const conector = /^(de|do|da|dos|das|d'|of|un|una|um|uma|uns|umas)\s+/i;

  let anterior;
  do {
    anterior = t;
    t = t.replace(medida, '');
    t = t.replace(contexto, '');
    t = t.replace(conector, '');
  } while (t !== anterior);

  // Remove sobras tipo "aproximadamente 200g cada" entre parênteses
  t = t.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  // Remove vírgula e o que vem depois: "cebola, picada" -> "cebola"
  t = t.split(',')[0].trim();

  return t;
}
