import { FaSearch, FaHome, FaHeart } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';

export interface SidebarItem {
    icon: IconType;
    label: string; // здесь будут ключи перевода
    href: string;
}

export const sidebarItems: SidebarItem[] = [
    { icon: FaSearch, label: 'search', href: 'search' },
    { icon: FaHome, label: 'main', href: 'main' },
    { icon: FaHeart, label: 'myGroup', href: 'my_group' },
];
