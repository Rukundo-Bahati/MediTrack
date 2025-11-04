import { Package, Scan, Shield } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

interface MediTrackLoaderProps {
  size?: number;
  showText?: boolean;
}

export default function MediTrackLoader({ 
  size = 120, 
  showText = true 
}: MediTrackLoaderProps) {
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const iconRotation = useSharedValue(0);
  const iconOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Main rotation animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1
    );

    // Pulsing scale animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 800, easing: Easing.in(Easing.quad) })
      ),
      -1
    );

    // Icon rotation (counter to main rotation for visual effect)
    iconRotation.value = withRepeat(
      withTiming(-180, {
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Icon opacity animation
    iconOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );

    // Text fade in
    if (showText) {
      textOpacity.value = withDelay(
        500,
        withTiming(1, { duration: 800 })
      );
    }
  }, []);

  // Animated styles
  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: pulseScale.value }
    ],
  }));

  const innerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-rotation.value * 0.7}deg` },
      { scale: scale.value }
    ],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${iconRotation.value}deg` }
    ],
    opacity: iconOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const centerIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulseScale.value, [1, 1.1], [1, 0.9]) }
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.loaderContainer, { width: size, height: size }]}>
        {/* Outer rotating ring */}
        <Animated.View 
          style={[
            styles.outerRing, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              borderColor: Colors.primary + '40'
            }, 
            outerRingStyle
          ]}
        >
          {/* Gradient effect dots */}
          <View style={[styles.dot, styles.dot1, { backgroundColor: Colors.primary }]} />
          <View style={[styles.dot, styles.dot2, { backgroundColor: Colors.accent }]} />
          <View style={[styles.dot, styles.dot3, { backgroundColor: Colors.warning }]} />
        </Animated.View>

        {/* Inner rotating ring */}
        <Animated.View 
          style={[
            styles.innerRing, 
            { 
              width: size * 0.7, 
              height: size * 0.7, 
              borderRadius: (size * 0.7) / 2,
              borderColor: Colors.accent + '60'
            }, 
            innerRingStyle
          ]}
        >
          {/* Inner dots */}
          <View style={[styles.innerDot, styles.innerDot1, { backgroundColor: Colors.accent }]} />
          <View style={[styles.innerDot, styles.innerDot2, { backgroundColor: Colors.primary }]} />
        </Animated.View>

        {/* Center icon container */}
        <Animated.View style={[styles.centerIcon, centerIconStyle]}>
          <Animated.View 
            entering={ZoomIn.delay(300).springify()}
            style={[styles.iconBackground, { backgroundColor: Colors.primary + '20' }]}
          >
            <Animated.View style={iconContainerStyle}>
              <Shield size={size * 0.25} color={Colors.primary} strokeWidth={2.5} />
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* Floating icons */}
        <Animated.View 
          entering={FadeIn.delay(800)}
          style={[styles.floatingIcon, styles.floatingIcon1]}
        >
          <Package size={16} color={Colors.accent} />
        </Animated.View>
        
        <Animated.View 
          entering={FadeIn.delay(1000)}
          style={[styles.floatingIcon, styles.floatingIcon2]}
        >
          <Scan size={14} color={Colors.warning} />
        </Animated.View>
      </View>

      {/* Loading text */}
      {showText && (
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Animated.Text 
            entering={FadeIn.delay(600)}
            style={[styles.loadingText, { color: Colors.primary }]}
          >
            MediTrack
          </Animated.Text>
          <Animated.Text 
            entering={FadeIn.delay(800)}
            style={[styles.subText, { color: Colors.textSecondary }]}
          >
            Securing Medicine Supply Chain
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dot1: {
    top: -4,
    left: '50%',
    marginLeft: -4,
  },
  dot2: {
    right: -4,
    top: '50%',
    marginTop: -4,
  },
  dot3: {
    bottom: -4,
    left: '50%',
    marginLeft: -4,
  },
  innerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  innerDot1: {
    top: -3,
    right: '25%',
  },
  innerDot2: {
    bottom: -3,
    left: '25%',
  },
  centerIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  floatingIcon: {
    position: 'absolute',
  },
  floatingIcon1: {
    top: 10,
    right: 15,
  },
  floatingIcon2: {
    bottom: 15,
    left: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});