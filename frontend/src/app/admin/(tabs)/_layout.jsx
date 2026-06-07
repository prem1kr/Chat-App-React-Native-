import React, { useEffect, useRef } from "react";
import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const tabs = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    name: "users",
    label: "Users",
    icon: "people-outline",
    activeIcon: "people",
  },
  {
    name: "chat",
    label: "Chats",
    icon: "chatbubble-outline",
    activeIcon: "people",
  },
  {
    name: "group",
    label: "Group",
    icon: "chatbubbles-outline",
    activeIcon: "chatbubbles",
  },
  {
    name: "settings",
    label: "Settings",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];
function TabItem({ tab, focused, navigation }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1.1 : 1, friction: 5, tension: 100, useNativeDriver: true, }).start();
  }, [focused]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(tab.name)}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {focused ? (
          <LinearGradient colors={["#4facfe", "#7b5cff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.activeTab}  >
            <Ionicons name={tab.activeIcon} size={20} color="#fff" />
            <Text style={styles.activeText}>{tab.label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.inactiveTab}>
            <Ionicons name={tab.icon} size={22} color="#64748b" />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TabItem key={tab.name} tab={tab} focused={state.index === index} navigation={navigation} />))}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => (<CustomTabBar {...props} />)} >
      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />
      <Tabs.Screen name="users" options={{ title: "users" }} />
      <Tabs.Screen name="chat" options={{ title: "Chats" }} />
      <Tabs.Screen name="group" options={{ title: "Group" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#c7fddf",
    borderRadius: 30,
    padding: 6,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden'
  },
  activeTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },

  inactiveTab: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  activeText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 13,
  },

  inactiveText: {
    color: "#777",
    marginLeft: 6,
    fontSize: 13,
  },
});