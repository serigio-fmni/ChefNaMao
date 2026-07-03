// OkCheff - Sistema de Multi-idioma
// OkCheff é uma marca global e NÃO deve ser traduzido

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'it' | 'de';

export interface Strings {
  // App brand (never translate)
  appName: string;
  appTagline: string;

  // Navigation tabs
  tabDiscover: string;
  tabNotebook: string;
  tabChat: string;
  tabProfile: string;

  // Home
  homeGreeting: string;
  homeQuestionFridge: string;
  homeQuestionInspiration: string;
  homeFridgeTab: string;
  homeInspirationTab: string;
  homeIngredients: string;
  homeIngredientsSubtitleFree: string;
  homeIngredientsSubtitlePremium: string;
  homeIngredientPlaceholder: string;
  homeLimitFree: string;
  homeGenerateButton: string;
  homeGenerateAll: string;
  homeGenerating: string;
  homeRecipesFound: string;
  homeNoRecipes: string;
  homeVibeOccasion: string;
  homeVibeSubtitle: string;
  homeSuggestMenu: string;
  homeSuggestMenuSelect: string;
  homeSuggestMenuLoading: string;
  homeGourmetMenu: string;
  homeNoSuggestions: string;
  homeShoppingIncluded: string;
  homeDietFilter: string;
  homeRecipeTypeFilter: string;

  // Shopping list
  shoppingListTitle: string;
  shoppingListAllDone: string;
  shoppingListReadyToCook: string;
  shoppingListToggleShow: string;
  shoppingListToggleHide: string;
  shoppingListItems: string;

  // Start cooking button
  startCooking: string;
  startCookingCheck: string;

  // Notebook
  notebookTitle: string;
  notebookSaved: string;
  notebookSavedPlural: string;
  notebookLimit: string;
  notebookEvents: string;
  notebookEventSaved: string;
  notebookEventSavedPlural: string;
  notebookTabRecipes: string;
  notebookTabEvents: string;
  notebookEmpty: string;
  notebookNoEvents: string;
  notebookEmptyDesc: string;
  notebookNoEventsDesc: string;
  notebookDiscover: string;
  notebookCreateMenu: string;
  notebookLimitBanner: string;
  notebookShoppingList: string;

  // Chat
  chatName: string;
  chatStatus: string;
  chatInputPlaceholder: string;
  chatVoiceFeature: string;

  // Voice / Ok Cheff
  voiceWakeWord: string;
  voiceActivate: string;
  voiceListening: string;
  voiceEnergyLabel: string;
  voiceEnergyFull: string;
  voiceEnergyLow: string;
  voiceReadSteps: string;

  // Profile
  profileTitle: string;
  profilePlanFree: string;
  profilePlanPremium: string;
  profilePremiumActive: string;
  profileActivatePremium: string;
  profilePremiumDesc: string;
  profileDiet: string;
  profilePreferences: string;
  profileVoiceMode: string;
  profileVoiceDesc: string;
  profileVoiceCommand: string;
  profileFeatures: string[];

  // Premium badge
  premiumFeature: string;
  premiumActivate: string;

  // Difficulty
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;

  // Occasion labels
  occasionMothersDay: string;
  occasionRomanticDinner: string;
  occasionBirthday: string;
  occasionChristmas: string;
  occasionEaster: string;
  occasionBBQ: string;
  occasionNewYear: string;
  occasionFathersDay: string;

  // Shopping categories
  catProteins: string;
  catProduce: string;
  catGrains: string;
  catDairy: string;
  catSpices: string;
  catOther: string;

  // Recipe detail
  recipeIngredients: string;
  recipeSteps: string;
  recipeTime: string;
  recipeServings: string;
  recipeDifficulty: string;
  recipeCalories: string;
  recipeLockedTitle: string;
  recipeLockedDesc: string;
  recipeDone: string;
  recipeDoneMessage: string;
  recipeGourmet: string;

  // Misc
  deleteRecipe: string;
  deleteRecipeConfirm: string;
  cancel: string;
  remove: string;
  save: string;
  upgrade: string;
  with: string;
  portions: string;
  minutes: string;

  // Profile — strings extras
  signOutTitle: string;
  signOutMessage: string;
  signOutConfirm: string;
  accountConnected: string;
  signInTitle: string;
  signInSubtitle: string;
  statRecipes: string;
  statEvents: string;
  statIngredients: string;
  profileSubscriptionPlan: string;
  profileLanguageTitle: string;
  voiceFeatureActivation: string;
  voiceFeatureTTS: string;
  voiceFeatureSTT: string;
}

