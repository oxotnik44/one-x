// src/widgets/Skeleton/ui/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
    /** Передавайте классы Tailwind для формы и размеров (круглые аватарки, блоки текста и т.д.) */
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
        role="status"
        aria-label="Loading..."
    >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent bg-[length:200%_100%] animate-shimmer" />
        <span className="sr-only">Loading...</span>
    </div>
);
