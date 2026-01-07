import DailyHabitItem from '@/components/DailyHabitItem';
import DateSelector from '@/components/DateSelector';
import { useHabits } from '@/context/HabitContext';
import { MaterialIcons } from '@expo/vector-icons';
import { format, startOfToday } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitsScreen() {
    const { habits, toggleHabitCompletion, deleteHabit } = useHabits();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));

    const activeHabits = habits.filter(habit => {
        const isAfterStart = selectedDate >= habit.startDate;
        const isBeforeEnd = !habit.endDate || selectedDate <= habit.endDate;
        return isAfterStart && isBeforeEnd;
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Habits</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <MaterialIcons name="view-agenda" size={18} color="#71717A" />
                        <Text style={styles.sectionTitle}>Daily Goals</Text>
                    </View>
                </View>

                <View style={styles.habitList}>
                    {activeHabits.map((habit) => (
                        <DailyHabitItem
                            key={habit.id}
                            id={habit.id}
                            name={habit.name}
                            color={habit.color}
                            isCompleted={habit.completionData[selectedDate] > 0.5}
                            onToggle={(id) => toggleHabitCompletion(id, selectedDate)}
                            onDelete={deleteHabit}
                        />
                    ))}
                    {activeHabits.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                {habits.length === 0
                                    ? "No habits created yet. Tap + to start!"
                                    : "No habits scheduled for this day."}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/create')}
            >
                <MaterialIcons name="add" size={32} color="#000000" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b', // background-dark
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#71717A',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    habitList: {
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#71717A',
        fontSize: 16,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#B4B4B8', // primary accent from mockup
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});
