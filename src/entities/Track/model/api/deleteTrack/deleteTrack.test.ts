import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { deleteTrack } from './deleteTrack';
import { apiBase, apiJson } from 'shared/api';
import { useTrackStore } from '../../slice/useTrackStore';

// Моки
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));
vi.mock('shared/api', () => ({
    apiBase: { delete: vi.fn() },
    apiJson: { delete: vi.fn() },
}));
vi.mock('../../slice/useTrackStore', () => ({
    useTrackStore: { getState: vi.fn() },
}));

describe('deleteTrack', () => {
    const groupName = 'my group';
    const trackName = 'track/one';
    const trackId = '123';

    let removeTrackMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // настроим removeTrack
        removeTrackMock = vi.fn();
        (useTrackStore.getState as Mock).mockReturnValue({
            removeTrack: removeTrackMock,
        });

        // по умолчанию оба запроса успешны
        (apiBase.delete as Mock).mockResolvedValue(undefined);
        (apiJson.delete as Mock).mockResolvedValue(undefined);
    });

    it('должен успешно удалить трек, вызвать оба API и обновить стор', async () => {
        await deleteTrack(groupName, trackName, trackId);

        // проверяем вызов apiBase.delete с корректным урлом
        expect(apiBase.delete).toHaveBeenCalledWith(
            `/deleteTrack/${encodeURIComponent(groupName)}/${encodeURIComponent(trackName)}`,
        );
        // проверяем вызов apiJson.delete
        expect(apiJson.delete).toHaveBeenCalledWith(`/tracks/${trackId}`);
        // стор обновился
        expect(removeTrackMock).toHaveBeenCalledWith(trackId);
        // успех-тост
        expect(toast.success).toHaveBeenCalledWith(`Трек "${trackName}" успешно удалён!`);
    });

    it('должен показать ошибку при неуспехе и не обновлять стор', async () => {
        const error = new Error('network failed');
        (apiBase.delete as Mock).mockRejectedValue(error);

        await deleteTrack(groupName, trackName, trackId);

        // removeTrack не должен вызываться
        expect(removeTrackMock).not.toHaveBeenCalled();
        // ошибка в консоли и тост
        expect(toast.error).toHaveBeenCalledWith(error.message);
    });
});
