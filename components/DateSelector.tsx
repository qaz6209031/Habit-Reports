import { format, isSameDay, startOfToday, subDays } from 'date-fns';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface DateSelectorProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateSelect }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const today = startOfToday();

    // Generate a range of dates: 15 days before and 15 days after today
    const dates = Array.from({ length: 31 }).map((_, i) => {
        return subDays(today, 15 - i);
    });

    useEffect(() => {
        // Center the selected date (or today) on load
        const selectedIndex = dates.findIndex(d => format(d, 'yyyy-MM-dd') === selectedDate);
        if (selectedIndex !== -1 && scrollViewRef.current) {
            // Approx item width is 60 (48 width + 12 gap)
            const itemWidth = 60;
            scrollViewRef.current.scrollTo({
                x: (selectedIndex * itemWidth) - 150, // Center approx
                animated: false
            });
        }
    }, []);

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            snapToInterval={60}
            decelerationRate="fast"
        >
            {dates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isSelected = dateStr === selectedDate;
                const isTodayDate = isSameDay(date, today);

                return (
                    <TouchableOpacity
                        key={dateStr}
                        style={[
                            styles.dateItem,
                            isSelected && styles.selectedDateItem
                        ]}
                        onPress={() => onDateSelect(dateStr)}
                    >
                        <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                            {format(date, 'EEE')}
                        </Text>
                        <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                            {format(date, 'd')}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingBottom: 0,
    },
    dateItem: {
        width: 48,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    selectedDateItem: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#71717A', // Highlight with border like mockup
    },
    dayName: {
        fontSize: 10,
        fontWeight: '500',
        color: '#71717A',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    selectedText: {
        color: '#FFFFFF',
    },
});

export default DateSelector;
