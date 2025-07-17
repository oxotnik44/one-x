// Исправленный тест
import { describe, it, expect } from 'vitest';
import i18n from './i18n';

describe('i18n инициализация', () => {
    it('должен иметь fallbackLng, содержащий "ru"', () => {
        const fallback = i18n.options.fallbackLng;
        if (Array.isArray(fallback)) {
            expect(fallback).toContain('ru');
        } else {
            expect(fallback).toBe('ru');
        }
    });

    it('поддерживаемые языки содержат ru и en', () => {
        expect(i18n.options.supportedLngs).toContain('ru');
        expect(i18n.options.supportedLngs).toContain('en');
    });

    it('должен использовать namespace common по умолчанию', () => {
        expect(i18n.options.defaultNS).toBe('common');
        expect(i18n.options.ns).toContain('common');
    });
});
