import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Colors } from '../style/theme';

export const navOptions = (nav) => {
    return {
        headerTransparent: true,
        headerTintColor: Colors.white,
        headerBackground: () => (
            <View style={{
                backgroundColor: Colors.primary,
                height: 100, // настрой под нужную высоту
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }} />
        ),
        headerLeft: () => (
            <Ionicons
                name="menu"
                size={32}
                color={Colors.white}
                style={{ marginLeft: 20}}
                onPress={() => nav.toggleDrawer()}
            />
        ),
        headerRight: () => (
            <Text style={{ 
                fontSize: 20, 
                fontStyle: 'italic', 
                color: Colors.white, 
                marginRight: 16 
            }}>
                GP
            </Text>
        ),
    };
}