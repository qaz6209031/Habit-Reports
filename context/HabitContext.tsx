import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays, differenceInDays, format, parseISO, startOfToday, startOfYear } from 'date-fns';
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
    updateHabit: (habitId: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completionData'>>) => Promise<void>;
    toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
    calculatePercentage: (habit: Habit) => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = '@habits_data';

const MOCK_HABITS: Habit[] = [
    {
        id: '1',
        name: 'Morning Meditation',
        icon: 'Sun',
        color: '#FBBF24',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.92, 0.8),
    },
    {
        id: '2',
        name: 'Gym Session',
        icon: 'Dumbbell',
        color: '#EF4444',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.65, 0.9),
    },
    {
        id: '3',
        name: 'Read Book',
        icon: 'BookOpen',
        color: '#3B82F6',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.85, 0.7),
    },
    {
        id: '4',
        name: 'Drink Water',
        icon: '💧',
        color: '#60A5FA',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.95, 1.0),
    },
    {
        id: '5',
        name: 'Coding',
        icon: 'Code2',
        color: '#8B5CF6',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.80, 0.85),
    },
    {
        id: '6',
        name: 'Healthy Meal',
        icon: '🥗',
        color: '#10B981',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.88, 0.9),
    },
    {
        id: '7',
        name: 'Walk Dog',
        icon: '🦮',
        color: '#F59E0B',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.98, 0.95),
    },
    {
        id: '8',
        name: 'Deep Work',
        icon: 'Target',
        color: '#EC4899',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.75, 0.8),
    },
    {
        id: '9',
        name: 'Journaling',
        icon: 'PenTool',
        color: '#6366F1',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.70, 0.6),
    },
    {
        id: '10',
        name: 'Stretch',
        icon: 'Activity',
        color: '#14B8A6',
        startDate: format(startOfYear(startOfToday()), 'yyyy-MM-dd'),
        endDate: null,
        createdAt: startOfYear(startOfToday()).toISOString(),
        completionData: generateMockCompletionData(0.82, 0.75),
    },
];

function generateMockCompletionData(probability: number, baseIntensity: number): Record<string, number> {
    const data: Record<string, number> = {};
    const today = startOfToday();
    const yearStart = startOfYear(today);

    // Generate data for the entire current year (365 or 366 days)
    for (let i = 0; i < 366; i++) {
        const date = addDays(yearStart, i);
        if (date.getFullYear() !== yearStart.getFullYear()) break;

        const dateStr = format(date, 'yyyy-MM-dd');

        // Add some noise to the probability based on the day of the week
        const dayOfWeek = date.getDay();
        let adjustedProb = probability;
        if (dayOfWeek === 0 || dayOfWeek === 6) adjustedProb -= 0.1; // Weekends

        if (Math.random() < adjustedProb) {
            // High intensity / completed
            data[dateStr] = Math.max(0.4, Math.min(1.0, baseIntensity + (Math.random() - 0.5) * 0.4));
        } else if (Math.random() < 0.3) {
            // Low intensity / partial
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
                // For screenshot/demo purposes: If storage is empty OR if we want to force refresh
                // the user can trigger this by clearing app data or we can force it here once.
                const FORCE_REFRESH_DEMO = true; // Set to true to inject our new colorful data

                if (stored && !FORCE_REFRESH_DEMO) {
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

    const updateHabit = async (habitId: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completionData'>>) => {
        const updatedHabits = habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h));
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
        <HabitContext.Provider value={{ habits, loading, addHabit, deleteHabit, updateHabit, toggleHabitCompletion, calculatePercentage }}>
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