const pt: Strings = {
  appName: 'OkCheff',
  appTagline: 'Seu chef pessoal',

  tabDiscover: 'Descobrir',
  tabNotebook: 'Caderno',
  tabChat: 'Chef Chat',
  tabProfile: 'Perfil',

  homeGreeting: 'Olá,',
  homeQuestionFridge: 'O que vamos\ncozinhar hoje?',
  homeQuestionInspiration: 'Qual a ocasião\nespecial?',
  homeFridgeTab: 'Na Geladeira',
  homeInspirationTab: 'Inspiração',
  homeIngredients: 'Ingredientes disponíveis',
  homeIngredientsSubtitleFree: 'Até 3 ingredientes no plano gratuito',
  homeIngredientsSubtitlePremium: 'Adicione quantos ingredientes quiser',
  homeIngredientPlaceholder: 'Ex: frango, tomate, alho...',
  homeLimitFree: 'Limite do plano gratuito atingido. Faça upgrade para adicionar mais!',
  homeGenerateButton: 'Gerar Receitas',
  homeGenerateAll: 'Ver Todas as Receitas',
  homeGenerating: 'Gerando receitas...',
  homeRecipesFound: 'receitas encontradas',
  homeNoRecipes: 'Nenhuma receita encontrada',
  homeVibeOccasion: 'Vibe / Ocasião Especial',
  homeVibeSubtitle: 'Selecione a data e o OkCheff cria o menu perfeito para você',
  homeSuggestMenu: 'Sugerir Menu Exclusivo',
  homeSuggestMenuSelect: 'Selecione uma ocasião',
  homeSuggestMenuLoading: 'OkCheff preparando menu exclusivo...',
  homeGourmetMenu: 'Menu Gourmet',
  homeNoSuggestions: 'Nenhuma sugestão disponível',
  homeShoppingIncluded: '🛒 Lista de compras inclusa · Receitas elaboradas para impressionar',
  homeDietFilter: 'Dieta',
  homeRecipeTypeFilter: 'Tipo de receita',

  shoppingListTitle: 'Lista de Compras',
  shoppingListAllDone: 'Tudo comprado! Pronto para cozinhar.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Ver',
  shoppingListToggleHide: 'Ocultar',
  shoppingListItems: 'itens',

  startCooking: 'Iniciar Preparo com OkCheff',
  startCookingCheck: 'Confira a lista de compras primeiro',

  notebookTitle: 'Meu Caderno',
  notebookSaved: 'receita salva',
  notebookSavedPlural: 'receitas salvas',
  notebookLimit: 'Limite: 5',
  notebookEvents: 'eventos salvos',
  notebookEventSaved: 'evento salvo',
  notebookEventSavedPlural: 'eventos salvos',
  notebookTabRecipes: 'Receitas',
  notebookTabEvents: 'Meus Eventos',
  notebookEmpty: 'Caderno vazio',
  notebookNoEvents: 'Sem eventos salvos',
  notebookEmptyDesc: 'Salve suas receitas favoritas e acesse-as offline a qualquer momento.',
  notebookNoEventsDesc: 'Crie menus especiais na aba Inspiração e salve aqui para consultar depois.',
  notebookDiscover: 'Descobrir Receitas',
  notebookCreateMenu: 'Criar Menu Especial',
  notebookLimitBanner: 'Caderno cheio! Upgrade para Premium para salvar receitas ilimitadas.',
  notebookShoppingList: 'Lista de Compras',

  chatName: 'OkCheff',
  chatStatus: 'Assistente culinário • Online',
  chatInputPlaceholder: 'Pergunte ao OkCheff...',
  chatVoiceFeature: "Modo Mãos Livres com comando 'Ok Cheff' e voz bidirecional",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Ativar Ok Cheff',
  voiceListening: 'Ouvindo...',
  voiceEnergyLabel: 'Energia do Chef',
  voiceEnergyFull: 'Energia máxima',
  voiceEnergyLow: 'Energia baixa',
  voiceReadSteps: 'Ouvir passos com OkCheff',

  profileTitle: 'Perfil',
  profilePlanFree: 'Plano Gratuito',
  profilePlanPremium: 'Plano Premium',
  profilePremiumActive: 'Premium Ativo',
  profileActivatePremium: 'Ativar Premium',
  profilePremiumDesc: 'Ingredientes ilimitados, voz, todas as dietas',
  profileDiet: 'Dieta',
  profilePreferences: 'Preferências Culinárias',
  profileVoiceMode: 'Modo Mãos Livres',
  profileVoiceDesc: 'Ative por voz, ouça passos da receita em áudio',
  profileVoiceCommand: 'Comando "Ok Cheff"',
  profileFeatures: [
    'Ingredientes ilimitados na busca',
    'Caderno digital ilimitado',
    'Modo Mãos Livres com voz',
    'Comando "Ok Cheff"',
    'Todas as dietas e cozinhas',
    'Acesso offline total',
  ],

  premiumFeature: 'Recurso Premium',
  premiumActivate: 'Ativar',

  difficultyEasy: 'Fácil',
  difficultyMedium: 'Médio',
  difficultyHard: 'Difícil',

  occasionMothersDay: 'Dia das Mães',
  occasionRomanticDinner: 'Jantar Romântico',
  occasionBirthday: 'Aniversário',
  occasionChristmas: 'Natal',
  occasionEaster: 'Páscoa',
  occasionBBQ: 'Churrasco',
  occasionNewYear: 'Réveillon',
  occasionFathersDay: 'Dia dos Pais',

  catProteins: '🥩 Proteínas',
  catProduce: '🥦 Hortifruti',
  catGrains: '🌾 Grãos e Massas',
  catDairy: '🧀 Laticínios',
  catSpices: '🧂 Temperos',
  catOther: '🛒 Outros',

  recipeIngredients: 'Ingredientes',
  recipeSteps: 'Modo de Preparo',
  recipeTime: 'Tempo',
  recipeServings: 'Porções',
  recipeDifficulty: 'Dificuldade',
  recipeCalories: 'Calorias',
  recipeLockedTitle: 'Receita Premium',
  recipeLockedDesc: 'Esta receita completa está disponível apenas para assinantes Premium.',
  recipeDone: '🎉',
  recipeDoneMessage: 'Receita concluída! Bom apetite!',
  recipeGourmet: 'Gourmet',

  deleteRecipe: 'Remover receita',
  deleteRecipeConfirm: 'Deseja remover "{name}" do seu caderno?',
  cancel: 'Cancelar',
  remove: 'Remover',
  save: 'Salvar',
  upgrade: 'Upgrade',
  with: 'Com',
  portions: 'porções',
  minutes: 'min',

  signOutTitle: 'Sair da conta',
  signOutMessage: 'Deseja realmente sair do OkCheff?',
  signOutConfirm: 'Sair',
  accountConnected: 'Conta conectada',
  signInTitle: 'Entrar / Criar conta',
  signInSubtitle: 'Sincronize receitas e use a IA real',
  statRecipes: 'Receitas\nSalvas',
  statEvents: 'Meus\nEventos',
  statIngredients: 'Ingredientes\nGrátis',
  profileSubscriptionPlan: 'Plano de Assinatura',
  profileLanguageTitle: 'Idioma / Language',
  voiceFeatureActivation: 'Ativação por voz "Ok Cheff"',
  voiceFeatureTTS: 'Text-to-Speech para receitas',
  voiceFeatureSTT: 'Speech-to-Text para dúvidas',
};

