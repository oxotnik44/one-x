// src/shared/ui/FilePicker/FilePicker.tsx
import {
    useRef,
    useState,
    useCallback,
    type ChangeEvent,
    type DragEvent,
    type ReactNode,
    type CSSProperties,
    memo,
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

const FilePickerComponent = ({
    accept,
    onChange,
    placeholder,
    previewUrl = null,
    title,
    className = '',
    style,
    active = false,
    directory = false,
}: FilePickerProps) => {
    const theme = useThemeStore((s) => s.theme);
    const { t } = useTranslation('filePicker');
    const inputRef = useRef<HTMLInputElement>(null);

    // Состояние для hover и drag&drop
    const [isHover, setIsHover] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const isActive = isHover || isDragOver || active;

    // Клик по области вызывает скрытый input[type="file"]
    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    // Обработка выбора файла вручную через input
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files?.length) return onChange(null);

            const first = files[0] as File & { webkitRelativePath?: string };
            const folder = first.webkitRelativePath?.split('/')[0] ?? '';
            onChange(files, folder);
        },
        [onChange],
    );

    // Проверка типа файла на соответствие accept
    const matchFileType = (file: File) => {
        if (!accept) return true;
        return accept
            .split(',')
            .some((type) =>
                type.trim().startsWith('.')
                    ? file.name.toLowerCase().endsWith(type.trim().toLowerCase())
                    : file.type === type.trim(),
            );
    };

    // Обработка drag&drop, включая поддержку папок (webkitGetAsEntry API)
    const handleDrop = useCallback(
        async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);

            const items = e.dataTransfer.items;
            const entries = Array.from(items)
                .map((item) => item.webkitGetAsEntry?.())
                .filter((e): e is FileSystemEntry => !!e);

            const files: File[] = [];
            let folder: string | null = null;

            // Рекурсивный обход вложенных директорий
            const traverse = async (entry: FileSystemEntry) => {
                if (entry.isFile) {
                    const file = await new Promise<File>((res) =>
                        (entry as FileSystemFileEntry).file(res),
                    );
                    files.push(file);
                } else if (entry.isDirectory) {
                    folder ??= entry.name;
                    const reader = (entry as FileSystemDirectoryEntry).createReader();
                    const read = (): Promise<FileSystemEntry[]> =>
                        new Promise((res) => reader.readEntries(res));

                    let batch: FileSystemEntry[] = [];
                    do {
                        batch = await read();
                        await Promise.all(batch.map(traverse));
                    } while (batch.length);
                }
            };

            if (!entries.length) return onChange(null);

            await Promise.all(entries.map(traverse));

            const filtered = files.filter(matchFileType);
            if (!filtered.length) return onChange(null);

            const list = new DataTransfer();
            filtered.forEach((f) => list.items.add(f));
            onChange(list.files, folder ?? '');
        },
        [accept, onChange],
    );

    return (
        <>
            {/* Основная зона выбора файла / папки */}
            <div
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
                className={`flex-shrink-0 flex justify-center items-center mx-auto max-w-32 max-h-32 rounded-md border-2 border-dashed cursor-pointer transition-colors ${className}`}
                style={{
                    width: '6rem',
                    height: '6rem',
                    borderColor: theme['--primary-color'],
                    color: isActive ? '#fff' : theme['--primary-color'],
                    backgroundColor: isActive ? theme['--primary-color'] : 'transparent',
                    ...style,
                }}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="object-cover w-full h-full rounded-md"
                    />
                ) : (
                    placeholder
                )}
            </div>

            {/* Скрытый input для ручного выбора файлов */}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
                {...(directory ? { webkitdirectory: 'true' } : {})}
            />
        </>
    );
};

// Обёртка в memo для предотвращения лишних ререндеров
export const FilePicker = memo(FilePickerComponent);
FilePicker.displayName = 'FilePicker';
