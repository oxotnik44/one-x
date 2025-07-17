export async function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.src = URL.createObjectURL(file);

        audio.onloadedmetadata = () => {
            const duration = Math.round(audio.duration); // округляем до целых
            URL.revokeObjectURL(audio.src);
            resolve(duration);
        };

        audio.onerror = () => {
            resolve(0); // безопасная заглушка
        };
    });
}
