/**
 * Leap IT CRM - Sistema de Design
 * Cores Corporativas: Azul #004066 e Verde #80a327
 */

import React from 'react';

// ==========================================
// CORES DA MARCA LEAP IT
// ==========================================
export const leapITColors = {
  primary: {
    blue: '#004066',
    blueLight: '#0066A3',
    blueDark: '#002F4D',
  },
  secondary: {
    green: '#80a327',
    greenLight: '#9ABC3F',
    greenDark: '#688520',
  },
  accent: {
    blue50: '#E6F0F7',
    blue100: '#CCE1EF',
    blue200: '#99C3DF',
    blue300: '#66A5CF',
    blue400: '#3387BF',
    blue500: '#0066A3',
    blue600: '#004066',
    blue700: '#003052',
    blue800: '#00203D',
    blue900: '#001029',
    
    green50: '#F5F8E8',
    green100: '#EBF1D1',
    green200: '#D7E3A3',
    green300: '#C3D575',
    green400: '#AFC747',
    green500: '#9ABC3F',
    green600: '#80a327',
    green700: '#688520',
    green800: '#506618',
    green900: '#384810',
  },
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

// ==========================================
// ASSETS - LOGOS LEAP IT
// ==========================================
export const leapITAssets = {
  logo: {
    full: '/logo-leap-it.svg',
    icon: '/logo-leap-it-icon.svg',
    white: '/logo-leap-it-white.svg',
  },
};

// ==========================================
// THEME CONFIGURATION
// ==========================================
export const leapITTheme = {
  colors: leapITColors,
  assets: leapITAssets,
  
  // Espaçamento baseado em 4px
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  
  // Bordas arredondadas
  borderRadius: {
    none: '0',
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // Tipografia
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Fira Code", "Cascadia Code", Consolas, Monaco, monospace',
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

// ==========================================
// CSS VARIABLES (para uso global)
// ==========================================
export const leapITCSSVariables = `
  :root {
    /* Cores Primárias */
    --leap-blue: ${leapITColors.primary.blue};
    --leap-blue-light: ${leapITColors.primary.blueLight};
    --leap-blue-dark: ${leapITColors.primary.blueDark};
    
    --leap-green: ${leapITColors.secondary.green};
    --leap-green-light: ${leapITColors.secondary.greenLight};
    --leap-green-dark: ${leapITColors.secondary.greenDark};
    
    /* Status */
    --leap-success: ${leapITColors.status.success};
    --leap-warning: ${leapITColors.status.warning};
    --leap-error: ${leapITColors.status.error};
    --leap-info: ${leapITColors.status.info};
  }
`;

// ==========================================
// TAILWIND THEME EXTENSION
// ==========================================
export const leapITTailwindTheme = {
  extend: {
    colors: {
      'leap-blue': {
        DEFAULT: leapITColors.primary.blue,
        light: leapITColors.primary.blueLight,
        dark: leapITColors.primary.blueDark,
        50: leapITColors.accent.blue50,
        100: leapITColors.accent.blue100,
        200: leapITColors.accent.blue200,
        300: leapITColors.accent.blue300,
        400: leapITColors.accent.blue400,
        500: leapITColors.accent.blue500,
        600: leapITColors.accent.blue600,
        700: leapITColors.accent.blue700,
        800: leapITColors.accent.blue800,
        900: leapITColors.accent.blue900,
      },
      'leap-green': {
        DEFAULT: leapITColors.secondary.green,
        light: leapITColors.secondary.greenLight,
        dark: leapITColors.secondary.greenDark,
        50: leapITColors.accent.green50,
        100: leapITColors.accent.green100,
        200: leapITColors.accent.green200,
        300: leapITColors.accent.green300,
        400: leapITColors.accent.green400,
        500: leapITColors.accent.green500,
        600: leapITColors.accent.green600,
        700: leapITColors.accent.green700,
        800: leapITColors.accent.green800,
        900: leapITColors.accent.green900,
      },
    },
  },
};

// ==========================================
// COMPONENTE LOGO LEAP IT
// ==========================================
interface LeapITLogoProps {
  variant?: 'full' | 'icon' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LeapITLogo: React.FC<LeapITLogoProps> = ({ 
  variant = 'full', 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <img
      src={leapITAssets.logo[variant]}
      alt="Leap IT CRM"
      className={`${sizes[size]} w-auto ${className}`}
    />
  );
};

// ==========================================
// GUIA DE USO
// ==========================================

/**
 * EXEMPLOS DE USO:
 * 
 * 1. Importar cores:
 * import { leapITColors } from '@/lib/theme';
 * <div style={{ backgroundColor: leapITColors.primary.blue }}>...</div>
 * 
 * 2. Usar com Tailwind (após configurar tailwind.config.ts):
 * <button className="bg-leap-blue hover:bg-leap-blue-dark text-white">...</button>
 * <div className="border-leap-green-500">...</div>
 * 
 * 3. Componente Logo:
 * import { LeapITLogo } from '@/lib/theme';
 * <LeapITLogo variant="full" size="lg" />
 * <LeapITLogo variant="icon" size="sm" />
 * 
 * 4. CSS Variables (adicione ao main.css):
 * import { leapITCSSVariables } from '@/lib/theme';
 * // No seu main.css, adicione: ${leapITCSSVariables}
 * 
 * 5. Tailwind Config (tailwind.config.ts):
 * import { leapITTailwindTheme } from './src/lib/theme';
 * export default {
 *   theme: leapITTailwindTheme,
 *   ...
 * }
 */

export default leapITTheme;
