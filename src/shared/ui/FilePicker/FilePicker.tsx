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
    previewUrl?: string | null;
    placeholder?: ReactNode;
    title?: string;
    className?: string;
    style?: CSSProperties;
    active?: boolean;
}

const FilePickerComponent: React.FC<FilePickerProps> = ({
    accept,
    onChange,
    previewUrl = null,
    placeholder,
    title,
    className,
    style,
    active = false,
}) => {
    const theme = useThemeStore((state) => state.theme);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isHover, setIsHover] = useState(false);
    const { t } = useTranslation('filePicker'); // namespace filePicker

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
                    width: previewUrl ? 'auto' : '6rem',
                    height: previewUrl ? 'auto' : '6rem',
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
                        alt={title ?? t('previewAlt')}
                        className="rounded-md object-contain"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    placeholder
                )}
            </div>

            <input
                type="file"
                accept={accept}
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
            />
        </>
    );
};

export const FilePicker = memo(FilePickerComponent);
