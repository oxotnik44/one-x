import { memo, type InputHTMLAttributes, useCallback } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { classNames } from 'shared/lib';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'readOnly'>;

interface InputProps extends HTMLInputProps {
    value?: string | number;
    onChangeHandler?: (value: string) => void;
    autofocus?: boolean;
    readonly?: boolean;
    placeholder?: string;
    className?: string;
}

export const Input = memo(
    ({
        value,
        onChangeHandler,
        onChange,
        type = 'text',
        placeholder,
        autofocus,
        readonly,
        className,
        ...otherProps
    }: InputProps) => {
        const theme = useThemeStore((s) => s.theme);

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e);
                onChangeHandler?.(e.target.value);
            },
            [onChange, onChangeHandler],
        );

        return (
            <div className="relative w-full">
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    readOnly={readonly}
                    autoFocus={autofocus}
                    placeholder={placeholder}
                    style={{
                        borderColor: theme['--input-color'],
                        color: theme['--text-color'],
                        backgroundColor: readonly ? '#f3f3f3' : 'white',
                    }}
                    className={classNames(
                        'w-full px-4 py-2 border-2 rounded transition text-[16px] focus:outline-none placeholder:text-[color:var(--text-color)]',
                        readonly && 'cursor-not-allowed',
                        className,
                    )}
                    {...otherProps}
                />
            </div>
        );
    },
);

Input.displayName = 'Input';
