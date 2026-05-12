// OkCheff - Design System
// Paleta Gastronômica: Vermelho Tomate + Amarelo Ouro + Creme

export const Colors = {
  primary: '#C53030',
  primaryLight: '#E05353',
  primaryDark: '#9B2020',
  secondary: '#F6AD55',
  secondaryLight: '#FBC97A',
  accent: '#2C8A6E',
  accentLight: '#4DB896',

  background: '#FFF5E6',
  surface: '#FFF9F0',
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#F5E8D3',

  text: '#2C1810',
  textSecondary: '#6B4236',
  textSubtle: '#9E7060',
  textInverse: '#FFFFFF',

  border: '#E8D5C4',
  borderLight: '#F0E4D7',

  success: '#2C8A6E',
  error: '#D94444',
  warning: '#F6AD55',
  info: '#4A7FC8',

  premium: '#F6AD55',
  premiumLight: '#FBC97A',
  premiumDark: '#E08A20',

  overlay: 'rgba(44, 24, 16, 0.5)',
  overlayLight: 'rgba(44, 24, 16, 0.15)',
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    h2: 26,
    h1: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
