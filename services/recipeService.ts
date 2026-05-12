import { Recipe, MOCK_RECIPES, DietType, MealType, ShoppingItem, EventOccasion } from '../constants/data';

export interface RecipeFilters {
  ingredients: string[];
  diet?: DietType | 'todas';
  mealType?: MealType | 'todas';
  isPremium: boolean;
}

export interface InspirationFilters {
  occasion: EventOccasion;
  diet?: DietType | 'todas';
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function calculateMatchScore(recipe: Recipe, ingredients: string[]): number {
  if (ingredients.length === 0) return 1;
  const normalizedIngredients = ingredients.map(normalizeText);
  const recipeIngredients = recipe.ingredients.map(i => normalizeText(i));

  let matches = 0;
  for (const ing of normalizedIngredients) {
    const found = recipeIngredients.some(ri => ri.includes(ing) || ing.includes(ri.split(' ')[0]));
    if (found) matches++;
  }
  return matches / ingredients.length;
}

export async function generateRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const maxIngredients = filters.isPremium ? Infinity : 3;
  const limitedIngredients = filters.ingredients.slice(0, maxIngredients);

  let results = MOCK_RECIPES.filter(recipe => {
    // Premium filter
    if (recipe.isPremium && !filters.isPremium) return false;

    // Diet filter
    if (filters.diet && filters.diet !== 'todas') {
      if (!recipe.diet.includes(filters.diet as DietType)) return false;
    }

    // Meal type filter
    if (filters.mealType && filters.mealType !== 'todas') {
      if (!recipe.type.includes(filters.mealType as MealType)) return false;
    }

    return true;
  });

  // Sort by ingredient match score if ingredients provided
  if (limitedIngredients.length > 0) {
    results = results
      .map(r => ({ recipe: r, score: calculateMatchScore(r, limitedIngredients) }))
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 0 || limitedIngredients.length === 0)
      .map(r => r.recipe);
  }

  // If no matches found by ingredients, return all available
  if (results.length === 0) {
    results = MOCK_RECIPES.filter(r => !r.isPremium || filters.isPremium);
  }

  return results.slice(0, 8);
}

export function getRecipeById(id: string): Recipe | undefined {
  return MOCK_RECIPES.find(r => r.id === id);
}

export function getFeaturedRecipes(isPremium: boolean): Recipe[] {
  return MOCK_RECIPES.filter(r => !r.isPremium || isPremium).slice(0, 4);
}

