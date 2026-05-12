// Chef Na Mão - Mock Data & Recipes Database

export type DietType = 'tradicional' | 'vegana' | 'vegetariana';
export type MealType = 'rapida' | 'classica' | 'internacional' | 'regional';
export type DishType = 'cafe' | 'almoco' | 'jantar' | 'lanche' | 'sobremesa';
export type Difficulty = 'facil' | 'medio' | 'dificil';
export type EventOccasion =
  | 'dia_das_maes'
  | 'jantar_romantico'
  | 'aniversario'
  | 'natal'
  | 'pascoa'
  | 'churrasco'
  | 'ano_novo'
  | 'dia_dos_pais';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: 'proteinas' | 'hortifruti' | 'graos' | 'laticinios' | 'temperos' | 'outros';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  time: number; // minutos
  difficulty: Difficulty;
  diet: DietType[];
  type: MealType[];
  dishType: DishType;
  servings: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  isPremium: boolean;
  calories?: number;
  isEvent?: boolean;
  occasion?: EventOccasion;
  shoppingList?: ShoppingItem[];
}

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Omelete de Queijo e Tomate',
    description: 'Uma omelete cremosa e rápida, perfeita para qualquer hora do dia.',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600',
    time: 10,
    difficulty: 'facil',
    diet: ['tradicional', 'vegetariana'],
    type: ['rapida'],
    dishType: 'cafe',
    servings: 1,
    ingredients: ['2 ovos', '1 tomate picado', '50g de queijo', 'sal e pimenta', '1 colher de manteiga'],
    steps: [
      'Bata os ovos em uma tigela com sal e pimenta.',
      'Aqueça a frigideira em fogo médio e adicione a manteiga.',
      'Despeje os ovos batidos na frigideira.',
      'Adicione o queijo e o tomate por cima.',
      'Dobre a omelete ao meio e sirva quente.',
    ],
    tags: ['rápido', 'café da manhã', 'proteína'],
    isPremium: false,
    calories: 280,
  },
  {
    id: '2',
    name: 'Macarrão ao Alho e Óleo',
    description: 'Clássico italiano simples e delicioso, pronto em minutos.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91798d0b50?w=600',
    time: 20,
    difficulty: 'facil',
    diet: ['tradicional', 'vegetariana'],
    type: ['classica'],
    dishType: 'almoco',
    servings: 2,
    ingredients: ['200g de macarrão', '4 dentes de alho', '4 colheres de azeite', 'sal', 'pimenta', 'salsinha'],
    steps: [
      'Cozinhe o macarrão em água salgada até ficar al dente.',
      'Em uma frigideira, aqueça o azeite e doure o alho fatiado.',
      'Escorra o macarrão e adicione à frigideira.',
      'Misture bem, adicione sal e pimenta a gosto.',
      'Finalize com salsinha picada e sirva imediatamente.',
    ],
    tags: ['massa', 'vegetariano', 'fácil'],
    isPremium: false,
    calories: 420,
  },
  {
    id: '3',
    name: 'Arroz de Frango Simples',
    description: 'Prato completo e nutritivo, típico da cozinha brasileira.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',
    time: 35,
    difficulty: 'medio',
    diet: ['tradicional'],
    type: ['classica', 'regional'],
    dishType: 'almoco',
    servings: 3,
    ingredients: ['2 xícaras de arroz', '300g de frango', '1 cebola', '2 dentes de alho', 'sal', 'tempero verde'],
    steps: [
      'Tempere o frango com sal e alho e doure em uma panela.',
      'Adicione a cebola picada e refogue até dourar.',
      'Acrescente o arroz lavado e misture bem.',
      'Adicione 4 xícaras de água quente e sal.',
      'Tampe e cozinhe em fogo baixo por 20 minutos.',
      'Finalize com tempero verde e sirva.',
    ],
    tags: ['brasileiro', 'completo', 'família'],
    isPremium: false,
    calories: 520,
  },
  {
    id: '4',
    name: 'Buddha Bowl Vegano',
    description: 'Bowl colorido e nutritivo com grãos, legumes e molho tahine.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    time: 25,
    difficulty: 'medio',
    diet: ['vegana', 'vegetariana'],
    type: ['internacional'],
    dishType: 'almoco',
    servings: 2,
    ingredients: ['1 xícara de quinoa', 'grão-de-bico', 'espinafre', 'cenoura', 'beterraba', 'tahine', 'limão'],
    steps: [
      'Cozinhe a quinoa conforme instruções da embalagem.',
      'Asse o grão-de-bico com azeite e temperos por 20 minutos.',
      'Prepare os legumes crus ou levemente refogados.',
      'Monte o bowl com a quinoa na base.',
      'Distribua os legumes e o grão-de-bico.',
      'Finalize com molho de tahine e suco de limão.',
    ],
    tags: ['vegano', 'saudável', 'colorido'],
    isPremium: true,
    calories: 380,
  },
  {
    id: '5',
    name: 'Curry de Lentilha',
    description: 'Receita indiana reconfortante, rica em proteínas e sabores.',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600',
    time: 40,
    difficulty: 'medio',
    diet: ['vegana', 'vegetariana'],
    type: ['internacional'],
    dishType: 'jantar',
    servings: 4,
    ingredients: ['2 xícaras de lentilha', 'leite de coco', '2 tomates', 'curry em pó', 'gengibre', 'alho', 'cebola'],
    steps: [
      'Refogue cebola, alho e gengibre até dourar.',
      'Adicione curry em pó e tomates picados.',
      'Acrescente a lentilha lavada e misture.',
      'Despeje o leite de coco e 2 xícaras de água.',
      'Cozinhe em fogo médio por 25 minutos mexendo ocasionalmente.',
      'Ajuste o sal e sirva com arroz ou pão naan.',
    ],
    tags: ['indiano', 'proteína', 'reconfortante'],
    isPremium: true,
    calories: 340,
  },
  {
    id: '6',
    name: 'Banana Caramelizada com Canela',
    description: 'Sobremesa rápida e irresistível com poucos ingredientes.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
    time: 8,
    difficulty: 'facil',
    diet: ['tradicional', 'vegetariana'],
    type: ['rapida'],
    dishType: 'sobremesa',
    servings: 2,
    ingredients: ['2 bananas', '2 colheres de açúcar', '1 colher de manteiga', 'canela em pó'],
    steps: [
      'Corte as bananas ao meio no sentido do comprimento.',
      'Derreta a manteiga em uma frigideira antiaderente.',
      'Adicione as bananas e polvilhe o açúcar por cima.',
      'Cozinhe por 2 minutos até caramelizar.',
      'Vire com cuidado e repita do outro lado.',
      'Sirva quente com canela polvilhada.',
    ],
    tags: ['sobremesa', 'rápido', 'simples'],
    isPremium: false,
    calories: 180,
  },
  {
    id: '7',
    name: 'Vitamina de Frutas Tropicais',
    description: 'Bebida refrescante e energética para começar o dia.',
    image: 'https://images.unsplash.com/photo-1638176066959-8a4db7e8e007?w=600',
    time: 5,
    difficulty: 'facil',
    diet: ['vegana', 'vegetariana', 'tradicional'],
    type: ['rapida'],
    dishType: 'cafe',
    servings: 2,
    ingredients: ['1 manga', '1 banana', '200ml leite de coco', 'gelo', 'mel a gosto'],
    steps: [
      'Descasque e pique as frutas.',
      'Coloque tudo no liquidificador.',
      'Adicione o leite de coco e o gelo.',
      'Bata por 1 minuto até ficar cremoso.',
      'Adoce com mel se preferir e sirva gelado.',
    ],
    tags: ['bebida', 'saudável', 'tropical'],
    isPremium: false,
    calories: 210,
  },
  {
    id: '8',
    name: 'Tacos de Frango Grelhado',
    description: 'Tacos mexicanos com frango temperado e molho fresco.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
    time: 30,
    difficulty: 'medio',
    diet: ['tradicional'],
    type: ['internacional'],
    dishType: 'jantar',
    servings: 4,
    ingredients: ['400g frango', 'tortillas', 'abacate', 'tomate', 'limão', 'coentro', 'pimenta'],
    steps: [
      'Tempere o frango com limão, sal, pimenta e cominho.',
      'Grelhe o frango por 6-7 minutos de cada lado.',
      'Deixe descansar 5 minutos e corte em tiras.',
      'Amasse o abacate com limão e sal para fazer guacamole.',
      'Aqueça as tortillas em frigideira seca.',
      'Monte os tacos com frango, guacamole, tomate e coentro.',
    ],
    tags: ['mexicano', 'grelhado', 'festa'],
    isPremium: true,
    calories: 460,
  },
];

