import { describe, it, expect } from 'vitest';
import { add } from './fetchHello';

describe('add', () => {
    it('сложение 2 + 2', () => {
        expect(add(2, 2)).toBe(4);
    });
});