const en: Strings = {
  appName: 'OkCheff',
  appTagline: 'Your personal chef',

  tabDiscover: 'Discover',
  tabNotebook: 'Notebook',
  tabChat: 'Chef Chat',
  tabProfile: 'Profile',

  homeGreeting: 'Hello,',
  homeQuestionFridge: "What shall we\ncook today?",
  homeQuestionInspiration: "What's the\nspecial occasion?",
  homeFridgeTab: 'In the Fridge',
  homeInspirationTab: 'Inspiration',
  homeIngredients: 'Available ingredients',
  homeIngredientsSubtitleFree: 'Up to 3 ingredients on the free plan',
  homeIngredientsSubtitlePremium: 'Add as many ingredients as you want',
  homeIngredientPlaceholder: 'E.g.: chicken, tomato, garlic...',
  homeLimitFree: 'Free plan limit reached. Upgrade to add more!',
  homeGenerateButton: 'Generate Recipes',
  homeGenerateAll: 'View All Recipes',
  homeGenerating: 'Generating recipes...',
  homeRecipesFound: 'recipes found',
  homeNoRecipes: 'No recipes found',
  homeVibeOccasion: 'Vibe / Special Occasion',
  homeVibeSubtitle: 'Select the date and OkCheff creates the perfect menu for you',
  homeSuggestMenu: 'Suggest Exclusive Menu',
  homeSuggestMenuSelect: 'Select an occasion',
  homeSuggestMenuLoading: 'OkCheff preparing exclusive menu...',
  homeGourmetMenu: 'Gourmet Menu',
  homeNoSuggestions: 'No suggestions available',
  homeShoppingIncluded: '🛒 Shopping list included · Elaborate recipes to impress',
  homeDietFilter: 'Diet',
  homeRecipeTypeFilter: 'Recipe type',

  shoppingListTitle: 'Shopping List',
  shoppingListAllDone: 'All bought! Ready to cook.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Show',
  shoppingListToggleHide: 'Hide',
  shoppingListItems: 'items',

  startCooking: 'Start Cooking with OkCheff',
  startCookingCheck: 'Check the shopping list first',

  notebookTitle: 'My Notebook',
  notebookSaved: 'recipe saved',
  notebookSavedPlural: 'recipes saved',
  notebookLimit: 'Limit: 5',
  notebookEvents: 'events saved',
  notebookEventSaved: 'event saved',
  notebookEventSavedPlural: 'events saved',
  notebookTabRecipes: 'Recipes',
  notebookTabEvents: 'My Events',
  notebookEmpty: 'Empty notebook',
  notebookNoEvents: 'No events saved',
  notebookEmptyDesc: 'Save your favorite recipes and access them offline anytime.',
  notebookNoEventsDesc: 'Create special menus in the Inspiration tab and save them here.',
  notebookDiscover: 'Discover Recipes',
  notebookCreateMenu: 'Create Special Menu',
  notebookLimitBanner: 'Notebook full! Upgrade to Premium to save unlimited recipes.',
  notebookShoppingList: 'Shopping List',

  chatName: 'OkCheff',
  chatStatus: 'Culinary assistant • Online',
  chatInputPlaceholder: 'Ask OkCheff...',
  chatVoiceFeature: "Hands-Free Mode with 'Ok Cheff' command and two-way voice",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Activate Ok Cheff',
  voiceListening: 'Listening...',
  voiceEnergyLabel: 'Chef Energy',
  voiceEnergyFull: 'Full energy',
  voiceEnergyLow: 'Low energy',
  voiceReadSteps: 'Listen to steps with OkCheff',

  profileTitle: 'Profile',
  profilePlanFree: 'Free Plan',
  profilePlanPremium: 'Premium Plan',
  profilePremiumActive: 'Premium Active',
  profileActivatePremium: 'Activate Premium',
  profilePremiumDesc: 'Unlimited ingredients, voice, all diets',
  profileDiet: 'Diet',
  profilePreferences: 'Culinary Preferences',
  profileVoiceMode: 'Hands-Free Mode',
  profileVoiceDesc: 'Activate by voice, listen to recipe steps in audio',
  profileVoiceCommand: '"Ok Cheff" Command',
  profileFeatures: [
    'Unlimited ingredients in search',
    'Unlimited digital notebook',
    'Hands-Free Mode with voice',
    '"Ok Cheff" command',
    'All diets and cuisines',
    'Full offline access',
  ],

  premiumFeature: 'Premium Feature',
  premiumActivate: 'Activate',

  difficultyEasy: 'Easy',
  difficultyMedium: 'Medium',
  difficultyHard: 'Hard',

  occasionMothersDay: "Mother's Day",
  occasionRomanticDinner: 'Romantic Dinner',
  occasionBirthday: 'Birthday',
  occasionChristmas: 'Christmas',
  occasionEaster: 'Easter',
  occasionBBQ: 'Barbecue',
  occasionNewYear: "New Year's Eve",
  occasionFathersDay: "Father's Day",

  catProteins: '🥩 Proteins',
  catProduce: '🥦 Produce',
  catGrains: '🌾 Grains & Pasta',
  catDairy: '🧀 Dairy',
  catSpices: '🧂 Spices',
  catOther: '🛒 Other',

  recipeIngredients: 'Ingredients',
  recipeSteps: 'Preparation',
  recipeTime: 'Time',
  recipeServings: 'Servings',
  recipeDifficulty: 'Difficulty',
  recipeCalories: 'Calories',
  recipeLockedTitle: 'Premium Recipe',
  recipeLockedDesc: 'This full recipe is only available to Premium subscribers.',
  recipeDone: '🎉',
  recipeDoneMessage: 'Recipe complete! Enjoy your meal!',
  recipeGourmet: 'Gourmet',

  deleteRecipe: 'Remove recipe',
  deleteRecipeConfirm: 'Do you want to remove "{name}" from your notebook?',
  cancel: 'Cancel',
  remove: 'Remove',
  save: 'Save',
  upgrade: 'Upgrade',
  with: 'With',
  portions: 'servings',
  minutes: 'min',

  signOutTitle: 'Sign out',
  signOutMessage: 'Do you really want to sign out of OkCheff?',
  signOutConfirm: 'Sign out',
  accountConnected: 'Account connected',
  signInTitle: 'Sign in / Create account',
  signInSubtitle: 'Sync recipes and use the real AI',
  statRecipes: 'Saved\nRecipes',
  statEvents: 'My\nEvents',
  statIngredients: 'Free\nIngredients',
  profileSubscriptionPlan: 'Subscription Plan',
  profileLanguageTitle: 'Language',
  voiceFeatureActivation: '"Ok Cheff" voice activation',
  voiceFeatureTTS: 'Text-to-Speech for recipes',
  voiceFeatureSTT: 'Speech-to-Text for questions',
};

