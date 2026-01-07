import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const HabitCard: React.FC<HabitCardProps> = ({ id, name, icon, color, percentage, completionData, onDelete }) => {
    const getIconColor = () => {
        // Now 'color' is expected to be a hex code
        return color.startsWith('#') ? color : '#6366F1';
    };

    return (
        <View style={styles.cardContainer}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
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
});

export default HabitCard;