export const CHAT_RESPONSES: { [key: string]: string[] } = {
  greeting: [
    'Olá! Sou o Chef Na Mão. Como posso te ajudar hoje na cozinha? 👨‍🍳',
    'Oi! Que bom te ver por aqui! Vamos cozinhar algo especial hoje?',
  ],
  ingredients: [
    'Com esses ingredientes dá pra fazer muita coisa! Me conta mais: você prefere algo rápido ou tem tempo para uma receita especial?',
    'Interessante combinação! Tenho algumas ideias. Você prefere algo leve ou mais substancial?',
    'Perfeito! Com isso dá para criar um prato incrível. Qual é o seu nível de experiência na cozinha?',
  ],
  tips: [
    'Uma dica valiosa: sempre deixe a frigideira aquecer bem antes de adicionar os ingredientes. Isso garante um selamento perfeito!',
    'Para realçar o sabor, experimente adicionar uma pitada de sal no final do cozimento. Faz toda a diferença!',
    'Lembra de deixar as carnes descansarem após o cozimento. Isso mantém os sucos dentro da peça.',
  ],
  substitute: [
    'Pode substituir sem problemas! Qual ingrediente você não tem disponível? Vou te dar a melhor alternativa.',
    'Claro! Na culinária sempre tem um jeito de adaptar. Me fala o que está faltando!',
  ],
  time: [
    'Para receitas rápidas de até 15 minutos, ovos são seus melhores amigos! Omelete, mexido, pochê... infinitas possibilidades.',
    'Em 20 minutos dá para fazer um macarrão delicioso ou um salteado de legumes. Quer que eu te sugira algo?',
  ],
  default: [
    'Boa pergunta! Na cozinha sempre tem solução. Pode me dar mais detalhes para eu te ajudar melhor?',
    'Entendi! Vamos resolver isso juntos. Me conta mais sobre o que você tem disponível.',
    'Que situação interessante! Posso te ajudar a criar algo delicioso com o que você tem.',
    'Perfeito! Culinária é criatividade. Vamos pensar juntos na melhor solução para você.',
  ],
};