const es: Strings = {
  appName: 'OkCheff',
  appTagline: 'Tu chef personal',

  tabDiscover: 'Descubrir',
  tabNotebook: 'Cuaderno',
  tabChat: 'Chef Chat',
  tabProfile: 'Perfil',

  homeGreeting: 'Hola,',
  homeQuestionFridge: '¿Qué cocinamos\nhoy?',
  homeQuestionInspiration: '¿Cuál es la\nocasión especial?',
  homeFridgeTab: 'En la Nevera',
  homeInspirationTab: 'Inspiración',
  homeIngredients: 'Ingredientes disponibles',
  homeIngredientsSubtitleFree: 'Hasta 3 ingredientes en el plan gratuito',
  homeIngredientsSubtitlePremium: 'Agrega todos los ingredientes que quieras',
  homeIngredientPlaceholder: 'Ej: pollo, tomate, ajo...',
  homeLimitFree: 'Límite del plan gratuito alcanzado. ¡Actualiza para agregar más!',
  homeGenerateButton: 'Generar Recetas',
  homeGenerateAll: 'Ver Todas las Recetas',
  homeGenerating: 'Generando recetas...',
  homeRecipesFound: 'recetas encontradas',
  homeNoRecipes: 'No se encontraron recetas',
  homeVibeOccasion: 'Vibe / Ocasión Especial',
  homeVibeSubtitle: 'Selecciona la fecha y OkCheff crea el menú perfecto para ti',
  homeSuggestMenu: 'Sugerir Menú Exclusivo',
  homeSuggestMenuSelect: 'Selecciona una ocasión',
  homeSuggestMenuLoading: 'OkCheff preparando menú exclusivo...',
  homeGourmetMenu: 'Menú Gourmet',
  homeNoSuggestions: 'No hay sugerencias disponibles',
  homeShoppingIncluded: '🛒 Lista de compras incluida · Recetas elaboradas para impresionar',
  homeDietFilter: 'Dieta',
  homeRecipeTypeFilter: 'Tipo de receta',

  shoppingListTitle: 'Lista de Compras',
  shoppingListAllDone: '¡Todo comprado! Listo para cocinar.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Ver',
  shoppingListToggleHide: 'Ocultar',
  shoppingListItems: 'artículos',

  startCooking: 'Iniciar Preparación con OkCheff',
  startCookingCheck: 'Revisa la lista de compras primero',

  notebookTitle: 'Mi Cuaderno',
  notebookSaved: 'receta guardada',
  notebookSavedPlural: 'recetas guardadas',
  notebookLimit: 'Límite: 5',
  notebookEvents: 'eventos guardados',
  notebookEventSaved: 'evento guardado',
  notebookEventSavedPlural: 'eventos guardados',
  notebookTabRecipes: 'Recetas',
  notebookTabEvents: 'Mis Eventos',
  notebookEmpty: 'Cuaderno vacío',
  notebookNoEvents: 'Sin eventos guardados',
  notebookEmptyDesc: 'Guarda tus recetas favoritas y accede a ellas sin conexión.',
  notebookNoEventsDesc: 'Crea menús especiales en la pestaña Inspiración y guárdalos aquí.',
  notebookDiscover: 'Descubrir Recetas',
  notebookCreateMenu: 'Crear Menú Especial',
  notebookLimitBanner: 'Cuaderno lleno. Actualiza a Premium para guardar recetas ilimitadas.',
  notebookShoppingList: 'Lista de Compras',

  chatName: 'OkCheff',
  chatStatus: 'Asistente culinario • En línea',
  chatInputPlaceholder: 'Pregunta a OkCheff...',
  chatVoiceFeature: "Modo manos libres con comando 'Ok Cheff' y voz bidireccional",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Activar Ok Cheff',
  voiceListening: 'Escuchando...',
  voiceEnergyLabel: 'Energía del Chef',
  voiceEnergyFull: 'Energía máxima',
  voiceEnergyLow: 'Energía baja',
  voiceReadSteps: 'Escuchar pasos con OkCheff',

  profileTitle: 'Perfil',
  profilePlanFree: 'Plan Gratuito',
  profilePlanPremium: 'Plan Premium',
  profilePremiumActive: 'Premium Activo',
  profileActivatePremium: 'Activar Premium',
  profilePremiumDesc: 'Ingredientes ilimitados, voz, todas las dietas',
  profileDiet: 'Dieta',
  profilePreferences: 'Preferencias Culinarias',
  profileVoiceMode: 'Modo Manos Libres',
  profileVoiceDesc: 'Activa por voz, escucha los pasos de la receta en audio',
  profileVoiceCommand: 'Comando "Ok Cheff"',
  profileFeatures: [
    'Ingredientes ilimitados en búsqueda',
    'Cuaderno digital ilimitado',
    'Modo Manos Libres con voz',
    'Comando "Ok Cheff"',
    'Todas las dietas y cocinas',
    'Acceso offline completo',
  ],

  premiumFeature: 'Función Premium',
  premiumActivate: 'Activar',

  difficultyEasy: 'Fácil',
  difficultyMedium: 'Medio',
  difficultyHard: 'Difícil',

  occasionMothersDay: 'Día de la Madre',
  occasionRomanticDinner: 'Cena Romántica',
  occasionBirthday: 'Cumpleaños',
  occasionChristmas: 'Navidad',
  occasionEaster: 'Semana Santa',
  occasionBBQ: 'Barbacoa',
  occasionNewYear: 'Nochevieja',
  occasionFathersDay: 'Día del Padre',

  catProteins: '🥩 Proteínas',
  catProduce: '🥦 Frutas y Verduras',
  catGrains: '🌾 Granos y Pasta',
  catDairy: '🧀 Lácteos',
  catSpices: '🧂 Especias',
  catOther: '🛒 Otros',

  recipeIngredients: 'Ingredientes',
  recipeSteps: 'Preparación',
  recipeTime: 'Tiempo',
  recipeServings: 'Porciones',
  recipeDifficulty: 'Dificultad',
  recipeCalories: 'Calorías',
  recipeLockedTitle: 'Receta Premium',
  recipeLockedDesc: 'Esta receta completa solo está disponible para suscriptores Premium.',
  recipeDone: '🎉',
  recipeDoneMessage: '¡Receta completada! ¡Buen provecho!',
  recipeGourmet: 'Gourmet',

  deleteRecipe: 'Eliminar receta',
  deleteRecipeConfirm: '¿Deseas eliminar "{name}" de tu cuaderno?',
  cancel: 'Cancelar',
  remove: 'Eliminar',
  save: 'Guardar',
  upgrade: 'Actualizar',
  with: 'Con',
  portions: 'porciones',
  minutes: 'min',

  signOutTitle: 'Cerrar sesión',
  signOutMessage: '¿Realmente deseas cerrar sesión en OkCheff?',
  signOutConfirm: 'Salir',
  accountConnected: 'Cuenta conectada',
  signInTitle: 'Iniciar sesión / Crear cuenta',
  signInSubtitle: 'Sincroniza recetas y usa la IA real',
  statRecipes: 'Recetas\nGuardadas',
  statEvents: 'Mis\nEventos',
  statIngredients: 'Ingredientes\nGratis',
  profileSubscriptionPlan: 'Plan de Suscripción',
  profileLanguageTitle: 'Idioma',
  voiceFeatureActivation: 'Activación por voz "Ok Cheff"',
  voiceFeatureTTS: 'Text-to-Speech para recetas',
  voiceFeatureSTT: 'Speech-to-Text para preguntas',
};

