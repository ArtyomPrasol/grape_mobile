import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDrawer } from "./navigation/drawer";
import AuthScreen from "./screen/AuthScreen";

const Stack = createStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userId = await AsyncStorage.getItem("user_id"); // Проверяем наличие user_id
                setIsAuthenticated(!!userId);
            } catch (error) {
                console.error("Ошибка при проверке аутентификации", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="App">
                    {() => <MyDrawer setIsAuthenticated={setIsAuthenticated} />}
                  </Stack.Screen>
                ) : (
                    <Stack.Screen name="Auth">
                    {() => <AuthScreen setIsAuthenticated={setIsAuthenticated} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}