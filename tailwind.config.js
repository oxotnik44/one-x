/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Кастомные цвета
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                // Адаптивная типографика
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                // Fluid типографика
                'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
                'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
                'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
                'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.875rem)',
                'fluid-2xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
                'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 3rem)',
                'fluid-4xl': 'clamp(2.25rem, 1.8rem + 2.25vw, 3.75rem)',
            },
            spacing: {
                18: '4.5rem',
                88: '22rem',
                128: '32rem',
                // Адаптивные отступы на основе viewport
                'vw-1': '1vw',
                'vw-2': '2vw',
                'vw-3': '3vw',
                'vw-4': '4vw',
                'vw-5': '5vw',
                'vh-1': '1vh',
                'vh-2': '2vh',
                'vh-3': '3vh',
                'vh-4': '4vh',
                'vh-5': '5vh',
                // Fluid spacing
                'fluid-xs': 'clamp(0.5rem, 1vw, 1rem)',
                'fluid-sm': 'clamp(1rem, 2vw, 2rem)',
                'fluid-md': 'clamp(1.5rem, 3vw, 3rem)',
                'fluid-lg': 'clamp(2rem, 4vw, 4rem)',
                'fluid-xl': 'clamp(2.5rem, 5vw, 5rem)',
                'fluid-2xl': 'clamp(3rem, 6vw, 6rem)',
                // Container padding
                'container-padding': 'clamp(1rem, 2vw, 2rem)',
            },
            borderRadius: {
                none: '0',
                sm: '0.125rem',
                DEFAULT: '0.25rem',
                md: '0.375rem',
                lg: '0.5rem',
                xl: '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                full: '9999px',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'bounce-gentle': 'bounceGentle 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                },
            },
            screens: {
                xs: '320px', // Мелкие телефоны
                sm: '480px', // Телефоны
                md: '768px', // Планшеты
                lg: '1024px', // Ноутбуки
                xl: '1280px', // Десктопы
                '2xl': '1440px', // Большие мониторы
                '3xl': '1920px', // Full HD мониторы
                '4xl': '2560px', // 2K мониторы
                // Container queries для компонентов
                'container-sm': '24rem', // 384px
                'container-md': '32rem', // 512px
                'container-lg': '48rem', // 768px
                'container-xl': '64rem', // 1024px
                // Высота экрана
                'h-sm': { raw: '(min-height: 640px)' },
                'h-md': { raw: '(min-height: 768px)' },
                'h-lg': { raw: '(min-height: 1024px)' },
            },
            zIndex: {
                60: '60',
                70: '70',
                80: '80',
                90: '90',
                100: '100',
            },
        },
    },
    plugins: [
        // Раскомментируйте нужные плагины
        // require('@tailwindcss/forms'),
        // require('@tailwindcss/typography'),
        // require('@tailwindcss/aspect-ratio'),
        // require('@tailwindcss/container-queries'),

        // Кастомные утилиты для адаптивности
        function ({ addUtilities }) {
            const newUtilities = {
                // Safe area для мобильных устройств
                '.safe-top': {
                    'padding-top': 'env(safe-area-inset-top)',
                },
                '.safe-bottom': {
                    'padding-bottom': 'env(safe-area-inset-bottom)',
                },
                '.safe-left': {
                    'padding-left': 'env(safe-area-inset-left)',
                },
                '.safe-right': {
                    'padding-right': 'env(safe-area-inset-right)',
                },
                '.safe-x': {
                    'padding-left': 'env(safe-area-inset-left)',
                    'padding-right': 'env(safe-area-inset-right)',
                },
                '.safe-y': {
                    'padding-top': 'env(safe-area-inset-top)',
                    'padding-bottom': 'env(safe-area-inset-bottom)',
                },
                // Контейнеры с адаптивной шириной
                '.container-fluid': {
                    width: '100%',
                    'padding-left': 'clamp(1rem, 2vw, 2rem)',
                    'padding-right': 'clamp(1rem, 2vw, 2rem)',
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                },
                '.container-constrained': {
                    'max-width': '1200px',
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                    'padding-left': 'clamp(1rem, 2vw, 2rem)',
                    'padding-right': 'clamp(1rem, 2vw, 2rem)',
                },
                // Responsive grid
                '.grid-responsive': {
                    display: 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                },
                '.grid-responsive-sm': {
                    display: 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'clamp(0.75rem, 1.5vw, 1.5rem)',
                },
                '.grid-responsive-lg': {
                    display: 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: 'clamp(1.5rem, 3vw, 3rem)',
                },
                // Touch-friendly размеры
                '.touch-target': {
                    'min-height': '44px',
                    'min-width': '44px',
                },
                '.touch-target-lg': {
                    'min-height': '56px',
                    'min-width': '56px',
                },
                // Скрытие скроллбаров
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
                // Fluid containers
                '.w-fluid': {
                    width: 'clamp(300px, 90vw, 1200px)',
                },
                '.h-screen-safe': {
                    height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
                },
            };
            addUtilities(newUtilities);
        },
    ],
    darkMode: 'class', // или 'media' для автоматического переключения
};
