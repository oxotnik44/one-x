export interface SidebarItem {
    icon: string; // заменили JSX.Element на string
    label: string;
}

export const sidebarItems: SidebarItem[] = [
    { icon: '🔍', label: 'Поиск' },
    { icon: '🏠', label: 'Главная' },
    { icon: '📚', label: 'Подкасты и книги' },
    { icon: '👶', label: 'Детям' },
    { icon: '❤️', label: 'Коллекция' },
];
