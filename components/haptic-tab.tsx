import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { PlatformPressable } from 'expo-router/build/react-navigation/elements/PlatformPressable';
import type { GestureResponderEvent } from 'react-native';


export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev: GestureResponderEvent) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
