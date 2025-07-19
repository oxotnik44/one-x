export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return (
        new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
            .format(date)
            // Заменяем *пробел перед "г."* на узкий неразрывный пробел
            .replace(/ г\.$/, '\u202fг.')
    );
};
