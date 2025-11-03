# MediTrack Loading Components

Beautiful, unique loading spinners designed specifically for the MediTrack app with medical theme elements.

## Components Overview

### 1. **MediTrackLoader** - Full Screen Loader
The main loading screen with comprehensive branding and animations.

**Features:**
- Dual rotating rings with medical-themed dots
- Animated Shield icon in center (represents security/verification)
- Floating Package and Scan icons
- Pulsing and scaling animations
- MediTrack branding text
- Orange theme colors

**Usage:**
```tsx
import MediTrackLoader from './components/MediTrackLoader';

// Full screen with text
<MediTrackLoader />

// Custom size without text
<MediTrackLoader size={80} showText={false} />
```

### 2. **InlineLoader** - Compact Loader
Smaller loader for inline use in buttons, cards, etc.

**Features:**
- Rotating dashed ring
- Animated Shield icon
- Pulsing and opacity effects
- Customizable size and color

**Usage:**
```tsx
import InlineLoader from './components/InlineLoader';

// Default orange
<InlineLoader />

// Custom size and color
<InlineLoader size={24} color={Colors.accent} />
```

### 3. **LoadingAnimation** - Legacy Wrapper
Wrapper around InlineLoader for backward compatibility.

**Usage:**
```tsx
import LoadingAnimation from './components/LoadingAnimation';

<LoadingAnimation size={32} color={Colors.primary} />
```

## Implementation Details

### App Layout Integration
The main loader is integrated into `app/_layout.tsx` and shows during authentication loading:

```tsx
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <MediTrackLoader />;
  }

  return (
    // App content...
  );
}
```

### Loading Hook
Use the `useLoading` hook for managing loading states:

```tsx
import { useLoading } from './hooks/useLoading';

function MyComponent() {
  const { loading, withLoading } = useLoading();

  const handleAction = async () => {
    await withLoading(async () => {
      // Your async operation
      await someApiCall();
    });
  };

  return (
    <View>
      {loading ? (
        <InlineLoader />
      ) : (
        <Button onPress={handleAction}>Action</Button>
      )}
    </View>
  );
}
```

## Design Philosophy

### Medical Theme Elements
- **Shield Icon**: Represents security, verification, and trust
- **Package Icon**: Represents medicine/batch tracking
- **Scan Icon**: Represents QR code scanning functionality
- **Rotating Rings**: Represent continuous monitoring and protection

### Animation Principles
- **Smooth Rotations**: Convey ongoing processes
- **Pulsing Effects**: Draw attention and show activity
- **Staggered Timing**: Create visual interest and professionalism
- **Orange Theme**: Consistent with app branding

### Performance Optimizations
- **React Native Reanimated**: All animations run on UI thread (60fps)
- **Shared Values**: Efficient animation state management
- **Conditional Rendering**: Only render when needed
- **Optimized Timing**: Balanced between smooth and performant

## Customization Options

### MediTrackLoader Props
```tsx
interface MediTrackLoaderProps {
  size?: number;        // Default: 120
  showText?: boolean;   // Default: true
}
```

### InlineLoader Props
```tsx
interface InlineLoaderProps {
  size?: number;        // Default: 40
  color?: string;       // Default: Colors.primary
}
```

## Usage Examples

### 1. Button Loading State
```tsx
<TouchableOpacity 
  style={styles.button}
  disabled={loading}
>
  {loading ? (
    <InlineLoader size={20} color={Colors.white} />
  ) : (
    <Text>Submit</Text>
  )}
</TouchableOpacity>
```

### 2. Card Loading State
```tsx
<View style={styles.card}>
  {loading ? (
    <View style={styles.loadingContainer}>
      <InlineLoader size={32} />
      <Text>Loading batch data...</Text>
    </View>
  ) : (
    <BatchContent />
  )}
</View>
```

### 3. Screen Loading State
```tsx
function BatchScreen() {
  const { loading } = useLoading();

  if (loading) {
    return (
      <View style={styles.fullScreen}>
        <MediTrackLoader size={100} />
      </View>
    );
  }

  return <BatchContent />;
}
```

## Technical Details

### Animation Specifications
- **Main Rotation**: 3000ms linear rotation
- **Pulse Scale**: 800ms ease-in-out (1.0 → 1.1 → 1.0)
- **Icon Rotation**: 2000ms counter-rotation
- **Opacity Fade**: 1000ms fade (1.0 → 0.3 → 1.0)

### Color Usage
- **Primary Ring**: `Colors.primary + '40'` (40% opacity)
- **Secondary Ring**: `Colors.accent + '60'` (60% opacity)
- **Dots**: `Colors.primary`, `Colors.accent`, `Colors.warning`
- **Center Icon**: `Colors.primary`

### File Structure
```
app/
├── components/
│   ├── MediTrackLoader.tsx    # Full screen loader
│   ├── InlineLoader.tsx       # Compact loader
│   └── LoadingAnimation.tsx   # Legacy wrapper
├── hooks/
│   └── useLoading.ts          # Loading state hook
└── _layout.tsx                # Integration point
```

## Best Practices

1. **Use MediTrackLoader** for app initialization and major transitions
2. **Use InlineLoader** for buttons, cards, and small components
3. **Always provide loading feedback** for operations > 200ms
4. **Match loader color** to the component's theme
5. **Consider accessibility** - provide loading announcements for screen readers
6. **Test on slower devices** to ensure smooth animations

## 🎉 Features Summary

- ✅ **Beautiful Design**: Medical-themed with orange branding
- ✅ **Smooth Animations**: 60fps performance with Reanimated
- ✅ **Flexible Usage**: Full screen and inline variants
- ✅ **Easy Integration**: Drop-in components with simple props
- ✅ **Consistent Theming**: Matches app's orange color scheme
- ✅ **Professional Feel**: Enhances perceived app quality
- ✅ **Loading Hook**: Simplified state management
- ✅ **TypeScript Support**: Full type safety

---

**The loading components create a premium, professional feel that reinforces MediTrack's commitment to quality and security! 🏥✨**