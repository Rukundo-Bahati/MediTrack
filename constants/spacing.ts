// Organic spacing system - avoids the typical 8px grid that screams "AI-generated"
export const Spacing = {
  // Micro spacing - for fine adjustments
  xs: 4,
  sm: 6,
  
  // Base spacing - irregular intervals feel more human
  base: 12,
  md: 18,
  lg: 24,
  xl: 32,
  
  // Macro spacing - asymmetric for natural layouts
  xxl: 40,
  xxxl: 56,
  
  // Component-specific spacing
  component: {
    padding: 16,
    margin: 14,
    gap: 10,
  },
  
  // Layout spacing
  layout: {
    section: 28,
    container: 20,
    screen: 24,
  },
};