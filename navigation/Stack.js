import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from '../screen/ProfileScreen';
import HomeTabs from './Tabs';
import EventScreen from '../screen/RequestObjectScreen';
import { navOptions } from './Option';
import StatsScreen from '../screen/StatsScreen';


const Stack = createStackNavigator();

export const HomeStack = () => {
  const navigation = useNavigation()
  return (
    <Stack.Navigator screenOptions={()=>navOptions(navigation)}>

      <Stack.Screen name="MainPage" component={HomeTabs} options={{
        title: ''
      }}/>
      <Stack.Screen name="Event" component={EventScreen} options={{
        headerShown: false
      }}/>

    </Stack.Navigator>
  );
}

export const ProfileStack = () =>{
  const navigation = useNavigation()
  return(
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name="Profile"  component={ProfileScreen} options={{
        title: 'Профиль',
      }}/>
    </Stack.Navigator>
  )
}


export const StatsStack = () =>{
  const navigation = useNavigation()
  return(
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name="Stats"  component={StatsScreen} options={{
        title: 'Статистика',
      }}/>
    </Stack.Navigator>
  )
}