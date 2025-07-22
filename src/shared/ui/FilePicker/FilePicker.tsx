// src/shared/ui/FilePicker/FilePicker.tsx
import React, {
    useRef,
    useState,
    useCallback,
    type ChangeEvent,
    type DragEvent,
    type ReactNode,
    memo,
    type CSSProperties,
} from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useTranslation } from 'react-i18next';

interface FilePickerProps {
    accept?: string;
    onChange: (files: FileList | null, directoryName?: string) => void;
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
    const { t } = useTranslation('filePicker');

    const [isHover, setIsHover] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) {
                onChange(null);
                return;
            }

            const first = files[0] as File & { webkitRelativePath?: string };
            const folderName = first?.webkitRelativePath?.split('/')[0] ?? '';

            onChange(files, folderName);
        },
        [onChange],
    );

    const matchFileType = (file: File): boolean => {
        if (!accept) return true;
        const acceptList = accept.split(',').map((s) => s.trim());
        return acceptList.some((type) => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            return file.type === type;
        });
    };

    const handleDrop = useCallback(
        async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);

            const items = e.dataTransfer.items;
            const files: File[] = [];

            let folderName: string | null = null;

            const traverseFileTree = async (item: FileSystemEntry, path = '') => {
                if (item.isFile) {
                    await new Promise<void>((resolve) => {
                        (item as FileSystemFileEntry).file((file) => {
                            files.push(file);
                            resolve();
                        });
                    });
                } else if (item.isDirectory) {
                    if (!folderName) {
                        // сохраняем имя только первой папки верхнего уровня
                        folderName = item.name;
                    }

                    const dirReader = (item as FileSystemDirectoryEntry).createReader();
                    const readEntries = () =>
                        new Promise<FileSystemEntry[]>((resolve) => dirReader.readEntries(resolve));

                    let entries: FileSystemEntry[] = [];
                    do {
                        entries = await readEntries();
                        for (const entry of entries) {
                            await traverseFileTree(entry, `${path}${item.name}/`);
                        }
                    } while (entries.length > 0);
                }
            };

            const entries = Array.from(items)
                .map((item) => item.webkitGetAsEntry?.())
                .filter((entry): entry is FileSystemEntry => !!entry);

            if (entries.length === 0) {
                onChange(null);
                return;
            }

            for (const entry of entries) {
                await traverseFileTree(entry);
            }

            const filtered = files.filter(matchFileType);
            if (filtered.length > 0) {
                const fileList = new DataTransfer();
                filtered.forEach((f) => fileList.items.add(f));

                onChange(fileList.files, folderName ?? '');
            } else {
                onChange(null);
            }
        },
        [onChange, accept],
    );

    const isActive = isHover || active || isDragOver;

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
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
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
