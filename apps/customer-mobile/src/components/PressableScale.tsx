import { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  /** How far to scale down on press. Default 0.97. */
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * A Pressable that springs down slightly when touched — the standard touch
 * feedback used across cards and buttons. Uses the native Animated driver so
 * it stays smooth without extra dependencies.
 */
export function PressableScale({
  activeScale = 0.97,
  style,
  children,
  onPressIn,
  onPressOut,
  ...props
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        animateTo(activeScale);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(1);
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
