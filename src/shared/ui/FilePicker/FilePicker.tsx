// src/shared/ui/FilePicker/FilePicker.tsx
import React, {
    useRef,
    useState,
    useCallback,
    type ChangeEvent,
    type ReactNode,
    memo,
    type CSSProperties,
} from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useTranslation } from 'react-i18next';

interface FilePickerProps {
    accept?: string;
    onChange: (files: FileList | null) => void;
    placeholder?: ReactNode;
    previewUrl?: string | null;
    title?: string;
    className?: string;
    style?: CSSProperties;
    active?: boolean;
    directory?: boolean;
}

const FilePickerComponent: React.FC<FilePickerProps> = ({
    accept,
    onChange,
    placeholder,
    previewUrl = null,
    title,
    className,
    style,
    active = false,
    directory = false,
}) => {
    const theme = useThemeStore((state) => state.theme);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isHover, setIsHover] = useState(false);
    const { t } = useTranslation('filePicker');

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.files);
        },
        [onChange],
    );

    const isActive = isHover || active;

    return (
        <>
            <div
                className={`flex-shrink-0 flex justify-center items-center rounded-md border-2 border-dashed cursor-pointer max-w-32 max-h-32 mx-auto transition-colors ${className || ''}`}
                style={{
                    borderColor: theme['--primary-color'] || '#880015',
                    color: isActive ? '#fff' : theme['--primary-color'] || '#880015',
                    width: '6rem',
                    height: '6rem',
                    backgroundColor: isActive ? theme['--primary-color'] : 'transparent',
                    ...style,
                }}
                title={title ?? t('title')}
                onClick={handleClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="object-cover rounded-md w-full h-full"
                    />
                ) : (
                    placeholder
                )}
            </div>

            <input
                type="file"
                ref={inputRef}
                accept={accept}
                onChange={handleChange}
                className="hidden"
                {...(directory ? { webkitdirectory: 'true' } : {})}
            />
        </>
    );
};

export const FilePicker = memo(FilePickerComponent);
