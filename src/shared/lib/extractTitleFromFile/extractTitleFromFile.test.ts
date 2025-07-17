// src/shared/lib/extractTitleFromFile/extractTitleFromFile.test.ts
import { describe, it, expect } from 'vitest';
import { extractTitleFromFile } from './extractTitleFromFile';

describe('extractTitleFromFile', () => {
    it('удаляет расширение из имени файла', () => {
        const file = new File([], 'song.mp3');
        expect(extractTitleFromFile(file)).toBe('song');
    });

    it('работает с именем файла без расширения', () => {
        const file = new File([], 'filename');
        expect(extractTitleFromFile(file)).toBe('filename');
    });

    it('работает с несколькими точками в имени файла', () => {
        const file = new File([], 'my.song.file.wav');
        expect(extractTitleFromFile(file)).toBe('my.song.file');
    });
});
