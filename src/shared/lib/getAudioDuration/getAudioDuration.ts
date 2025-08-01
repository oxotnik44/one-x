export const getAudioDuration = (file: File): Promise<number> =>
    new Promise((resolve) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.preload = 'metadata';

        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(audio.src);
            resolve(Math.round(audio.duration));
        };

        audio.onerror = () => resolve(0);
    });
