export interface Track {
    id: string;
    title: string;
    duration: number;
    cover: string;
    groupName?: string;
    albumId?: string;
    groupId: string;
    audioUrl: string;
    createdAt: string;
    updatedAt?: string;
}
