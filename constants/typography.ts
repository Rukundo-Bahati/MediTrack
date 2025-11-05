import { TextStyle } from 'react-native';
import { Colors } from './colors';

// Modern typography system that avoids AI-typical patterns
export const Typography = {
  // Headlines - asymmetric sizing for natural feel
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: Colors.text,
  } as TextStyle,
  
  h2: {
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: Colors.text,
  } as TextStyle,
  
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: Colors.text,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
    color: Colors.text,
  } as TextStyle,
  
  // Body text - optimized for readability
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text,
  } as TextStyle,
  
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text,
  } as TextStyle,
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // Labels and captions
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
    color: Colors.text,
  } as TextStyle,
  
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.3,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // Interactive elements
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
  } as TextStyle,
};