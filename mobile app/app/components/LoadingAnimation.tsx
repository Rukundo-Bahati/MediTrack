import React from 'react';
import InlineLoader from './InlineLoader';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

export default function LoadingAnimation({ 
  size = 40, 
  color 
}: LoadingAnimationProps) {
  return <InlineLoader size={size} color={color} />;
}