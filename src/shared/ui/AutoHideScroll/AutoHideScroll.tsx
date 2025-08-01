import { useRef, useState, useEffect, type FC, type ReactNode, memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';

interface AutoHideScrollProps {
    className?: string;
    children: ReactNode;
}

const AutoHideScrollComponent: FC<AutoHideScrollProps> = ({ className = '', children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let timeoutId: number;

        const handleScroll = () => {
            setScrolling(true);
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => setScrolling(false), 800);
        };

        el.addEventListener('scroll', handleScroll);
        return () => {
            el.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    const containerClass = classNames(
        'h-full overflow-auto pr-2.5 -mr-2.5 scrollbar-auto-hide',
        { scrolling },
        className,
    );

    return (
        <div ref={ref} className={containerClass}>
            {children}
        </div>
    );
};

export const AutoHideScroll = memo(AutoHideScrollComponent);
