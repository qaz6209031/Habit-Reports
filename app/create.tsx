import { useHabits } from '@/context/HabitContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
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
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState('water-drop');
    const { addHabit } = useHabits();
    const router = useRouter();

    const handleCreate = async () => {
        if (!name.trim()) return;
        await addHabit({
            name,
            color: selectedColor,
            icon: selectedIcon,
        });
        router.back();
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
                    <Text style={styles.headerTitle}>New Habit</Text>
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
                    <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                        <MaterialIcons name="check" size={24} color="#FFFFFF" />
                        <Text style={styles.createButtonText}>Create Habit</Text>
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
