import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Heatmap from './Heatmap';

interface HabitCardProps {
    id: string;
    name: string;
    icon: string;
    color: string;
    percentage: number;
    completionData: Record<string, number>;
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

const HabitCard: React.FC<HabitCardProps> = ({ id, name, icon, color, percentage, completionData, onDelete }) => {
    const getIconColor = () => {
        // Now 'color' is expected to be a hex code
        return color.startsWith('#') ? color : '#6366F1';
    };

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
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <MaterialIcons name={icon as any} size={20} color={getIconColor()} />
                        <Text style={styles.title}>{name}</Text>
                    </View>
                    <Text style={styles.percentage}>{percentage}%</Text>
                </View>
                <View style={styles.heatmapContainer}>
                    <Heatmap color={color} completionData={completionData} />
                </View>
            </View>
        </ReanimatedSwipeable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1C1C1E',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F3F4F6',
        marginLeft: 8,
    },
    percentage: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    heatmapContainer: {
        paddingBottom: 8,
        backgroundColor: '#000000',
    },
    rightAction: {
        width: 100,
        height: '100%',
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HabitCard;
