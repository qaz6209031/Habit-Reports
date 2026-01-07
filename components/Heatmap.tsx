import {
  addDays,
  format,
  startOfToday,
  startOfWeek,
  startOfYear
} from 'date-fns';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HeatmapProps {
  color: string;
  completionData: Record<string, number>; // date string (YYYY-MM-DD) -> intensity (0-1)
  startDate: string;
  endDate: string | null;
}

const Heatmap: React.FC<HeatmapProps> = ({ color, completionData, startDate, endDate }) => {
  const today = startOfToday();
  const yearStart = startOfYear(today);

  // Align to the start of the week containing Jan 1st (usually a few days in Dec)
  const gridStart = startOfWeek(yearStart, { weekStartsOn: 0 }); // Sunday

  // Create 53 weeks to ensure we cover the whole year even if it starts mid-week
  const weeks = Array.from({ length: 53 }).map((_, weekIndex) => {
    return Array.from({ length: 7 }).map((_, dayIndex) => {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isCurrentYear = date.getFullYear() === yearStart.getFullYear();

      return {
        dateStr,
        isCurrentYear
      };
    });
  });

  const getIntensityColor = (dateStr: string, isCurrentYear: boolean) => {
    if (!isCurrentYear) return 'transparent'; // Hide days from prev/next year

    const intensity = completionData[dateStr] || 0;
    if (intensity === 0) return '#1A1A1A'; // Default dark grid color

    // Defensive check for hex color
    const isHex = color.startsWith('#');
    if (isHex) {
      if (intensity > 0.8) return color;
      if (intensity > 0.6) return `${color}CC`;
      if (intensity > 0.1) return `${color}66`;
      return `${color}33`;
    }

    return color; // Fallback
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.column}>
              {week.map((item) => (
                <View
                  key={item.dateStr}
                  style={[
                    styles.cell,
                    { backgroundColor: getIntensityColor(item.dateStr, item.isCurrentYear) }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 12,
    height: 110,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    height: 86,
  },
  column: {
    flexDirection: 'column',
  },
  cell: {
    width: 10,
    height: 10,
    margin: 1,
    borderRadius: 2,
  },
});

export default Heatmap;
