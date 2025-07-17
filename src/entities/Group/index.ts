export type { Genre, GroupSchema, Group } from './model/types/group';
export { genresList } from './model/types/group';
export { createGroup } from './model/api/createGroup/createGroup';
export { editGroup } from './model/api/editGroup/editGroup';
export { fetchGroup } from './model/api/fetchGroup/fetchGroup';
export { useGroupStore } from './model/slice/useGroupStore';
