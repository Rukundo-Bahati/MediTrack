import { Shield } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface InlineLoaderProps {
  size?: number;
  color?: string;
}

export default function InlineLoader({ 
  size = 40, 
  color = Colors.primary 
}: InlineLoaderProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1
    );

    // Pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 600, easing: Easing.in(Easing.quad) })
      ),
      -1
    );

    // Opacity animation
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 750 }),
        withTiming(1, { duration: 750 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-rotation.value * 0.5}deg` }
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring */}
      <Animated.View 
        style={[
          styles.ring, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderColor: color + '40'
          }, 
          ringStyle
        ]}
      />
      
      {/* Center icon */}
      <Animated.View style={[styles.centerIcon, animatedStyle]}>
        <Shield size={size * 0.4} color={color} strokeWidth={2} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  centerIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});