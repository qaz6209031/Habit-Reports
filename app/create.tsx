import { useHabits } from '@/context/HabitContext';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addMonths, format, parseISO, startOfToday } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = [
    '#3B82F6', '#EF4444', '#A855F7', '#14B8A6', '#F97316', '#6366F1',
    '#10B981', '#F43F5E', '#8B5CF6', '#06B6D4', '#EAB308', '#64748B',
    '#EC4899', '#0EA5E9', '#D946EF', '#84CC16', '#F59E0B', '#475569',
    '#C026D3', '#2563EB', '#7C3AED', '#059669', '#DC2626', '#1E293B', '#78350F'
];

const ICONS = [
    'fitness-center', 'menu-book', 'water-drop', 'self-improvement', 'bedtime',
    'savings', 'code', 'palette', 'local-florist', 'directions-run',
    'restaurant', 'local-cafe', 'timer', 'language', 'brush',
    'create', 'lightbulb', 'music-note', 'camera-alt', 'explore',
    'favorite', 'stars', 'work', 'school', 'pets',
    'shopping-cart', 'chat', 'call', 'mail', 'map',
    'cloud', 'beach-access', 'pool', 'mountain', 'terrain',
    'bicycle', 'car-rental', 'flight', 'train', 'subway',
    'weekend', 'home', 'apartment', 'business', 'public',
    'vpn-key', 'lock', 'security', 'verified-user', 'fingerprint',
    'headset', 'mic', 'videogame-asset', 'tv', 'speaker',
    'laptop', 'smartphone', 'watch', 'mouse', 'keyboard',
];

export default function CreateHabitScreen() {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(startOfToday());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [hasEndDate, setHasEndDate] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState('water-drop');
    const { habits, addHabit, updateHabit } = useHabits();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const isEditing = !!id;

    // Load existing habit data if editing
    React.useEffect(() => {
        if (isEditing && id) {
            const habit = habits.find((h) => h.id === id);
            if (habit) {
                setName(habit.name);
                setSelectedColor(habit.color);
                setSelectedIcon(habit.icon);
                setStartDate(parseISO(habit.startDate));
                if (habit.endDate) {
                    setEndDate(parseISO(habit.endDate));
                    setHasEndDate(true);
                }
            }
        }
    }, [id, isEditing]);

    const handleToggleEndDate = (value: boolean) => {
        setHasEndDate(value);
        if (value && !endDate) {
            setEndDate(addMonths(startDate, 1));
        } else if (!value) {
            setEndDate(null);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return;

        const habitData = {
            name,
            color: selectedColor,
            icon: selectedIcon,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        };

        if (isEditing && id) {
            await updateHabit(id, habitData);
        } else {
            await addHabit(habitData);
        }
        router.back();
    };

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
            // Ensure end date is not before start date
            if (endDate && selectedDate > endDate) {
                setEndDate(null);
            }
        }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{isEditing ? 'Edit Habit' : 'New Habit'}</Text>
                    <View style={styles.spacer} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Habit Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Read Books"
                                placeholderTextColor="#6B7280"
                                value={name}
                                onChangeText={setName}
                            />
                            <MaterialIcons name="edit" size={20} color={selectedColor} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeaderInner}>
                            <Text style={styles.label}>Habit Duration</Text>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Fixed Period</Text>
                                <Switch
                                    value={hasEndDate}
                                    onValueChange={handleToggleEndDate}
                                    trackColor={{ false: '#2C2C2E', true: selectedColor + '88' }}
                                    thumbColor={hasEndDate ? selectedColor : '#9CA3AF'}
                                    ios_backgroundColor="#2C2C2E"
                                />
                            </View>
                        </View>

                        <View style={styles.durationCards}>
                            <TouchableOpacity
                                style={styles.dateCard}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <View style={[styles.dateCardIcon, { backgroundColor: selectedColor + '22' }]}>
                                    <MaterialIcons name="calendar-today" size={22} color={selectedColor} />
                                </View>
                                <View style={styles.dateCardInfo}>
                                    <Text style={styles.dateCardLabel}>Starts On</Text>
                                    <Text style={styles.dateCardValue}>{format(startDate, 'EEEE, MMM dd')}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color="#4B5563" />
                            </TouchableOpacity>

                            {hasEndDate && (
                                <TouchableOpacity
                                    style={[styles.dateCard, { marginTop: 12 }]}
                                    onPress={() => setShowEndDatePicker(true)}
                                >
                                    <View style={[styles.dateCardIcon, { backgroundColor: '#EF444422' }]}>
                                        <MaterialIcons name="event-busy" size={22} color="#EF4444" />
                                    </View>
                                    <View style={styles.dateCardInfo}>
                                        <Text style={styles.dateCardLabel}>Ends On</Text>
                                        <Text style={styles.dateCardValue}>
                                            {endDate ? format(endDate, 'EEEE, MMM dd') : 'Select Date'}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={20} color="#4B5563" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Modal
                            visible={showStartDatePicker || showEndDatePicker}
                            transparent={true}
                            animationType="fade"
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>
                                            {showStartDatePicker ? 'Select Start Date' : 'Select End Date'}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowStartDatePicker(false);
                                                setShowEndDatePicker(false);
                                            }}
                                        >
                                            <MaterialIcons name="close" size={24} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>

                                    <DateTimePicker
                                        value={showStartDatePicker ? startDate : (endDate || new Date())}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={showStartDatePicker ? onStartDateChange : onEndDateChange}
                                        minimumDate={showEndDatePicker ? startDate : undefined}
                                        themeVariant="dark"
                                        textColor="#FFFFFF"
                                    />

                                    <TouchableOpacity
                                        style={[styles.modalDoneButton, { backgroundColor: selectedColor }]}
                                        onPress={() => {
                                            setShowStartDatePicker(false);
                                            setShowEndDatePicker(false);
                                        }}
                                    >
                                        <Text style={styles.modalDoneButtonText}>Confirm Date</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Visualization Color</Text>
                        <View style={styles.colorGrid}>
                            {COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Habit Icon</Text>
                        <View style={styles.iconGrid}>
                            {ICONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconButton,
                                        selectedIcon === icon && { backgroundColor: selectedColor, borderColor: selectedColor },
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <MaterialIcons
                                        name={icon as any}
                                        size={30}
                                        color={selectedIcon === icon ? '#FFFFFF' : '#9CA3AF'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.createButton, isEditing && { backgroundColor: '#4B5563' }]} onPress={handleSave}>
                        <MaterialIcons name={isEditing ? 'save' : 'check'} size={24} color="#FFFFFF" />
                        <Text style={styles.createButtonText}>{isEditing ? 'Save Changes' : 'Create Habit'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    spacer: {
        width: 44,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 32,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 64,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    sectionHeaderInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    durationCards: {
        marginTop: 4,
    },
    dateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2C2C2E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    dateCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    dateCardInfo: {
        flex: 1,
    },
    dateCardLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    dateCardValue: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 48 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    modalDoneButton: {
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    modalDoneButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
    },
    colorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.1 }],
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    iconButton: {
        width: '23%',
        aspectRatio: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    footer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    },
    createButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        borderRadius: 16,
        gap: 8,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

