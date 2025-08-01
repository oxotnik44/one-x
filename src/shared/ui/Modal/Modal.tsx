import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type MouseEvent,
} from 'react';
import { Portal } from 'shared/ui/Portal/Portal';
import { classNames } from 'shared/lib/classNames/classNames';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { FiX } from 'react-icons/fi';

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    lazy?: boolean;
    closable?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal: React.FC<ModalProps> = ({
    className,
    children,
    isOpen,
    onClose,
    lazy = true,
    closable = false,
}) => {
    const [isHiding, setIsHiding] = useState(false);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        if (isOpen) {
            setIsHiding(false);
            setMounted(true);
        } else {
            setIsHiding(true);
            timerRef.current = setTimeout(() => {
                setIsHiding(false);
                setMounted(false);
            }, ANIMATION_DELAY);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsHiding(true);
        timerRef.current = setTimeout(() => {
            setIsHiding(false);
            setMounted(false);
            onClose();
        }, ANIMATION_DELAY);
    }, [onClose]);

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (closable && e.key === 'Escape') handleClose();
        },
        [closable, handleClose],
    );

    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, handleKey]);

    const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
        if (closable && e.target === e.currentTarget) handleClose();
    };

    if (lazy && !mounted) return null;

    return (
        <Portal>
            <div
                onClick={onClickOverlay}
                className={classNames(
                    'fixed inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/60',
                    {
                        'opacity-100 pointer-events-auto z-50': isOpen && !isHiding,
                        'opacity-0 pointer-events-none -z-10': !isOpen || isHiding,
                    },
                    className,
                )}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: theme['--bg-container'],
                        width: 'fit-content',
                        maxWidth: '100%',
                    }}
                    className={classNames(
                        'relative rounded-2xl p-5 transition-transform duration-300',
                        { 'scale-100': isOpen && !isHiding, 'scale-50': !isOpen || isHiding },
                    )}
                >
                    {closable && (
                        <button
                            onClick={handleClose}
                            aria-label="Закрыть"
                            className="absolute top-1 right-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <FiX size={22} />
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </Portal>
    );
};
