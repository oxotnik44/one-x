// src/shared/ui/AutoHideScroll.tsx
import { useRef, useState, useEffect, type FC, type ReactNode } from 'react';

interface AutoHideScrollProps {
    className?: string;
    children: ReactNode;
}

export const AutoHideScroll: FC<AutoHideScrollProps> = ({ className = '', children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let timeoutId: number;

        const onScroll = () => {
            setScrolling(true);
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => setScrolling(false), 800);
        };

        el.addEventListener('scroll', onScroll);
        return () => {
            el.removeEventListener('scroll', onScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`
        h-full overflow-auto
        pr-2.5 -mr-2.5            /* смещение скроллбара на 10px */
        scrollbar-auto-hide
        ${scrolling ? 'scrolling' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
