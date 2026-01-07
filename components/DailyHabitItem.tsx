import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface DailyHabitItemProps {
    id: string;
    name: string;
    icon: string;
    color: string;
    isCompleted: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>, onDelete: () => void) => {
    const styleZIndex = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + 100 }],
        };
    });

    return (
        <Reanimated.View style={[styles.rightAction, styleZIndex]}>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </Reanimated.View>
    );
};

const DailyHabitItem: React.FC<DailyHabitItemProps> = ({ id, name, icon, color, isCompleted, onToggle, onDelete }) => {
    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
            ]
        );
    };

    return (
        <ReanimatedSwipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={(prog, drag) => RightAction(prog, drag, handleDelete)}
            containerStyle={styles.swipeContainer}
        >
            <View style={[styles.container, { backgroundColor: color }]}>
                <View style={styles.content}>
                    <View style={styles.nameContainer}>
                        <MaterialIcons
                            name={icon as any}
                            size={20}
                            color="#000000"
                            style={styles.habitIcon}
                        />
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
        </ReanimatedSwipeable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 12,
    },
    container: {
        borderRadius: 20,
        padding: 20,
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
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    habitIcon: {
        marginRight: 10,
        opacity: 0.8,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
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
    rightAction: {
        width: 100,
        height: '100%',
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    deleteButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DailyHabitItem;