const INSPIRATION_MENUS: Record<EventOccasion, Recipe[]> = {
  dia_das_maes: [
    {
      id: 'ev_1',
      name: 'Risoto de Caramêmbola com Camarão Gourmet',
      description: 'Risoto cremoso com camarão salteado em manteiga de ervas e finalizado com caramêmbola fresca.',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600',
      time: 50, difficulty: 'dificil', diet: ['tradicional'], type: ['internacional'],
      dishType: 'jantar', servings: 4, isPremium: false, calories: 680, isEvent: true, occasion: 'dia_das_maes',
      ingredients: ['300g de arroz arborio', '400g de camarão limpo', '2 caramêmbolas', '1 cebola', '2 dentes de alho', '150ml de vinho branco seco', '1L de caldo de peixe quente', '50g de parmesana ralado', '3 colheres de manteiga', 'azeite extra virgem', 'sal e pimenta-do-reino', 'salsinha fresca', 'azeite de trúfa (opcional)'],
      steps: [
        'Aqueça o caldo de peixe em uma panela separada e mantenha aquecido em fogo baixo.',
        'Em uma panela larga, refogue a cebola no azeite até ficar translucida.',
        'Adicione o alho e o arroz arborio, toste por 2 minutos mexendo constantemente.',
        'Despeje o vinho branco e mexa até evaporar completamente.',
        'Adicione o caldo quente concha a concha, mexendo sempre por 18-20 minutos.',
        'Em outra frigideira, sele os camarões na manteiga com alho por 3 minutos cada lado.',
        'Desligue o fogo do risoto, adicione a manteiga restante e o parmesana. Mexa vigorosamente.',
        'Finalize com fatias finas de caramêmbola, os camarões e salsinha fresca.',
      ],
      tags: ['gourmet', 'dia das mães', 'especial', 'frutos do mar'],
      shoppingList: [
        { id: 's1', name: 'Arroz arborio', quantity: '300g', category: 'graos' },
        { id: 's2', name: 'Camarão limpo fresco', quantity: '400g', category: 'proteinas' },
        { id: 's3', name: 'Caramêmbola', quantity: '2 unidades', category: 'hortifruti' },
        { id: 's4', name: 'Parmesana ralado', quantity: '50g', category: 'laticinios' },
        { id: 's5', name: 'Vinho branco seco', quantity: '150ml', category: 'outros' },
        { id: 's6', name: 'Caldo de peixe', quantity: '1 litro', category: 'outros' },
        { id: 's7', name: 'Manteiga sem sal', quantity: '3 colheres', category: 'laticinios' },
        { id: 's8', name: 'Azeite extra virgem', quantity: 'a gosto', category: 'temperos' },
        { id: 's9', name: 'Salsinha fresca', quantity: '1 maço', category: 'hortifruti' },
      ],
    },
    {
      id: 'ev_2',
      name: 'Bolo de Lavanda com Chantilly de Baunilha',
      description: 'Bolo provenzal elegante com lavanda culinária e chantilly artesanal de baunilha.',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600',
      time: 70, difficulty: 'dificil', diet: ['vegetariana'], type: ['classica'],
      dishType: 'sobremesa', servings: 8, isPremium: false, calories: 420, isEvent: true, occasion: 'dia_das_maes',
      ingredients: ['3 ovos', '200g de açúcar', '200g de farinha', '100g de manteiga', '200ml de leite', '2 colheres de lavanda culinária', '1 sachê de fermento', '400ml de creme de leite fresco', '1 fava de baunilha', 'flores comestíveis para decorar'],
      steps: [
        'Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma de 22cm.',
        'Infunda o leite com a lavanda em fogo baixo por 10 minutos. Coe e reserve.',
        'Bata a manteiga com o açúcar até ficar cremoso e claro.',
        'Adicione os ovos um a um, batendo bem após cada adição.',
        'Alterne a farinha com o leite de lavanda, começando e terminando com a farinha.',
        'Adicione o fermento, misture delicadamente e despeje na forma.',
        'Asse por 35-40 minutos. Teste com palito antes de tirar.',
        'Bata o creme de leite com as sementes da fava de baunilha até obter chantilly firme.',
        'Cubra o bolo frio com o chantilly e decore com flores comestíveis.',
      ],
      tags: ['gourmet', 'bolo', 'sobremesa', 'dia das mães'],
      shoppingList: [
        { id: 's10', name: 'Lavanda culinária', quantity: '2 colheres', category: 'temperos' },
        { id: 's11', name: 'Fava de baunilha', quantity: '1 unidade', category: 'temperos' },
        { id: 's12', name: 'Creme de leite fresco', quantity: '400ml', category: 'laticinios' },
        { id: 's13', name: 'Flores comestíveis', quantity: '1 pacote', category: 'hortifruti' },
        { id: 's14', name: 'Manteiga sem sal', quantity: '100g', category: 'laticinios' },
        { id: 's15', name: 'Farinha de trigo', quantity: '200g', category: 'graos' },
        { id: 's16', name: 'Ovos', quantity: '3 unidades', category: 'proteinas' },
      ],
    },
  ],
  jantar_romantico: [
    {
      id: 'ev_3',
      name: 'Filé Mignon ao Molho de Trufas',
      description: 'Filé selado na perfeição com molho aveludado de trufas negras e espuma de batata roxa.',
      image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600',
      time: 60, difficulty: 'dificil', diet: ['tradicional'], type: ['internacional'],
      dishType: 'jantar', servings: 2, isPremium: false, calories: 720, isEvent: true, occasion: 'jantar_romantico',
      ingredients: ['2 medalhões de filé mignon (200g cada)', '1 colher de pasta de trufas negras', '200ml de creme de leite fresco', '100ml de vinho tinto', '2 dentes de alho', 'tomilho fresco', 'alecrim fresco', '3 colheres de manteiga', '500g de batata roxa', '100ml de leite integral', 'sal grosso', 'pimenta-do-reino moída na hora'],
      steps: [
        'Retire os filés da geladeira 30 min antes. Tempere com sal grosso e pimenta generosamente.',
        'Cozinhe as batatas roxas com casca até ficarem macias. Descasque e passe pelo espremedor.',
        'Bata as batatas com manteiga, leite quente e sal até obter um purê sedoso. Reserve aquecido.',
        'Aqueça uma frigideira de ferro até ficar muito quente. Adicione azeite.',
        'Sele os filés por 3 min cada lado para ponto ao ponto. Adicione manteiga, alho e ervas e regue constantemente.',
        'Retire a carne e descanse em local aquecido por 5 min.',
        'Na mesma frigideira, adicione o vinho e raspe o fundo. Adicione o creme de leite e a pasta de trufas.',
        'Reduza o molho até encorpar. Ajuste o sal.',
        'Sirva o filé sobre o purê com o molho de trufas por cima.',
      ],
      tags: ['gourmet', 'romantico', 'carne', 'especial'],
      shoppingList: [
        { id: 's20', name: 'Filé mignon (medalhão)', quantity: '400g (2 peças)', category: 'proteinas' },
        { id: 's21', name: 'Pasta de trufas negras', quantity: '1 colher', category: 'temperos' },
        { id: 's22', name: 'Creme de leite fresco', quantity: '200ml', category: 'laticinios' },
        { id: 's23', name: 'Vinho tinto seco', quantity: '100ml', category: 'outros' },
        { id: 's24', name: 'Batata roxa', quantity: '500g', category: 'hortifruti' },
        { id: 's25', name: 'Tomilho fresco', quantity: '1 maço', category: 'hortifruti' },
        { id: 's26', name: 'Alecrim fresco', quantity: '1 maço', category: 'hortifruti' },
        { id: 's27', name: 'Manteiga sem sal', quantity: '3 colheres', category: 'laticinios' },
      ],
    },
  ],
  aniversario: [
    {
      id: 'ev_4',
      name: 'Lagosta Gratinada com Manteiga de Limão Siciliano',
      description: 'Lagosta fresca ao forno com crosta dourada de manteiga e ervas, servida sobre cama de rúcula.',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600',
      time: 45, difficulty: 'dificil', diet: ['tradicional'], type: ['internacional'],
      dishType: 'jantar', servings: 2, isPremium: false, calories: 650, isEvent: true, occasion: 'aniversario',
      ingredients: ['2 lagostas frescas (400g cada)', '150g de manteiga em temperatura ambiente', '2 limões sicilianos', '3 dentes de alho', 'salsinha fresca', 'ciboulette', 'pão ralado panko', 'azeite extra virgem', '100g de rúcula fresca', 'sal e pimenta branca'],
      steps: [
        'Pré-aqueça o forno em modo grill a 220°C.',
        'Corte as lagostas ao meio no sentido do comprimento com uma faca afiada.',
        'Prepare a manteiga composta: bata a manteiga com alho, salsinha, ciboulette e raspas de limão siciliano.',
        'Tempere as lagostas com sal, pimenta e azeite.',
        'Distribua a manteiga composta generosamente sobre cada lagosta.',
        'Polvilhe o panko por cima para criar a crosta.',
        'Leve ao forno por 12-15 minutos até dourar e a carne ficar opaca.',
        'Sirva imediatamente sobre a rúcula temperada com azeite e suco de limão.',
      ],
      tags: ['gourmet', 'aniversário', 'luxo', 'frutos do mar'],
      shoppingList: [
        { id: 's30', name: 'Lagosta fresca', quantity: '2 unidades (400g cada)', category: 'proteinas' },
        { id: 's31', name: 'Limão siciliano', quantity: '2 unidades', category: 'hortifruti' },
        { id: 's32', name: 'Manteiga sem sal', quantity: '150g', category: 'laticinios' },
        { id: 's33', name: 'Pão ralado panko', quantity: '4 colheres', category: 'graos' },
        { id: 's34', name: 'Rúcula fresca', quantity: '100g', category: 'hortifruti' },
        { id: 's35', name: 'Ciboulette fresca', quantity: '1 maço', category: 'hortifruti' },
        { id: 's36', name: 'Azeite extra virgem', quantity: 'a gosto', category: 'temperos' },
      ],
    },
  ],
  natal: [
    {
      id: 'ev_5',
      name: 'Peru Recheado com Farofa de Castanhas e Frutas',
      description: 'Peru assado suculento com recheio gourmet de castanhas portuguesas, damascos e ervas aromáticas.',
      image: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=600',
      time: 240, difficulty: 'dificil', diet: ['tradicional'], type: ['classica', 'regional'],
      dishType: 'jantar', servings: 10, isPremium: false, calories: 580, isEvent: true, occasion: 'natal',
      ingredients: ['1 peru de 5kg', '500g de castanhas portuguesas cozidas', '200g de damascos secos', '200g de bacon defumado', '1 cebola grande', '4 dentes de alho', '2 laranjas', '1 limão', 'tomilho, alecrim e sálvia frescos', '100ml de vinho branco', '3 colheres de manteiga', 'sal grosso e pimenta'],
      steps: [
        'Na véspera, faça cortes no peru e esfregue pasta de alho, sal, pimenta, suco de laranja e limão. Refrigere overnight.',
        'Prepare o recheio: refogue o bacon, adicione cebola, alho, damascos e castanhas grosseiramente picadas.',
        'Recheie o peru, costurando a abertura com barbante de cozinha.',
        'Pré-aqueça o forno a 180°C.',
        'Regue o peru com manteiga derretida e vinho branco. Cubra com papel alumínio.',
        'Asse por 3 horas (30min/kg), regando a cada 30 minutos.',
        'Retire o papel na última hora para dourar a pele.',
        'Deixe descansar 20 minutos antes de cortar.',
      ],
      tags: ['natal', 'tradicional', 'ceia', 'família'],
      shoppingList: [
        { id: 's40', name: 'Peru inteiro (5kg)', quantity: '1 unidade', category: 'proteinas' },
        { id: 's41', name: 'Castanhas portuguesas', quantity: '500g', category: 'graos' },
        { id: 's42', name: 'Damascos secos', quantity: '200g', category: 'hortifruti' },
        { id: 's43', name: 'Bacon defumado', quantity: '200g', category: 'proteinas' },
        { id: 's44', name: 'Laranjas', quantity: '2 unidades', category: 'hortifruti' },
        { id: 's45', name: 'Ervas frescas (mix)', quantity: '1 maço', category: 'hortifruti' },
        { id: 's46', name: 'Vinho branco', quantity: '100ml', category: 'outros' },
        { id: 's47', name: 'Manteiga sem sal', quantity: '3 colheres', category: 'laticinios' },
      ],
    },
  ],
  pascoa: [
    {
      id: 'ev_6',
      name: 'Bacalhau à Brás com Batata Palha Artesanal',
      description: 'Bacalhau desfiado com ovos mexidos sedosos, batata palha crocante e finalização com azeitonas e coentro.',
      image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=600',
      time: 60, difficulty: 'medio', diet: ['tradicional'], type: ['classica', 'internacional'],
      dishType: 'almoco', servings: 6, isPremium: false, calories: 520, isEvent: true, occasion: 'pascoa',
      ingredients: ['800g de bacalhau dessalgado e desfiado', '4 batatas grandes', '8 ovos', '1 cebola grande', '3 dentes de alho', 'azeite extra virgem', 'azeitonas pretas', 'coentro fresco', 'salsa', 'pimenta-do-reino', 'sal a gosto', 'óleo para fritar'],
      steps: [
        'Corte as batatas em palitos finos e frite em óleo quente até ficarem douradas e crocantes. Reserve.',
        'Em azeite generoso, refogue a cebola e o alho até ficarem dourados.',
        'Adicione o bacalhau desfiado e refogue por 5 minutos.',
        'Bata os ovos levemente com sal e pimenta.',
        'Despeje os ovos sobre o bacalhau em fogo baixo, mexendo delicadamente.',
        'Desligue antes dos ovos estarem completamente cozidos (devem ficar cremosos).',
        'Adicione metade da batata palha e misture.',
        'Sirva com o restante da batata palha por cima, azeitonas e coentro fresco.',
      ],
      tags: ['páscoa', 'bacalhau', 'tradicional', 'português'],
      shoppingList: [
        { id: 's50', name: 'Bacalhau (dessalgado)', quantity: '800g', category: 'proteinas' },
        { id: 's51', name: 'Batatas grandes', quantity: '4 unidades', category: 'hortifruti' },
        { id: 's52', name: 'Ovos', quantity: '8 unidades', category: 'proteinas' },
        { id: 's53', name: 'Azeitonas pretas', quantity: '1 pote', category: 'outros' },
        { id: 's54', name: 'Coentro fresco', quantity: '1 maço', category: 'hortifruti' },
        { id: 's55', name: 'Azeite extra virgem', quantity: '100ml', category: 'temperos' },
        { id: 's56', name: 'Cebola grande', quantity: '1 unidade', category: 'hortifruti' },
      ],
    },
  ],
  churrasco: [
    {
      id: 'ev_7',
      name: 'Picanha na Brasa com Chimichurri Gourmet',
      description: 'Picanha grelhada no ponto certo com molho chimichurri argentino artesanal e farofa de mandioca.',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600',
      time: 90, difficulty: 'medio', diet: ['tradicional'], type: ['regional'],
      dishType: 'almoco', servings: 6, isPremium: false, calories: 680, isEvent: true, occasion: 'churrasco',
      ingredients: ['1 peça de picanha (1.5kg)', 'sal grosso', '500g de mandioca', '100g de bacon', '1 cebola', 'salsinha e coentro frescos para chimichurri', '1 pimentão vermelho', '3 dentes de alho', 'vinagre de vinho tinto', 'azeite extra virgem', 'orégano seco', 'pimenta vermelha seca'],
      steps: [
        'Prepare o chimichurri: pique finamente salsinha, coentro, alho, pimentão. Misture com azeite, vinagre, orégano e pimenta. Deixe marinar 1 hora.',
        'Marque a gordura da picanha em losangos sem cortar a carne.',
        'Tempere generosamente com sal grosso apenas antes de ir à brasa.',
        'Grelhe do lado da gordura primeiro por 8-10 minutos.',
        'Vire e grelhe por mais 6-8 minutos para mal passada ou 10-12 para ao ponto.',
        'Deixe descansar 5-8 minutos antes de fatiar.',
        'Para a farofa: refogue o bacon com cebola, adicione farinha de mandioca e mandioca cozida amassada.',
        'Fatie a picanha e sirva com chimichurri e farofa.',
      ],
      tags: ['churrasco', 'carne', 'brasileiro', 'festa'],
      shoppingList: [
        { id: 's60', name: 'Picanha', quantity: '1.5kg', category: 'proteinas' },
        { id: 's61', name: 'Mandioca', quantity: '500g', category: 'hortifruti' },
        { id: 's62', name: 'Bacon defumado', quantity: '100g', category: 'proteinas' },
        { id: 's63', name: 'Pimentão vermelho', quantity: '1 unidade', category: 'hortifruti' },
        { id: 's64', name: 'Salsinha fresca', quantity: '1 maço', category: 'hortifruti' },
        { id: 's65', name: 'Coentro fresco', quantity: '1 maço', category: 'hortifruti' },
        { id: 's66', name: 'Vinagre de vinho tinto', quantity: '3 colheres', category: 'temperos' },
        { id: 's67', name: 'Sal grosso', quantity: 'a gosto', category: 'temperos' },
      ],
    },
  ],
  ano_novo: [
    {
      id: 'ev_8',
      name: 'Salmão Lacado ao Mel com Lentilha Verde do Puy',
      description: 'Salmão com glaze de mel e mostarda sobre cama de lentilhas do Puy e legumes caramelizados. Lentilha traz sorte!',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
      time: 45, difficulty: 'medio', diet: ['tradicional'], type: ['internacional'],
      dishType: 'jantar', servings: 4, isPremium: false, calories: 520, isEvent: true, occasion: 'ano_novo',
      ingredients: ['4 postas de salmão (180g cada)', '3 colheres de mel', '2 colheres de mostarda dijon', '1 limão', '300g de lentilha verde do Puy', '1 cenoura', '1 salsão', '1 cebola roxa', 'tomilho fresco', '2 colheres de manteiga', 'azeite extra virgem', 'vinagre balsâmico', 'sal e pimenta'],
      steps: [
        'Cozinhe a lentilha em água com tomilho, cenoura e salsão por 20-25 minutos. Escorra e tempere.',
        'Prepare o glaze: misture mel, mostarda, suco e raspas de limão.',
        'Tempere o salmão com sal e pimenta.',
        'Aqueça uma frigideira com azeite e sele o salmão pelo lado da pele por 4 minutos.',
        'Vire, aplique o glaze generosamente e finalize no forno a 200°C por 5-6 minutos.',
        'Refogue a cebola roxa fatiada na manteiga até caramelizar.',
        'Misture a cebola caramelizada nas lentilhas, tempere com vinagre balsâmico.',
        'Sirva o salmão sobre as lentilhas com o glaze restante por cima.',
      ],
      tags: ['réveillon', 'salmão', 'gourmet', 'sorte'],
      shoppingList: [
        { id: 's70', name: 'Salmão fresco (postas)', quantity: '720g (4 peças)', category: 'proteinas' },
        { id: 's71', name: 'Lentilha verde do Puy', quantity: '300g', category: 'graos' },
        { id: 's72', name: 'Mel puro', quantity: '3 colheres', category: 'outros' },
        { id: 's73', name: 'Mostarda Dijon', quantity: '2 colheres', category: 'temperos' },
        { id: 's74', name: 'Cebola roxa', quantity: '1 unidade', category: 'hortifruti' },
        { id: 's75', name: 'Vinagre balsâmico', quantity: '2 colheres', category: 'temperos' },
        { id: 's76', name: 'Cenoura', quantity: '1 unidade', category: 'hortifruti' },
        { id: 's77', name: 'Limão siciliano', quantity: '1 unidade', category: 'hortifruti' },
      ],
    },
  ],
  dia_dos_pais: [
    {
      id: 'ev_9',
      name: 'Costela Bovina Braseada no Vinho Tinto',
      description: 'Costela macia desossada após 4 horas de brasagem lenta em vinho tinto com legumes aromáticos.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
      time: 280, difficulty: 'dificil', diet: ['tradicional'], type: ['classica'],
      dishType: 'almoco', servings: 6, isPremium: false, calories: 750, isEvent: true, occasion: 'dia_dos_pais',
      ingredients: ['2kg de costela bovina', '750ml de vinho tinto encorpado', '2 cenouras', '2 salsões', '1 cebola', '4 dentes de alho', '2 folhas de louro', 'tomilho e alecrim', '2 colheres de extrato de tomate', '500ml de caldo de carne', '3 colheres de farinha', 'azeite', 'sal grosso e pimenta-do-reino'],
      steps: [
        'Na véspera, marine a costela no vinho com os legumes e ervas por 12 horas na geladeira.',
        'Retire a carne da marinada e seque bem com papel-toalha. Reserve a marinada.',
        'Sele a costela em azeite quente por todos os lados até formar uma crosta dourada.',
        'Na mesma panela, doure os legumes da marinada.',
        'Polvilhe a farinha e mexa por 2 minutos.',
        'Adicione a marinada coada, o extrato de tomate e o caldo de carne.',
        'Coloque a carne de volta, tampe e leve ao forno a 160°C por 3,5 a 4 horas.',
        'Retire a carne, coe o molho e reduza até encorpar.',
        'Sirva a costela desfiada com o molho reduzido e purê de batatas.',
      ],
      tags: ['dia dos pais', 'carne', 'braseado', 'especial'],
      shoppingList: [
        { id: 's80', name: 'Costela bovina', quantity: '2kg', category: 'proteinas' },
        { id: 's81', name: 'Vinho tinto encorpado', quantity: '750ml', category: 'outros' },
        { id: 's82', name: 'Caldo de carne', quantity: '500ml', category: 'outros' },
        { id: 's83', name: 'Extrato de tomate', quantity: '2 colheres', category: 'temperos' },
        { id: 's84', name: 'Cenoura', quantity: '2 unidades', category: 'hortifruti' },
        { id: 's85', name: 'Salsão', quantity: '2 talos', category: 'hortifruti' },
        { id: 's86', name: 'Ervas frescas (mix)', quantity: '1 maço', category: 'hortifruti' },
        { id: 's87', name: 'Batatas para purê', quantity: '1kg', category: 'hortifruti' },
      ],
    },
  ],
};

export async function generateInspirationMenu(filters: InspirationFilters): Promise<Recipe[]> {
  await new Promise(resolve => setTimeout(resolve, 1800));
  const menus = INSPIRATION_MENUS[filters.occasion] || [];
  if (filters.diet && filters.diet !== 'todas') {
    const filtered = menus.filter(r => r.diet.includes(filters.diet as DietType));
    return filtered.length > 0 ? filtered : menus;
  }
  return menus;
}
