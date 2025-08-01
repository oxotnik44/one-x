export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(+date)) return 'Invalid Date';

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
        .format(date)
        .replace(/ г\.$/, '\u202fг.');
};
