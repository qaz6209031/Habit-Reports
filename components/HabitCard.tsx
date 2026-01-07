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
    startDate: string;
    endDate: string | null;
    onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ id, name, icon, color, percentage, completionData, startDate, endDate, onDelete }) => {
    const getIconColor = () => {
        // Now 'color' is expected to be a hex code
        return color.startsWith('#') ? color : '#6366F1';
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: getIconColor() + '22' }]}>
                            <MaterialIcons name="check-circle" size={18} color={getIconColor()} />
                        </View>
                        <Text style={styles.title}>{name}</Text>
                    </View>
                    <Text style={styles.percentage}>{percentage}%</Text>
                </View>
                <View style={styles.heatmapContainer}>
                    <Heatmap
                        color={color}
                        completionData={completionData}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    percentage: {
        fontSize: 15,
        fontWeight: '700',
        color: '#9CA3AF',
        marginLeft: 12,
    },
    heatmapContainer: {
        paddingBottom: 12,
        alignItems: 'center',
    },
});

export default HabitCard;
