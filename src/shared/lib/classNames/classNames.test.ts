import { describe, it, expect } from 'vitest';
import { classNames } from './classNames';

describe('classNames', () => {
    it('объединяет одиночные классы', () => {
        expect(classNames('foo', 'bar')).toBe('foo bar');
    });

    it('игнорирует falsy значения', () => {
        const condition = false;
        expect(classNames('foo', condition && 'bar', undefined, null, '')).toBe('foo');
    });

    it('обрабатывает условные классы', () => {
        expect(classNames('foo', { bar: true, baz: false })).toBe('foo bar');
    });

    it('объединяет и оптимизирует tailwind классы', () => {
        // tailwind-merge должен удалить дублирующиеся или конфликтующие классы
        expect(classNames('p-2 p-4')).toBe('p-4');
        expect(classNames('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
    });

    it('возвращает пустую строку если нет классов', () => {});
});
