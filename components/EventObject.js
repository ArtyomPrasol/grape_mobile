import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Colors, Layout } from "../style/theme";

const EventItem = ({code_name, date_create, time_get, class_set, class_comment}) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: class_comment ? Colors.purple : Colors.white }
            ]}
            onPress={() => navigation.navigate('Event', { 
                code_name, date_create, time_get, class_set, class_comment 
            })}
        >
            <Text>Файл: {code_name}</Text>
            <Text>Дата создания: {date_create}</Text>
            <Text>Дата обработки: {time_get}</Text>
            <Text>Диагноз: {class_set}</Text>
            <Text>Пользователь сказал: {class_comment}</Text>
        </TouchableOpacity>
    );
}

export default EventItem;

const styles = StyleSheet.create({
    card: {
        width: 300,
        height: 200,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: Layout.spacing,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: Colors.secondary,
        borderRadius: Layout.borderRadius * 2,
        borderWidth: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        // backgroundColor перенесён в компонент
    }
});
