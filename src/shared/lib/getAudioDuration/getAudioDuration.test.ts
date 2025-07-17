// src/shared/lib/getAudioDuration/getAudioDuration.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getAudioDuration } from './getAudioDuration';

describe('getAudioDuration', () => {
    it('возвращает длительность аудио (округлённую)', async () => {
        // Мокаем createObjectURL и revokeObjectURL
        const mockUrl = 'blob:mocked-url';
        global.URL.createObjectURL = vi.fn(() => mockUrl);
        global.URL.revokeObjectURL = vi.fn();

        // Мокаем audio элемент и его события
        const listeners: Record<string, () => void> = {};
        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'audio') {
                return {
                    preload: '',
                    src: '',
                    duration: 123.7,
                    set onloadedmetadata(cb: () => void) {
                        listeners['loadedmetadata'] = cb;
                    },
                    set onerror(cb: () => void) {
                        listeners['error'] = cb;
                    },
                    dispatchEvent(event: Event) {
                        const type = event.type;
                        listeners[type]?.();
                    },
                } as unknown as HTMLAudioElement;
            }
            // Для других тегов можно вернуть настоящий элемент или заглушку
            return document.createElement(tagName);
        });

        const file = new File([], 'test.mp3');

        // Запускаем getAudioDuration
        const promise = getAudioDuration(file);

        // Триггерим событие loadedmetadata
        listeners['loadedmetadata']();

        const duration = await promise;

        expect(duration).toBe(124); // округлено с 123.7

        expect(URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });

    it('возвращает 0 при ошибке загрузки', async () => {
        global.URL.createObjectURL = vi.fn(() => 'blob:mocked-url');
        global.URL.revokeObjectURL = vi.fn();

        const listeners: Record<string, () => void> = {};
        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'audio') {
                return {
                    preload: '',
                    src: '',
                    set onloadedmetadata(cb: () => void) {
                        listeners['loadedmetadata'] = cb;
                    },
                    set onerror(cb: () => void) {
                        listeners['error'] = cb;
                    },
                    dispatchEvent(event: Event) {
                        const type = event.type;
                        listeners[type]?.();
                    },
                } as unknown as HTMLAudioElement;
            }
            return document.createElement(tagName);
        });

        const file = new File([], 'bad.mp3');

        const promise = getAudioDuration(file);

        // Триггерим событие error
        listeners['error']();

        const duration = await promise;

        expect(duration).toBe(0);
    });
});
