import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Layout } from "../style/theme";
import config from '../config';

const AuthScreen = ({ navigation, setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async () => {
        const url = isLogin ? `${config.API_URL}/login` : `${config.API_URL}/register`;

        const formData = new FormData();
        formData.append("login", username);
        formData.append("password", password);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    await AsyncStorage.setItem("user_id", data.user_id.toString());
                    setIsAuthenticated(true);
                } else {
                    Alert.alert("Успех", "Регистрация завершена. Теперь войдите.");
                    setIsLogin(true);
                }
            } else {
                Alert.alert("Ошибка", data.error || "Что-то пошло не так");
            }
        } catch (error) {
            Alert.alert("Ошибка", "Ошибка сети");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Вход" : "Регистрация"}</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Логин" 
                placeholderTextColor={Colors.secondary}
                value={username} 
                onChangeText={setUsername}
                color={Colors.text}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Пароль" 
                placeholderTextColor={Colors.secondary}
                secureTextEntry 
                value={password} 
                onChangeText={setPassword}
                color={Colors.text}
            />
            
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isLogin ? "Войти" : "Зарегистрироваться"}</Text>
            </TouchableOpacity>

            <Text style={styles.switchText} onPress={() => setIsLogin(!isLogin)}>
                {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        padding: Layout.spacing,
        backgroundColor: Colors.background,
    },
    title: { 
        fontSize: 24, 
        textAlign: "center", 
        marginBottom: Layout.spacing,
        color: Colors.primary,
    },
    input: { 
        borderWidth: 1, 
        marginBottom: 10, 
        padding: 10, 
        borderRadius: Layout.borderRadius,
        borderColor: Colors.secondary,
        backgroundColor: Colors.white,
        color: Colors.text,
        ...Platform.select({
            android: {
                textAlignVertical: 'center',
            },
        }),
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: Layout.borderRadius,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    switchText: { 
        textAlign: "center", 
        marginTop: 10, 
        color: Colors.primary 
    }
});

export default AuthScreen;