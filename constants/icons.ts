export const ICON_CATEGORIES = [
    {
        name: 'Activities',
        icons: [
            'Activity', 'Dumbbell', 'Bike', 'Run', 'Waves', 'Mountain', 'Tent', 'Compass',
            'Target', 'Gamepad2', 'Music', 'Camera', 'Palette', 'Brush', 'PenTool', 'BookOpen',
            'Cooking', 'Coffee', 'Wine', 'Pizza', 'Apple', 'Baby', 'Briefcase', 'GraduationCap'
        ]
    },
    {
        name: 'Wellness',
        icons: [
            'Heart', 'Smile', 'Sun', 'Moon', 'Zap', 'Shield', 'LifeBuoy', 'Medal',
            'Stethoscope', 'Pill', 'Brain', 'Eye', 'CloudRain', 'Wind', 'Thermometer'
        ]
    },
    {
        name: 'Productivity',
        icons: [
            'Clock', 'Calendar', 'Timer', 'CheckCircle2', 'ListTodo', 'BarChart3', 'Link', 'Database',
            'Code2', 'Cpu', 'Laptop', 'Smartphone', 'Mail', 'Bell', 'Settings', 'Search'
        ]
    },
    {
        name: 'Home',
        icons: [
            'Home', 'Lamp', 'Bed', 'Bath', 'Trash2', 'Wrench', 'Hammer', 'Car',
            'ShoppingBag', 'CreditCard', 'Key', 'Lock', 'Plug', 'Tv', 'Speaker'
        ]
    }
];

export const ALL_ICONS = ICON_CATEGORIES.flatMap(cat => cat.icons);
