export interface Track {
    id: string;
    title: string;
    duration: number;
    cover: string;
    albumId?: string;
    groupId: string;
    audioUrl: string;
    createdAt: string; // дата создания, ISO строка
    updatedAt?: string; // дата обновления, ISO строка (опционально)
}
