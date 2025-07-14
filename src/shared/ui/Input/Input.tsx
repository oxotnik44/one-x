import { memo, type InputHTMLAttributes } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'readOnly'>;

interface InputProps extends HTMLInputProps {
    value?: string | number;
    onChangeHandler?: (value: string) => void;
    autofocus?: boolean;
    readonly?: boolean;
    placeholder?: string;
    className?: string;
}

export const Input = memo((props: InputProps) => {
    const {
        value,
        onChangeHandler,
        onChange,
        type = 'text',
        placeholder,
        autofocus,
        readonly,
        className,
        ...otherProps
    } = props;

    const theme = useThemeStore((state) => state.theme);

    return (
        <div className="relative w-full">
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    onChange?.(e);
                    onChangeHandler?.(e.target.value);
                }}
                readOnly={readonly}
                autoFocus={autofocus}
                placeholder={placeholder}
                style={{
                    borderColor: theme['--input-color'],
                    color: theme['--text-color'],
                    backgroundColor: readonly ? '#f3f3f3' : 'white',
                }}
                className={[
                    'w-full',
                    'px-4',
                    'py-2',
                    'border-2',
                    'rounded',
                    'transition',
                    'text-[16px]',
                    'placeholder:text-[color:var(--text-color)]',
                    'focus:outline-none',
                    readonly ? 'cursor-not-allowed' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...otherProps}
            />
        </div>
    );
});
Input.displayName = 'Input';
