import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Layout } from '../style/theme';
import config from '../config';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: Colors.white,
  backgroundGradientTo: Colors.white,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => Colors.secondary,
  propsForLabels: {
    fontSize: 10,
  },
};

const StatsScreen = () => {
  const [filters, setFilters] = useState({
    diagnosis: '',
    start_date: '',
    end_date: '',
  });

  const [diagnoses, setDiagnoses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [mode, setMode] = useState('by_diagnosis');
  const [userId, setUserId] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const loadUserId = async () => {
      const storedId = await AsyncStorage.getItem("user_id");
      if (!storedId) {
        console.error("Пользователь не аутентифицирован");
        return;
      }
      setUserId(storedId);
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/get_classes`);
        const data = response.data;

        if (data.classes && typeof data.classes === "object") {
          const formatted = Object.entries(data.classes).map(([id, name]) => ({
            id,
            name,
          }));
          setDiagnoses(formatted);
        } else {
          console.error("Неверный формат данных классов:", data);
        }
      } catch (error) {
        console.error("Ошибка при получении диагнозов:", error);
      }
    };

    loadUserId();
    fetchDiagnoses();
  }, []);

  const fetchStats = async () => {
    if (!userId) return;

    try {
      const params = new URLSearchParams();
      params.append("id_user", userId);

      Object.entries(filters).forEach(([key, value]) => {
        if (value || value === "") params.append(key, value);
      });

      const res = await axios.get(`${config.API_URL}/stats?${params.toString()}`);
      setMode(res.data.mode);
      setChartData(res.data.data);
    } catch (err) {
      console.error("Ошибка при получении статистики:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      diagnosis: '',
      start_date: '',
      end_date: '',
    });
    setChartData([]);
  };

  const renderChart = () => {
    if (chartData.length === 0) return null;
  
    const labels = chartData.map(d => d.date || d.diagnosis);
    const counts = chartData.map(d => d.count);
  
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: counts }],
          }}
          width={Math.max(screenWidth, labels.length * 150)} // динамическая ширина
          height={260}
          yAxisLabel=""
          chartConfig={{
            ...chartConfig,
            propsForLabels: {
              fontSize: 8, // уменьшен размер шрифта
            },
          }}
          style={[styles.chart, { marginBottom: 30 }]} // добавлен отступ снизу
          withInnerLines={false}
          bezier
        />
      </ScrollView>
    );
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Статистика диагнозов</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Диагноз</Text>
        <Picker
          selectedValue={filters.diagnosis}
          style={[styles.picker, { color: Colors.text }]}
          onValueChange={(itemValue) =>
            setFilters(prev => ({ ...prev, diagnosis: itemValue }))
          }
        >
          <Picker.Item label="Выберите диагноз" value="" color={Colors.secondary} />
          {diagnoses.map(item => (
            <Picker.Item key={item.id} label={item.name} value={item.name} color={Colors.text} />
          ))}
        </Picker>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.smallButtonText}>Дата начала</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {filters.start_date || 'Не выбрана'}
        </Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.smallButtonText}>Дата окончания</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {filters.end_date || 'Не выбрана'}
        </Text>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={filters.start_date ? new Date(filters.start_date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              const isoDate = selectedDate.toISOString().split('T')[0];
              setFilters(prev => ({ ...prev, start_date: isoDate }));
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={filters.end_date ? new Date(filters.end_date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              const isoDate = selectedDate.toISOString().split('T')[0];
              setFilters(prev => ({ ...prev, end_date: isoDate }));
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={fetchStats}>
        <Text style={styles.buttonText}>Показать статистику</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
        <Text style={styles.clearButtonText}>Очистить фильтры</Text>
      </TouchableOpacity>

      {renderChart()}
    </ScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Layout.spacing * 2,
    paddingBottom: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: Layout.spacing,
    color: Colors.primary,
    textAlign: 'center',
  },
  block: {
    width: '100%',
    marginBottom: Layout.spacing,
  },
  label: {
    marginBottom: 4,
    color: Colors.secondary,
    fontSize: 14,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing,
    width: '100%',
  },
  smallButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius,
  },
  smallButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  dateText: {
    marginLeft: 10,
    color: Colors.secondary,
    fontSize: 14,
  },
  chart: {
    marginTop: Layout.spacing,
    borderRadius: Layout.borderRadius,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Layout.spacing,
    borderRadius: Layout.borderRadius,
    marginTop: Layout.spacing,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: Colors.background,
    padding: Layout.spacing,
    borderRadius: Layout.borderRadius,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  clearButtonText: {
    color: Colors.primary,
    fontSize: 14,
  },
});
