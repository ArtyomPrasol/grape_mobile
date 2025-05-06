import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Colors, Layout } from "../style/theme";
import config from '../config';

const EventScreen = ({ route }) => {
    const { code_name, date_create, time_get, class_set, class_comment } = route.params;
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isSent, setIsSent] = useState(!!class_comment);
    const [sendMessage, setSendMessage] = useState("");

    useEffect(() => {
        fetchImageUrl();
        fetchClasses();
    }, []);

    const fetchImageUrl = async () => {
        try {
            const response = await fetch(`${config.API_URL}/get_url?code_name=${code_name}`);
            const data = await response.json();
            setImageUrl(data.url);
        } catch (error) {
            console.error("Ошибка загрузки изображения:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch(`${config.API_URL}/get_classes`);
            const data = await response.json();
            console.log("Полученные данные:", data);

            if (data.classes && typeof data.classes === "object") {
                const formattedClasses = Object.entries(data.classes).map(([id, name]) => ({
                    id_class: id,
                    name_class: name,
                }));
                setClasses(formattedClasses);
            } else {
                console.error("Ошибка: данные классов имеют неверный формат.");
            }
        } catch (error) {
            console.error("Ошибка загрузки классов:", error);
        }
    };

    const sendClass = async () => {
        try {
            const response = await fetch(`${config.API_URL}/send_class`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code_name, id_class: selectedClass }),
            });
            const result = await response.json();
            if (result.success) {
                setIsSent(true);
                setSendMessage("Класс отправлен успешно!");
            }
        } catch (error) {
            console.error("Ошибка отправки класса:", error);
            setSendMessage("Ошибка отправки. Попробуйте снова.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Детали события</Text>
            <View style={styles.detailBox}>
                <Text style={styles.detailText}>Файл: {code_name}</Text>
                <Text style={styles.detailText}>Дата создания: {date_create}</Text>
                <Text style={styles.detailText}>Дата обработки: {time_get}</Text>
                <Text style={styles.detailText}>Диагноз: {class_set}</Text>
                <Text style={styles.detailText}>Пользователь сказал: {class_comment}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
                <Text style={styles.errorText}>Не удалось загрузить изображение</Text>
            )}

            {!isSent && (
                <>
                    <Picker
                        selectedValue={selectedClass}
                        onValueChange={(itemValue) => setSelectedClass(itemValue)}
                        style={[styles.picker, { color: Colors.text }]}
                    >
                        <Picker.Item label="Выберите класс" value={null} color={Colors.secondary} />
                        {classes.map((cls) => (
                            <Picker.Item key={cls.id_class} label={cls.name_class} value={cls.id_class} color={Colors.text} />
                        ))}
                    </Picker>
                    <TouchableOpacity
                        style={[styles.button, selectedClass ? styles.buttonActive : styles.buttonDisabled]}
                        onPress={sendClass}
                        disabled={!selectedClass} // Блокирует кнопку, если класс не выбран
                    >
                        <Text style={styles.buttonText}>Отправить</Text>
                    </TouchableOpacity>
                </>
            )}

            {sendMessage ? <Text style={styles.message}>{sendMessage}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Layout.spacing * 2,
        paddingHorizontal: Layout.spacing,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: Layout.spacing,
        color: Colors.primary,
        textAlign: "center",
    },
    detailBox: {
        backgroundColor: Colors.cardBackground,
        padding: Layout.spacing,
        borderRadius: Layout.borderRadius,
        marginBottom: Layout.spacing / 2, // Уменьшены отступы
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    detailText: {
        fontSize: 16,
        marginBottom: Layout.spacing / 3, // Уменьшены отступы между текстами
        color: Colors.text,
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
        marginTop: Layout.spacing,
        borderRadius: Layout.borderRadius,
    },
    errorText: {
        color: Colors.error,
        marginTop: Layout.spacing / 2,
        textAlign: "center",
    },
    message: {
        marginTop: Layout.spacing,
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.primary,
        textAlign: "center",
    },
    picker: {
        marginTop: Layout.spacing,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: Layout.borderRadius,
        paddingHorizontal: Layout.spacing / 2,
        paddingVertical: Layout.spacing / 3,
    },
    button: {
        marginTop: Layout.spacing / 1.5, // Уменьшены отступы между пикером и кнопкой
        borderRadius: Layout.borderRadius,
        paddingVertical: Layout.spacing / 2,
        paddingHorizontal: Layout.spacing,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonActive: {
        backgroundColor: Colors.primary, // Фиолетовый цвет
    },
    buttonDisabled: {
        backgroundColor: Colors.disabled, // Светлый цвет для отключенной кнопки
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EventScreen;
