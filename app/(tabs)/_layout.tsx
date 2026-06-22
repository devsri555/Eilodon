import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dimensions } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  const screenWidth = Dimensions.get('window').width;
  const TAB_WIDTH = 280;


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarInactiveTintColor: '#000000',
        
        tabBarStyle: {
          position: 'absolute',
          //bottom: 20,
          //width: 250,
          height: 90,
          //alignSelf: 'center',
          //left: '50%',
          //marginLeft: -125 ,
          //right: 60,
          borderRadius: 35,

          backgroundColor: "rgba(15, 92, 32, 0.40)",

          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          paddingVertical: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}


