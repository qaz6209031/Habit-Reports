import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DailyHabitItemProps {
    id: string;
    name: string;
    color: string;
    isCompleted: boolean;
    onToggle: (id: string) => void;
}

const DailyHabitItem: React.FC<DailyHabitItemProps> = ({ id, name, color, isCompleted, onToggle }) => {
    // We'll use the habit color as the base, but ensure it pops.
    // In the mockup, 'Meditate' is peach and 'Drink Water' is blue.
    // The user's habit color is already a hex.

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <View style={styles.content}>
                <Text
                    style={[
                        styles.habitName,
                        isCompleted && styles.completedText
                    ]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.toggle,
                    isCompleted ? styles.toggleActive : styles.toggleInactive
                ]}
                onPress={() => onToggle(id)}
            >
                {isCompleted && (
                    <MaterialIcons name="check" size={16} color={color} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    completedText: {
        opacity: 0.6,
        textDecorationLine: 'line-through',
    },
    toggle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleInactive: {
        borderColor: 'rgba(0,0,0,0.3)',
    },
    toggleActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
});

export default DailyHabitItem;
