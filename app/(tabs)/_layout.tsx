import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Cog, MessagesSquare, Users } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[theme].background,
          borderTopColor: colorScheme === 'dark' ? '#303234' : '#E5E7EB',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Conversations',
          tabBarIcon: ({ color }) => (
            <MessagesSquare size={28} 
            color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='communities'
        options={{
          title: 'communautés',
          tabBarIcon: ({ color }) => (
            <Users size={28} color={color}/>
          ),
        }}
      />



      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color }) => 
            <Cog size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
