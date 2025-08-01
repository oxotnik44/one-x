// src/shared/lib/getAudioDuration/getAudioDuration.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getAudioDuration } from './getAudioDuration';

describe('getAudioDuration', () => {
    it('возвращает длительность аудио (округлённую)', async () => {
        const mockUrl = 'blob:mocked-url';
        global.URL.createObjectURL = vi.fn(() => mockUrl);
        global.URL.revokeObjectURL = vi.fn();

        // Мокаем Audio так, чтобы он запоминал переданный URL
        vi.stubGlobal(
            'Audio',
            vi.fn((url: string) => ({
                preload: '',
                src: url, // ← возвращаем конструкторский аргумент
                duration: 123.7,
                set onloadedmetadata(cb: () => void) {
                    setTimeout(cb, 0);
                },
                set onerror(_: () => void) {},
            })) as unknown as typeof Audio,
        );

        const file = new File([], 'test.mp3');
        const duration = await getAudioDuration(file);

        expect(duration).toBe(124);
        expect(URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });

    it('возвращает 0 при ошибке загрузки', async () => {
        const mockUrl = 'blob:mocked-url';
        global.URL.createObjectURL = vi.fn(() => mockUrl);
        global.URL.revokeObjectURL = vi.fn();

        vi.stubGlobal(
            'Audio',
            vi.fn((url: string) => ({
                preload: '',
                src: url,
                duration: 0,
                set onloadedmetadata(_: () => void) {},
                set onerror(cb: () => void) {
                    setTimeout(cb, 0);
                },
            })) as unknown as typeof Audio,
        );

        const file = new File([], 'bad.mp3');
        const duration = await getAudioDuration(file);

        expect(duration).toBe(0);
        expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    });
});
