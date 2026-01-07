import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, format, parseISO, startOfToday, subDays } from 'date-fns';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    completionData: Record<string, number>;
}

interface HabitContextType {
    habits: Habit[];
    loading: boolean;
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completionData'>) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
    toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
    calculatePercentage: (habit: Habit) => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = '@habits_data';

const MOCK_HABITS: Habit[] = [
    {
        id: '1',
        name: 'Drink Water - 8 cups per day',
        icon: 'local-drink',
        color: 'blue',
        startDate: format(subDays(startOfToday(), 365), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: subDays(startOfToday(), 365).toISOString(),
        completionData: generateMockCompletionData(0.86),
    },
    {
        id: '2',
        name: 'Read - 200 pages per week',
        icon: 'menu-book',
        color: 'red',
        startDate: format(subDays(startOfToday(), 365), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: subDays(startOfToday(), 365).toISOString(),
        completionData: generateMockCompletionData(0.83),
    },
    {
        id: '3',
        name: 'Stretch - 2 times per day',
        icon: 'accessibility',
        color: 'purple',
        startDate: format(subDays(startOfToday(), 365), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: subDays(startOfToday(), 365).toISOString(),
        completionData: generateMockCompletionData(0.77),
    },
];

function generateMockCompletionData(percentage: number): Record<string, number> {
    const data: Record<string, number> = {};
    const today = startOfToday();
    for (let i = 0; i < 365; i++) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        if (Math.random() < percentage) {
            data[dateStr] = Math.random() * 0.5 + 0.5;
        } else {
            data[dateStr] = Math.random() * 0.3;
        }
    }
    return data;
}

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHabits = async () => {
            try {
                const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
                if (stored) {
                    const parsedHabits = JSON.parse(stored);
                    // Migration: Ensure all habits have startDate and endDate
                    const migratedHabits = parsedHabits.map((h: any) => {
                        const createdAt = h.createdAt ? new Date(h.createdAt) : startOfToday();
                        return {
                            ...h,
                            startDate: h.startDate || format(createdAt, 'yyyy-MM-dd'),
                            endDate: h.endDate || null,
                        };
                    });
                    setHabits(migratedHabits);
                } else {
                    setHabits(MOCK_HABITS);
                    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(MOCK_HABITS));
                }
            } catch (e) {
                console.error('Failed to load habits', e);
            } finally {
                setLoading(false);
            }
        };
        loadHabits();
    }, []);

    const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'completionData'>) => {
        const newHabit: Habit = {
            ...habit,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completionData: {},
        };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    };

    const deleteHabit = async (habitId: string) => {
        const updatedHabits = habits.filter((h) => h.id !== habitId);
        setHabits(updatedHabits);
        await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    };

    const toggleHabitCompletion = async (habitId: string, date: string) => {
        const updatedHabits = habits.map((habit) => {
            if (habit.id === habitId) {
                const currentIntensity = habit.completionData[date] || 0;
                const newIntensity = currentIntensity > 0.5 ? 0 : 1;
                return {
                    ...habit,
                    completionData: {
                        ...habit.completionData,
                        [date]: newIntensity,
                    },
                };
            }
            return habit;
        });
        setHabits(updatedHabits);
        await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    };

    const calculatePercentage = (habit: Habit) => {
        const todayStr = format(startOfToday(), 'yyyy-MM-dd');
        const start = habit.startDate;

        // Calculate the effective end date for percentage (don't count future days)
        const effectiveEnd = habit.endDate && habit.endDate < todayStr
            ? habit.endDate
            : todayStr;

        if (effectiveEnd < start) return 0;

        const completed = Object.entries(habit.completionData)
            .filter(([date, v]) => v > 0.5 && date >= start && date <= effectiveEnd)
            .length;

        const daysInRange = differenceInDays(parseISO(effectiveEnd), parseISO(start)) + 1;

        return Math.round((completed / Math.max(daysInRange, 1)) * 100);
    };

    return (
        <HabitContext.Provider value={{ habits, loading, addHabit, deleteHabit, toggleHabitCompletion, calculatePercentage }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
