import HabitCard from '@/components/HabitCard';
import { useHabits } from '@/context/HabitContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitReportsScreen() {
  const { habits, calculatePercentage, deleteHabit } = useHabits();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Habit Reports</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            name={habit.name}
            icon={habit.icon}
            color={habit.color}
            percentage={calculatePercentage(habit)}
            completionData={habit.completionData}
            onDelete={deleteHabit}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
});
