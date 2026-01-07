import { format, startOfToday, subDays } from 'date-fns';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HeatmapProps {
  color: string;
  completionData: Record<string, number>; // date string (YYYY-MM-DD) -> intensity (0-1)
}

const Heatmap: React.FC<HeatmapProps> = ({ color, completionData }) => {
  const today = startOfToday();
  const totalDays = 364; // 52 weeks * 7 days

  // Create an array for the last 364 days
  const days = Array.from({ length: totalDays }).map((_, i) => {
    const date = subDays(today, totalDays - 1 - i);
    return format(date, 'yyyy-MM-dd');
  });

  // Group days into weeks (columns)
  const weeks = [];
  for (let i = 0; i < totalDays; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getIntensityColor = (date: string) => {
    const intensity = completionData[date] || 0;
    if (intensity === 0) return '#1C1C1E'; // Dark gray for empty

    // Defensive check for hex color
    const isHex = color.startsWith('#');

    if (isHex) {
      if (intensity > 0.8) return color;
      if (intensity > 0.6) return `${color}CC`; // 80% opacity
      if (intensity > 0.1) return `${color}66`; // 40% opacity
      return `${color}33`; // 20% opacity
    }

    // Fallback for legacy named colors
    const colorMap: Record<string, string[]> = {
      blue: ['#1C1C1E', '#1E3A8A', '#1D4ED8', '#3B82F6'],
      red: ['#1C1C1E', '#7F1D1D', '#B91C1C', '#EF4444'],
      purple: ['#1C1C1E', '#581C87', '#7E22CE', '#A855F7'],
      teal: ['#1C1C1E', '#134E4A', '#0F766E', '#14B8A6'],
      orange: ['#1C1C1E', '#7C2D12', '#C2410C', '#F97316'],
      indigo: ['#1C1C1E', '#312E81', '#4338CA', '#6366F1'],
    };

    const shades = colorMap[color] || colorMap.blue;
    if (intensity > 0.8) return shades[3];
    if (intensity > 0.6) return shades[2];
    if (intensity > 0.1) return shades[1];
    return shades[0];
  };

  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.column}>
            {week.map((date) => (
              <View
                key={date}
                style={[
                  styles.cell,
                  { backgroundColor: getIntensityColor(date) }
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  cell: {
    width: 10,
    height: 10,
    margin: 1.5,
    borderRadius: 2,
  },
});

export default Heatmap;
