// src/widgets/Sidebar/model/items.ts
import { FaSearch, FaHome, FaHeart } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';

export interface SidebarItem {
    icon: IconType;
    label: string;
    href: string;
}

export const sidebarItems: SidebarItem[] = [
    { icon: FaSearch, label: 'Поиск', href: 'search' },
    { icon: FaHome, label: 'Главная', href: 'main' },
    { icon: FaHeart, label: 'Моя группа', href: 'my_group' },
];