const fr: Strings = {
  appName: 'OkCheff',
  appTagline: 'Votre chef personnel',

  tabDiscover: 'Découvrir',
  tabNotebook: 'Carnet',
  tabChat: 'Chef Chat',
  tabProfile: 'Profil',

  homeGreeting: 'Bonjour,',
  homeQuestionFridge: 'Que cuisinons-nous\naujourd\'hui?',
  homeQuestionInspiration: "Quelle est\nl'occasion spéciale?",
  homeFridgeTab: 'Dans le Frigo',
  homeInspirationTab: 'Inspiration',
  homeIngredients: 'Ingrédients disponibles',
  homeIngredientsSubtitleFree: "Jusqu'à 3 ingrédients avec le plan gratuit",
  homeIngredientsSubtitlePremium: "Ajoutez autant d'ingrédients que vous voulez",
  homeIngredientPlaceholder: 'Ex: poulet, tomate, ail...',
  homeLimitFree: "Limite du plan gratuit atteinte. Passez à Premium pour en ajouter plus!",
  homeGenerateButton: 'Générer des Recettes',
  homeGenerateAll: 'Voir Toutes les Recettes',
  homeGenerating: 'Génération de recettes...',
  homeRecipesFound: 'recettes trouvées',
  homeNoRecipes: 'Aucune recette trouvée',
  homeVibeOccasion: 'Vibe / Occasion Spéciale',
  homeVibeSubtitle: "Sélectionnez la date et OkCheff crée le menu parfait pour vous",
  homeSuggestMenu: 'Suggérer un Menu Exclusif',
  homeSuggestMenuSelect: 'Sélectionnez une occasion',
  homeSuggestMenuLoading: 'OkCheff prépare votre menu exclusif...',
  homeGourmetMenu: 'Menu Gastronomique',
  homeNoSuggestions: 'Aucune suggestion disponible',
  homeShoppingIncluded: '🛒 Liste de courses incluse · Recettes élaborées pour impressionner',
  homeDietFilter: 'Régime',
  homeRecipeTypeFilter: 'Type de recette',

  shoppingListTitle: 'Liste de Courses',
  shoppingListAllDone: 'Tout acheté! Prêt à cuisiner.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Voir',
  shoppingListToggleHide: 'Masquer',
  shoppingListItems: 'articles',

  startCooking: 'Commencer la Préparation avec OkCheff',
  startCookingCheck: 'Vérifiez la liste de courses en premier',

  notebookTitle: 'Mon Carnet',
  notebookSaved: 'recette sauvegardée',
  notebookSavedPlural: 'recettes sauvegardées',
  notebookLimit: 'Limite: 5',
  notebookEvents: 'événements sauvegardés',
  notebookEventSaved: 'événement sauvegardé',
  notebookEventSavedPlural: 'événements sauvegardés',
  notebookTabRecipes: 'Recettes',
  notebookTabEvents: 'Mes Événements',
  notebookEmpty: 'Carnet vide',
  notebookNoEvents: 'Aucun événement sauvegardé',
  notebookEmptyDesc: 'Sauvegardez vos recettes préférées et accédez-y hors ligne.',
  notebookNoEventsDesc: "Créez des menus spéciaux dans l'onglet Inspiration et sauvegardez-les ici.",
  notebookDiscover: 'Découvrir des Recettes',
  notebookCreateMenu: 'Créer un Menu Spécial',
  notebookLimitBanner: 'Carnet plein! Passez à Premium pour sauvegarder des recettes illimitées.',
  notebookShoppingList: 'Liste de Courses',

  chatName: 'OkCheff',
  chatStatus: 'Assistant culinaire • En ligne',
  chatInputPlaceholder: 'Posez une question à OkCheff...',
  chatVoiceFeature: "Mode mains libres avec commande 'Ok Cheff' et voix bidirectionnelle",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Activer Ok Cheff',
  voiceListening: "J'écoute...",
  voiceEnergyLabel: 'Énergie du Chef',
  voiceEnergyFull: 'Énergie maximale',
  voiceEnergyLow: 'Énergie faible',
  voiceReadSteps: 'Écouter les étapes avec OkCheff',

  profileTitle: 'Profil',
  profilePlanFree: 'Plan Gratuit',
  profilePlanPremium: 'Plan Premium',
  profilePremiumActive: 'Premium Actif',
  profileActivatePremium: 'Activer Premium',
  profilePremiumDesc: 'Ingrédients illimités, voix, tous les régimes',
  profileDiet: 'Régime',
  profilePreferences: 'Préférences Culinaires',
  profileVoiceMode: 'Mode Mains Libres',
  profileVoiceDesc: "Activez par la voix, écoutez les étapes de la recette en audio",
  profileVoiceCommand: 'Commande "Ok Cheff"',
  profileFeatures: [
    'Ingrédients illimités dans la recherche',
    'Carnet numérique illimité',
    'Mode Mains Libres avec voix',
    'Commande "Ok Cheff"',
    'Tous les régimes et cuisines',
    'Accès hors ligne complet',
  ],

  premiumFeature: 'Fonctionnalité Premium',
  premiumActivate: 'Activer',

  difficultyEasy: 'Facile',
  difficultyMedium: 'Moyen',
  difficultyHard: 'Difficile',

  occasionMothersDay: 'Fête des Mères',
  occasionRomanticDinner: 'Dîner Romantique',
  occasionBirthday: 'Anniversaire',
  occasionChristmas: 'Noël',
  occasionEaster: 'Pâques',
  occasionBBQ: 'Barbecue',
  occasionNewYear: 'Réveillon',
  occasionFathersDay: 'Fête des Pères',

  catProteins: '🥩 Protéines',
  catProduce: '🥦 Fruits et Légumes',
  catGrains: '🌾 Céréales et Pâtes',
  catDairy: '🧀 Produits Laitiers',
  catSpices: '🧂 Épices',
  catOther: '🛒 Autres',

  recipeIngredients: 'Ingrédients',
  recipeSteps: 'Préparation',
  recipeTime: 'Temps',
  recipeServings: 'Portions',
  recipeDifficulty: 'Difficulté',
  recipeCalories: 'Calories',
  recipeLockedTitle: 'Recette Premium',
  recipeLockedDesc: 'Cette recette complète est uniquement disponible pour les abonnés Premium.',
  recipeDone: '🎉',
  recipeDoneMessage: 'Recette terminée! Bon appétit!',
  recipeGourmet: 'Gastronomique',

  deleteRecipe: 'Supprimer la recette',
  deleteRecipeConfirm: 'Voulez-vous supprimer "{name}" de votre carnet?',
  cancel: 'Annuler',
  remove: 'Supprimer',
  save: 'Sauvegarder',
  upgrade: 'Mettre à niveau',
  with: 'Avec',
  portions: 'portions',
  minutes: 'min',

  signOutTitle: 'Se déconnecter',
  signOutMessage: 'Voulez-vous vraiment vous déconnecter de OkCheff?',
  signOutConfirm: 'Déconnexion',
  accountConnected: 'Compte connecté',
  signInTitle: 'Se connecter / Créer un compte',
  signInSubtitle: 'Synchronisez vos recettes et utilisez la vraie IA',
  statRecipes: 'Recettes\nSauvegardées',
  statEvents: 'Mes\nÉvénements',
  statIngredients: 'Ingrédients\nGratuits',
  profileSubscriptionPlan: 'Plan d\'Abonnement',
  profileLanguageTitle: 'Langue',
  voiceFeatureActivation: 'Activation vocale "Ok Cheff"',
  voiceFeatureTTS: 'Synthèse vocale pour les recettes',
  voiceFeatureSTT: 'Reconnaissance vocale pour les questions',
};

