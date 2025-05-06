import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack, ProfileStack, StatsStack } from './Stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../style/theme';

const Drawer = createDrawerNavigator();

const LogoutButton = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("user_id");
    console.log('Выход')
};

  return (
    <TouchableOpacity onPress={handleLogout} style={{flexDirection: "row", alignItems: "left" }}>
      <Ionicons name="log-out" size={22} />
      <Text style={{ marginLeft: 10, fontSize: 16 }}>Выход</Text>
    </TouchableOpacity>
  );
};

export const MyDrawer = ({ setIsAuthenticated }) => {
  return (
    <Drawer.Navigator  screenOptions={{
      headerShown: false,
      drawerStyle: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 20,
      },
    }}
  >
      <Drawer.Screen name="Main" component={HomeStack} options={{
        title: 'Дом',
        drawerIcon: () => <Ionicons name='home' size={22} />
      }} />
      <Drawer.Screen name="Profiles" component={ProfileStack} options={{
        title: 'Профиль',
        drawerIcon: () => <Ionicons name="body" size={22} />
      }} />
      <Drawer.Screen name="Stat" component={StatsStack} options={{
        title: 'Статистика',
        drawerIcon: () => <Ionicons name="bar-chart" size={22} />
      }} />
      <Drawer.Screen 
        name="Logout" 
        component={View} // Пустой компонент, кнопка работает отдельно
        options={{
          drawerLabel: () => <LogoutButton setIsAuthenticated={setIsAuthenticated}/>,
        }}
      />
    </Drawer.Navigator>
  );
};