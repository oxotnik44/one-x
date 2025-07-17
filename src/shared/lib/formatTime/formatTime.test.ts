// src/shared/lib/formatTime/formatTime.test.ts
import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
    it('корректно форматирует время меньше минуты', () => {
        expect(formatTime(45)).toBe('0:45');
    });

    it('корректно форматирует время больше минуты', () => {
        expect(formatTime(75)).toBe('1:15');
    });

    it('добавляет ведущий ноль для секунд меньше 10', () => {
        expect(formatTime(125)).toBe('2:05');
    });

    it('корректно форматирует ровно минуты', () => {
        expect(formatTime(120)).toBe('2:00');
    });
});
