import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Layout } from '../style/theme';
import config from '../config';

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState('');
  const [hasExperience, setHasExperience] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("user_id");
        if (!id) {
          console.error("Пользователь не аутентифицирован");
          Alert.alert("Ошибка", "Пользователь не аутентифицирован");
        } else {
          setUserId(id);
          console.log("ID пользователя:", id);
        }
      } catch (error) {
        console.error("Ошибка получения user_id:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchProfile = async () => {
      try {
        console.log("Запрос данных профиля для пользователя:", userId);
        const response = await fetch(`${config.API_URL}/user?id_user=${userId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные профиля');
        }
        const data = await response.json();
        console.log("Полученные данные профиля:", {
          first_name: data.first_name,
          last_name: data.last_name,
          login: data.login,
          experience_year: data.experience_year
        });
        
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setLogin(data.login || '');
        setExperience(data.experience_year || '');
        setHasExperience(!!data.experience_year);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        Alert.alert('Ошибка', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    if (password !== confirm) {
      console.log("Ошибка: пароли не совпадают");
      Alert.alert('Ошибка', 'Пароли не совпадают!');
      return;
    }

    if (experience && !/^\d+$/.test(experience)) {
      console.log("Ошибка: опыт должен быть целым числом");
      Alert.alert('Ошибка', 'Опыт должен быть целым числом!');
      return;
    }

    try {
      console.log("Отправка данных для обновления профиля:", {
        id_user: userId,
        first_name: firstName,
        last_name: lastName,
        experience_year: experience,
        password: password ? "****" : "не изменен"
      });

      const response = await fetch(`${config.API_URL}/update_user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: userId,
          first_name: firstName,
          last_name: lastName,
          password: password,
          experience_year: experience
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить данные профиля');
      }

      const result = await response.json();
      console.log("Результат обновления профиля:", result);
      
      if (experience) {
        setHasExperience(true);
      }
      Alert.alert('Успешно', result.message);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      Alert.alert('Ошибка', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль пользователя</Text>
      <Text style={styles.label}>Логин: {login}</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={firstName}
        onChangeText={setFirstName}
        color={Colors.text}
        placeholderTextColor={Colors.secondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Фамилия"
        value={lastName}
        onChangeText={setLastName}
        color={Colors.text}
        placeholderTextColor={Colors.secondary}
      />
      {!hasExperience ? (
        <TextInput
          style={styles.input}
          placeholder="Опыт виноградарства (лет)"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          color={Colors.text}
          placeholderTextColor={Colors.secondary}
        />
      ) : (
        <Text style={styles.experienceText}>
          Опыт виноградарства: {experience} лет
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Новый пароль (если хотите изменить)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        color={Colors.text}
        placeholderTextColor={Colors.secondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Подтвердите пароль"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        color={Colors.text}
        placeholderTextColor={Colors.secondary}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: Layout.spacing,
    textAlign: 'center',
    color: Colors.primary,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginVertical: 8,
    padding: 10,
    borderRadius: Layout.borderRadius,
    backgroundColor: Colors.background,
  },
  experienceText: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Layout.spacing,
    marginTop: Layout.spacing,
    borderRadius: Layout.borderRadius,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
