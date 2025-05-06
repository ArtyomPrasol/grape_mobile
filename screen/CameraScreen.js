import { useRef, useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from "react-native"
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Colors } from '../style/theme';
import config from '../config';

export const CameraScreen = () => {
    const { hasPermission } = useCameraPermission()
    const camera = useRef(null)
    const device = useCameraDevice('back')
    const [userId, setUserId] = useState(null)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const id = await AsyncStorage.getItem("user_id");
                if (!id) {
                    console.error("Пользователь не аутентифицирован");
                    Alert.alert("Ошибка", "Пользователь не аутентифицирован");
                    return;
                }
                setUserId(id);
                console.log("ID пользователя:", id);
            } catch (error) {
                console.error("Ошибка получения user_id:", error);
                Alert.alert("Ошибка", "Не удалось получить ID пользователя");
            }
        };
        loadUserId();
    }, []);

    const postToServer = async(img)=>{
        if (!userId) {
            Alert.alert("Ошибка", "Пользователь не аутентифицирован");
            return;
        }

        setIsSending(true);
        const formData = new FormData();
        const photo = {
            uri: `file://${img.path}`, 
            type: 'image/jpg',
            name: 'test.jpg'
        }
        
        formData.append('photo', photo)
        formData.append('id_client', userId)

        try {
            const response = await fetch(`${config.API_URL}/request`,{ 
                method: 'POST',
                headers:{  
                    "Content-Type": "multipart/form-data",
                }, 
                body: formData 
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке фото');
            }

            Alert.alert('Успех', 'Фото успешно отправлено');
        } catch (error) {
            console.error('Ошибка при отправке фото:', error);
            Alert.alert('Ошибка', 'Не удалось отправить фото');
        } finally {
            setIsSending(false);
        }
    }

    const capturePhoto = async() => {
        if (!userId) {
            Alert.alert("Ошибка", "Пользователь не аутентифицирован");
            return;
        }

        if (isSending) {
            return;
        }

        try {
            const photo = await camera.current.takePhoto({})
            await postToServer(photo)
            console.log('Фото отправлено')
        } catch (error) {
            console.error('Ошибка при съемке фото:', error);
            Alert.alert('Ошибка', 'Не удалось сделать фото');
        }
    }

    if (device == null) return <NoCameraDeviceError />
    return (
        <>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true} 
            />
            
            <View style={styles.low_part_screen}>
                <TouchableOpacity
                    style={[
                        styles.button_style,
                        isSending && styles.button_disabled
                    ]}
                    onPress={capturePhoto}
                    disabled={isSending}
                >
                    {isSending && (
                        <ActivityIndicator 
                            color={Colors.white} 
                            style={styles.loading_indicator}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </>
    )
}

const NoCameraDeviceError = () => (
    <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Камера не найдена</Text>
    </View>
);

const styles = StyleSheet.create({
    screen:{
        padding: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    errorText: {
        fontSize: 16,
        color: Colors.secondary,
        marginBottom: 20,
    },
    low_part_screen:{
        position: 'absolute',
        bottom: Dimensions.get('window').height * 0.1, // 5% от высоты экрана
        left: 0,
        right: 0,
        height: 110,
        backgroundColor: 'rgba(143, 143, 143, 0.25)',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_style:{
        backgroundColor: Colors.primary,
        height: 80,
        width:80,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_disabled: {
        opacity: 0.7,
    },
    loading_indicator: {
        position: 'absolute',
    }
})

export default CameraScreen;