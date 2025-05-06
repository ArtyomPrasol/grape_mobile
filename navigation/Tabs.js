import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screen/HomeScreen';
import CameraScreen from '../screen/CameraScreen';
import { Colors } from '../style/theme';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: "#ddd",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Camera") {
            iconName = focused ? "camera" : "camera-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={focused ? 32 : size}
              color={color}
              
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: Colors.primary,
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 100,
    borderColor: Colors.primary,
  },
});

export default HomeTabs;
