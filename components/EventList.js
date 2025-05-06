import { View, RefreshControl, FlatList, StyleSheet } from "react-native";
import EventItem from "./EventObject";
import { Colors } from "../style/theme";

const EventList = ({ data, onRefresh, refreshing }) => {
    const renderItem = ({ item }) => (
        <EventItem 
            code_name={item.code_name} 
            date_create={item.date_create} 
            time_get={item.time_get} 
            class_set={item.class_set} 
            class_comment={item.class_comment}
        />
    );

    return (
        <View>   
            <FlatList
                data={data}
                keyExtractor={item => item.date_create}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
      backgroundColor: Colors.background,
    }
  });

export default EventList;