const it: Strings = {
  appName: 'OkCheff',
  appTagline: 'Il tuo chef personale',

  tabDiscover: 'Scopri',
  tabNotebook: 'Quaderno',
  tabChat: 'Chef Chat',
  tabProfile: 'Profilo',

  homeGreeting: 'Ciao,',
  homeQuestionFridge: 'Cosa cuciniamo\noggi?',
  homeQuestionInspiration: "Qual è\nl'occasione speciale?",
  homeFridgeTab: 'In Frigo',
  homeInspirationTab: 'Ispirazione',
  homeIngredients: 'Ingredienti disponibili',
  homeIngredientsSubtitleFree: 'Fino a 3 ingredienti con il piano gratuito',
  homeIngredientsSubtitlePremium: 'Aggiungi quanti ingredienti vuoi',
  homeIngredientPlaceholder: 'Es: pollo, pomodoro, aglio...',
  homeLimitFree: 'Limite del piano gratuito raggiunto. Aggiorna per aggiungerne altri!',
  homeGenerateButton: 'Genera Ricette',
  homeGenerateAll: 'Vedi Tutte le Ricette',
  homeGenerating: 'Generazione ricette...',
  homeRecipesFound: 'ricette trovate',
  homeNoRecipes: 'Nessuna ricetta trovata',
  homeVibeOccasion: 'Vibe / Occasione Speciale',
  homeVibeSubtitle: 'Seleziona la data e OkCheff crea il menu perfetto per te',
  homeSuggestMenu: 'Suggerisci Menu Esclusivo',
  homeSuggestMenuSelect: "Seleziona un'occasione",
  homeSuggestMenuLoading: 'OkCheff sta preparando il menu esclusivo...',
  homeGourmetMenu: 'Menu Gourmet',
  homeNoSuggestions: 'Nessun suggerimento disponibile',
  homeShoppingIncluded: '🛒 Lista della spesa inclusa · Ricette elaborate per impressionare',
  homeDietFilter: 'Dieta',
  homeRecipeTypeFilter: 'Tipo di ricetta',

  shoppingListTitle: 'Lista della Spesa',
  shoppingListAllDone: 'Tutto acquistato! Pronto a cucinare.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Mostra',
  shoppingListToggleHide: 'Nascondi',
  shoppingListItems: 'articoli',

  startCooking: 'Inizia la Preparazione con OkCheff',
  startCookingCheck: 'Controlla prima la lista della spesa',

  notebookTitle: 'Il Mio Quaderno',
  notebookSaved: 'ricetta salvata',
  notebookSavedPlural: 'ricette salvate',
  notebookLimit: 'Limite: 5',
  notebookEvents: 'eventi salvati',
  notebookEventSaved: 'evento salvato',
  notebookEventSavedPlural: 'eventi salvati',
  notebookTabRecipes: 'Ricette',
  notebookTabEvents: 'I Miei Eventi',
  notebookEmpty: 'Quaderno vuoto',
  notebookNoEvents: 'Nessun evento salvato',
  notebookEmptyDesc: 'Salva le tue ricette preferite e accedici offline in qualsiasi momento.',
  notebookNoEventsDesc: "Crea menu speciali nella scheda Ispirazione e salvali qui.",
  notebookDiscover: 'Scopri Ricette',
  notebookCreateMenu: 'Crea Menu Speciale',
  notebookLimitBanner: 'Quaderno pieno! Aggiorna a Premium per salvare ricette illimitate.',
  notebookShoppingList: 'Lista della Spesa',

  chatName: 'OkCheff',
  chatStatus: 'Assistente culinario • Online',
  chatInputPlaceholder: 'Chiedi a OkCheff...',
  chatVoiceFeature: "Modalità mani libere con comando 'Ok Cheff' e voce bidirezionale",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Attiva Ok Cheff',
  voiceListening: 'In ascolto...',
  voiceEnergyLabel: 'Energia dello Chef',
  voiceEnergyFull: 'Energia massima',
  voiceEnergyLow: 'Energia bassa',
  voiceReadSteps: 'Ascolta i passaggi con OkCheff',

  profileTitle: 'Profilo',
  profilePlanFree: 'Piano Gratuito',
  profilePlanPremium: 'Piano Premium',
  profilePremiumActive: 'Premium Attivo',
  profileActivatePremium: 'Attiva Premium',
  profilePremiumDesc: 'Ingredienti illimitati, voce, tutte le diete',
  profileDiet: 'Dieta',
  profilePreferences: 'Preferenze Culinarie',
  profileVoiceMode: 'Modalità Mani Libere',
  profileVoiceDesc: 'Attiva con la voce, ascolta i passaggi della ricetta in audio',
  profileVoiceCommand: 'Comando "Ok Cheff"',
  profileFeatures: [
    'Ingredienti illimitati nella ricerca',
    'Quaderno digitale illimitato',
    'Modalità Mani Libere con voce',
    'Comando "Ok Cheff"',
    'Tutte le diete e cucine',
    'Accesso offline completo',
  ],

  premiumFeature: 'Funzionalità Premium',
  premiumActivate: 'Attiva',

  difficultyEasy: 'Facile',
  difficultyMedium: 'Medio',
  difficultyHard: 'Difficile',

  occasionMothersDay: 'Festa della Mamma',
  occasionRomanticDinner: 'Cena Romantica',
  occasionBirthday: 'Compleanno',
  occasionChristmas: 'Natale',
  occasionEaster: 'Pasqua',
  occasionBBQ: 'Barbecue',
  occasionNewYear: 'Capodanno',
  occasionFathersDay: 'Festa del Papà',

  catProteins: '🥩 Proteine',
  catProduce: '🥦 Frutta e Verdura',
  catGrains: '🌾 Cereali e Pasta',
  catDairy: '🧀 Latticini',
  catSpices: '🧂 Spezie',
  catOther: '🛒 Altro',

  recipeIngredients: 'Ingredienti',
  recipeSteps: 'Preparazione',
  recipeTime: 'Tempo',
  recipeServings: 'Porzioni',
  recipeDifficulty: 'Difficoltà',
  recipeCalories: 'Calorie',
  recipeLockedTitle: 'Ricetta Premium',
  recipeLockedDesc: 'Questa ricetta completa è disponibile solo per gli abbonati Premium.',
  recipeDone: '🎉',
  recipeDoneMessage: 'Ricetta completata! Buon appetito!',
  recipeGourmet: 'Gourmet',

  deleteRecipe: 'Rimuovi ricetta',
  deleteRecipeConfirm: 'Vuoi rimuovere "{name}" dal tuo quaderno?',
  cancel: 'Annulla',
  remove: 'Rimuovi',
  save: 'Salva',
  upgrade: 'Aggiorna',
  with: 'Con',
  portions: 'porzioni',
  minutes: 'min',
};

