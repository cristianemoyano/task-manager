export const getInicials = (fullName: string) => {
    const words = fullName.split(' ');
    let initials = '';
    words.forEach((char: string) => {
        if (char.length > 0) {
            initials += char[0].toUpperCase();
        }
    });
    return initials;
}