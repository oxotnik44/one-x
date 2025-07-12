import type { Genre } from 'entities/Group/model/types/group';

export interface CreateGroupFormData {
    name: string;
    description: string;
    icon: FileList | null;
    genre?: Genre;
}
