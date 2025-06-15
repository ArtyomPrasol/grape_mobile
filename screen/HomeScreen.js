import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import EventList from "../components/EventList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Layout } from "../style/theme";
import config from '../config';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = () => {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const isFocused = useIsFocused();
    
    const fetchData = async () => {
        try {
            const userId = await AsyncStorage.getItem("user_id");
            if (!userId) {
                console.error("Пользователь не аутентифицирован");
                return;
            }
            console.log(`Пользователь ${userId}`);

            const response = await fetch(`${config.API_URL}/user/${userId}/request`);
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            console.log("Загрузка с сервера", data);
            setData(data);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
        fetchData();
        }
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    return (
        <View style={[
            styles.screen,
            {
                paddingTop: headerHeight,
                paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 0 : 56), // 56 - примерная высота TabBar на Android
            }
        ]}>
            <EventList data={data} onRefresh={onRefresh} refreshing={refreshing} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    }
});

export default HomeScreen;