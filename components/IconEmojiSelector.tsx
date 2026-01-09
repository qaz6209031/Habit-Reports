import { EMOJI_CATEGORIES } from '@/constants/emojis';
import { ICON_CATEGORIES } from '@/constants/icons';
import * as Haptics from 'expo-haptics';
import * as LucideIcons from 'lucide-react-native';
import { Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface IconEmojiSelectorProps {
    onSelect: (item: string, type: 'icon' | 'emoji') => void;
    onClose: () => void;
    selectedColor: string;
}

export default function IconEmojiSelector({ onSelect, onClose, selectedColor }: IconEmojiSelectorProps) {
    const [activeTab, setActiveTab] = useState<'icon' | 'emoji'>('icon');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIcons = useMemo(() => {
        if (!searchQuery) return ICON_CATEGORIES;
        const lowerQuery = searchQuery.toLowerCase();
        return ICON_CATEGORIES.map(cat => ({
            ...cat,
            icons: cat.icons.filter(icon => icon.toLowerCase().includes(lowerQuery))
        })).filter(cat => cat.icons.length > 0);
    }, [searchQuery]);

    const filteredEmojis = useMemo(() => {
        if (!searchQuery) return EMOJI_CATEGORIES;
        const lowerQuery = searchQuery.toLowerCase();
        return EMOJI_CATEGORIES.map(cat => ({
            ...cat,
            emojis: cat.emojis.filter(emoji => emoji.includes(searchQuery)) // Emoji search is tricky by name, usually just literal or tags
        })).filter(cat => cat.emojis.length > 0);
    }, [searchQuery]);

    const renderIconItem = ({ item: iconName, key }: { item: string; key?: string }) => {
        const IconComponent = (LucideIcons as any)[iconName];
        if (!IconComponent) return null;

        return (
            <TouchableOpacity
                key={key}
                style={styles.gridItem}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSelect(iconName, 'icon');
                }}
            >
                <IconComponent size={28} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
        );
    };

    const renderEmojiItem = ({ item: emoji, key }: { item: string; key?: string }) => (
        <TouchableOpacity
            key={key}
            style={styles.gridItem}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelect(emoji, 'emoji');
            }}
        >
            <Text style={styles.emojiText}>{emoji}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'icon' && styles.activeTab]}
                        onPress={() => {
                            Haptics.selectionAsync();
                            setActiveTab('icon');
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'icon' && styles.activeTabText]}>Icon</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'emoji' && styles.activeTab]}
                        onPress={() => {
                            Haptics.selectionAsync();
                            setActiveTab('emoji');
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'emoji' && styles.activeTabText]}>Emoji</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#6B7280" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={activeTab === 'icon' ? "Search icons..." : "Search emojis..."}
                    placeholderTextColor="#6B7280"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                />
            </View>

            <FlatList
                data={(activeTab === 'icon' ? filteredIcons : filteredEmojis) as any}
                keyExtractor={(item: any) => item.name}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }: { item: any }) => (
                    <View style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{item.name}</Text>
                        <View style={styles.grid}>
                            {activeTab === 'icon'
                                ? item.icons.map((icon: string) => renderIconItem({ item: icon, key: icon }))
                                : item.emojis.map((emoji: string) => renderEmojiItem({ item: emoji, key: emoji }))
                            }
                        </View>
                    </View>
                )}
            />
        </View >
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
        paddingTop: 12,
        paddingBottom: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 22,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 4,
        width: 160,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#3A3A3C',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    categorySection: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    categoryTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gridItem: {
        width: 50,
        aspectRatio: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    emojiText: {
        fontSize: 24,
    },
});