const de: Strings = {
  appName: 'OkCheff',
  appTagline: 'Dein persönlicher Koch',

  tabDiscover: 'Entdecken',
  tabNotebook: 'Notizbuch',
  tabChat: 'Chef Chat',
  tabProfile: 'Profil',

  homeGreeting: 'Hallo,',
  homeQuestionFridge: 'Was kochen wir\nheute?',
  homeQuestionInspiration: 'Was ist der\nbsondere Anlass?',
  homeFridgeTab: 'Im Kühlschrank',
  homeInspirationTab: 'Inspiration',
  homeIngredients: 'Verfügbare Zutaten',
  homeIngredientsSubtitleFree: 'Bis zu 3 Zutaten im kostenlosen Plan',
  homeIngredientsSubtitlePremium: 'Füge so viele Zutaten hinzu wie du möchtest',
  homeIngredientPlaceholder: 'Z.B.: Hähnchen, Tomate, Knoblauch...',
  homeLimitFree: 'Limit des kostenlosen Plans erreicht. Upgrade für mehr!',
  homeGenerateButton: 'Rezepte Generieren',
  homeGenerateAll: 'Alle Rezepte Anzeigen',
  homeGenerating: 'Rezepte werden generiert...',
  homeRecipesFound: 'Rezepte gefunden',
  homeNoRecipes: 'Keine Rezepte gefunden',
  homeVibeOccasion: 'Vibe / Besonderer Anlass',
  homeVibeSubtitle: 'Wähle das Datum und OkCheff erstellt das perfekte Menü für dich',
  homeSuggestMenu: 'Exklusives Menü Vorschlagen',
  homeSuggestMenuSelect: 'Wähle einen Anlass',
  homeSuggestMenuLoading: 'OkCheff bereitet exklusives Menü vor...',
  homeGourmetMenu: 'Gourmet-Menü',
  homeNoSuggestions: 'Keine Vorschläge verfügbar',
  homeShoppingIncluded: '🛒 Einkaufsliste inklusive · Aufwendige Rezepte zum Beeindrucken',
  homeDietFilter: 'Ernährung',
  homeRecipeTypeFilter: 'Rezepttyp',

  shoppingListTitle: 'Einkaufsliste',
  shoppingListAllDone: 'Alles gekauft! Bereit zum Kochen.',
  shoppingListReadyToCook: '🛒',
  shoppingListToggleShow: 'Anzeigen',
  shoppingListToggleHide: 'Ausblenden',
  shoppingListItems: 'Artikel',

  startCooking: 'Zubereitung mit OkCheff Starten',
  startCookingCheck: 'Überprüfe zuerst die Einkaufsliste',

  notebookTitle: 'Mein Notizbuch',
  notebookSaved: 'Rezept gespeichert',
  notebookSavedPlural: 'Rezepte gespeichert',
  notebookLimit: 'Limit: 5',
  notebookEvents: 'Ereignisse gespeichert',
  notebookEventSaved: 'Ereignis gespeichert',
  notebookEventSavedPlural: 'Ereignisse gespeichert',
  notebookTabRecipes: 'Rezepte',
  notebookTabEvents: 'Meine Ereignisse',
  notebookEmpty: 'Notizbuch leer',
  notebookNoEvents: 'Keine Ereignisse gespeichert',
  notebookEmptyDesc: 'Speichere deine Lieblingsrezepte und greife jederzeit offline darauf zu.',
  notebookNoEventsDesc: 'Erstelle spezielle Menüs im Inspirations-Tab und speichere sie hier.',
  notebookDiscover: 'Rezepte Entdecken',
  notebookCreateMenu: 'Spezielles Menü Erstellen',
  notebookLimitBanner: 'Notizbuch voll! Upgrade auf Premium für unbegrenzte Rezepte.',
  notebookShoppingList: 'Einkaufsliste',

  chatName: 'OkCheff',
  chatStatus: 'Kulinarischer Assistent • Online',
  chatInputPlaceholder: 'Frage OkCheff...',
  chatVoiceFeature: "Freisprechmodus mit 'Ok Cheff' Befehl und bidirektionaler Sprache",

  voiceWakeWord: 'Ok Cheff',
  voiceActivate: 'Ok Cheff Aktivieren',
  voiceListening: 'Höre zu...',
  voiceEnergyLabel: 'Chef-Energie',
  voiceEnergyFull: 'Maximale Energie',
  voiceEnergyLow: 'Niedrige Energie',
  voiceReadSteps: 'Schritte mit OkCheff anhören',

  profileTitle: 'Profil',
  profilePlanFree: 'Kostenloser Plan',
  profilePlanPremium: 'Premium-Plan',
  profilePremiumActive: 'Premium Aktiv',
  profileActivatePremium: 'Premium Aktivieren',
  profilePremiumDesc: 'Unbegrenzte Zutaten, Stimme, alle Ernährungsformen',
  profileDiet: 'Ernährung',
  profilePreferences: 'Kulinarische Präferenzen',
  profileVoiceMode: 'Freisprechmodus',
  profileVoiceDesc: 'Per Stimme aktivieren, Rezeptschritte im Audio anhören',
  profileVoiceCommand: 'Befehl "Ok Cheff"',
  profileFeatures: [
    'Unbegrenzte Zutaten bei der Suche',
    'Unbegrenztes digitales Notizbuch',
    'Freisprechmodus mit Stimme',
    'Befehl "Ok Cheff"',
    'Alle Ernährungsformen und Küchen',
    'Voller Offline-Zugang',
  ],

  premiumFeature: 'Premium-Funktion',
  premiumActivate: 'Aktivieren',

  difficultyEasy: 'Einfach',
  difficultyMedium: 'Mittel',
  difficultyHard: 'Schwer',

  occasionMothersDay: 'Muttertag',
  occasionRomanticDinner: 'Romantisches Dinner',
  occasionBirthday: 'Geburtstag',
  occasionChristmas: 'Weihnachten',
  occasionEaster: 'Ostern',
  occasionBBQ: 'Barbecue',
  occasionNewYear: 'Silvester',
  occasionFathersDay: 'Vatertag',

  catProteins: '🥩 Proteine',
  catProduce: '🥦 Obst und Gemüse',
  catGrains: '🌾 Getreide und Nudeln',
  catDairy: '🧀 Milchprodukte',
  catSpices: '🧂 Gewürze',
  catOther: '🛒 Sonstiges',

  recipeIngredients: 'Zutaten',
  recipeSteps: 'Zubereitung',
  recipeTime: 'Zeit',
  recipeServings: 'Portionen',
  recipeDifficulty: 'Schwierigkeit',
  recipeCalories: 'Kalorien',
  recipeLockedTitle: 'Premium-Rezept',
  recipeLockedDesc: 'Dieses vollständige Rezept ist nur für Premium-Abonnenten verfügbar.',
  recipeDone: '🎉',
  recipeDoneMessage: 'Rezept abgeschlossen! Guten Appetit!',
  recipeGourmet: 'Gourmet',

  deleteRecipe: 'Rezept entfernen',
  deleteRecipeConfirm: 'Möchtest du "{name}" aus deinem Notizbuch entfernen?',
  cancel: 'Abbrechen',
  remove: 'Entfernen',
  save: 'Speichern',
  upgrade: 'Upgraden',
  with: 'Mit',
  portions: 'Portionen',
  minutes: 'Min',
};

const translations: Record<Language, Strings> = { pt, en, es, fr, it, de };

// Default language
let currentLanguage: Language = 'pt';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(): Strings {
  return translations[currentLanguage];
}

export function useStrings(): Strings {
  return translations[currentLanguage];
}

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string; flag: string }> = [
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  // Italiano e Alemão ocultos por enquanto — fora do foco de mercado do lançamento (PRD V4)
  // { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  // { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
];
