import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';

const tabs = [
  { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'contacts', label: 'Contacts', icon: 'car-sport-outline', activeIcon: 'car-sport' },
  { name: 'settings', label: 'Settings', icon: 'person-outline', activeIcon: 'person' },
];

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const focused = state.index === index;

        const scale = useRef(new Animated.Value(1)).current;

        Animated.spring(scale, {
          toValue: focused ? 1.1 : 1,
          useNativeDriver: true,
        }).start();

        return (
          <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} activeOpacity={0.8}>
            <Animated.View style={{ transform: [{ scale }] }}>
              {focused ? (
                <LinearGradient colors={['#4facfe', '#7b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.activeTab}>
                  <Ionicons name={tab.activeIcon} size={18} color="#fff" />
                  <Text style={styles.activeText}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTab}>
                  <Ionicons name={tab.icon} size={18} color="#777" />
                  <Text style={styles.inactiveText}>{tab.label}</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />} >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="contacts" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#c7fddf',
    borderRadius: 30,
    padding: 6,
    elevation: 10,
  },

  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },

  inactiveTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  activeText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },

  inactiveText: {
    color: '#777',
    marginLeft: 6,
    fontSize: 13,
  },
});