export const extractTitleFromFile = (file: File): string => file.name.replace(/\.[^/.]+$/, '');