export const DIET_LABELS: Record<DietType, string> = {
  tradicional: 'Tradicional',
  vegana: 'Vegana',
  vegetariana: 'Vegetariana',
};

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  rapida: 'Rápida',
  classica: 'Clássica',
  internacional: 'Internacional',
  regional: 'Regional',
};

export const DISH_TYPE_LABELS: Record<DishType, string> = {
  cafe: 'Café da manhã',
  almoco: 'Almoço',
  jantar: 'Jantar',
  lanche: 'Lanche',
  sobremesa: 'Sobremesa',
};

export const EVENT_OCCASIONS: Array<{ value: EventOccasion; label: string; emoji: string; description: string }> = [
  { value: 'dia_das_maes', label: 'Dia das Mães', emoji: '💐', description: 'Um almoço ou jantar especial para homenagear' },
  { value: 'jantar_romantico', label: 'Jantar Romântico', emoji: '🕯️', description: 'Ambiente íntimo com pratos sofisticados' },
  { value: 'aniversario', label: 'Aniversário', emoji: '🎂', description: 'Celebração com pratos que impressionam' },
  { value: 'natal', label: 'Natal', emoji: '🎄', description: 'Tradição e sabor nas ceias natalinas' },
  { value: 'pascoa', label: 'Páscoa', emoji: '🐣', description: 'Pratos tradicionais e deliciosos para a data' },
  { value: 'churrasco', label: 'Churrasco', emoji: '🔥', description: 'Clássicos para reunir amigos e família' },
  { value: 'ano_novo', label: 'Réveillon', emoji: '🥂', description: 'Pratos especiais para celebrar a virada' },
  { value: 'dia_dos_pais', label: 'Dia dos Pais', emoji: '👨‍👧', description: 'Homenagem com receitas que ele adora' },
];

export const EVENT_OCCASION_LABELS: Record<EventOccasion, string> = {
  dia_das_maes: 'Dia das Mães',
  jantar_romantico: 'Jantar Romântico',
  aniversario: 'Aniversário',
  natal: 'Natal',
  pascoa: 'Páscoa',
  churrasco: 'Churrasco',
  ano_novo: 'Réveillon',
  dia_dos_pais: 'Dia dos Pais',
};

export const SHOPPING_CATEGORY_LABELS: Record<ShoppingItem['category'], string> = {
  proteinas: '🥩 Proteínas',
  hortifruti: '🥦 Hortifruti',
  graos: '🌾 Grãos e Massas',
  laticinios: '🧀 Laticínios',
  temperos: '🧂 Temperos',
  outros: '🛒 Outros',
};

export const DISH_TYPE_ICONS: Record<DishType, string> = {
  cafe: 'free-breakfast',
  almoco: 'restaurant',
  jantar: 'nightlife',
  lanche: 'local-cafe',
  sobremesa: 'cake',
};
