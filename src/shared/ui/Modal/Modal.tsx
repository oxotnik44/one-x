import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Portal } from 'shared/ui/Portal/Portal';
import { classNames } from 'shared/lib/classNames/classNames';
import { useThemeStore } from 'shared/config/theme/themeStore';

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    lazy?: boolean;
    overlay?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal: React.FC<ModalProps> = ({
    className,
    children,
    isOpen,
    onClose,
    lazy = true,
    overlay = true,
}) => {
    const [isHiding, setIsHiding] = useState(false);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
        } else {
            setIsHiding(true);
            timerRef.current = setTimeout(() => {
                setIsHiding(false);
                setMounted(false);
            }, ANIMATION_DELAY);
        }
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
            if (e.key === 'Escape') {
                handleClose();
            }
        },
        [handleClose],
    );

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKey);
        }
        return () => {
            window.removeEventListener('keydown', handleKey);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isOpen, handleKey]);

    if (lazy && !mounted) return null;

    return (
        <Portal>
            <div
                className={classNames(
                    'fixed inset-0 flex items-center justify-center transition-opacity duration-300',
                    {
                        'opacity-100 pointer-events-auto z-50': isOpen && !isHiding,
                        'opacity-0 pointer-events-none -z-10': !isOpen || isHiding,
                    },
                    [className],
                )}
            >
                {overlay && <div className="absolute inset-0 bg-black/60" />}

                <div
                    className={classNames(
                        'relative rounded-2xl p-5 transition-transform duration-300',
                        {
                            'scale-100': isOpen && !isHiding,
                            'scale-50': !isOpen || isHiding,
                        },
                    )}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: theme['--bg-container'],
                        width: 'fit-content',
                        maxWidth: '100%',
                    }}
                >
                    {children}
                </div>
            </div>
        </Portal>
    );
};
