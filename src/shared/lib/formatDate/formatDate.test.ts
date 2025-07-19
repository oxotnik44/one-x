// src/shared/utils/formatDate.spec.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('должен форматировать строку ISO-даты в длинный формат по-русски для 1 января 2020', () => {
        // NBSP (\u202f) между годом и "г."
        expect(formatDate('2020-01-01')).toBe('1 января 2020\u202fг.');
    });

    it('должен форматировать другую дату, например 15 декабря 1995', () => {
        expect(formatDate('1995-12-15')).toBe('15 декабря 1995\u202fг.');
    });

    it('должен корректно обрабатывать некорректную дату', () => {
        // Для некорректной строки new Date(d) станет "Invalid Date", Intl отформатирует в "Invalid Date"
        expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
});
