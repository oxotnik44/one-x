export function extractTitleFromFile(file: File): string {
    return file.name.replace(/\.[^/.]+$/, '');
}
