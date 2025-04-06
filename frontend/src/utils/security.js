export const generateHash = (input) => {
    return btoa(input).replace(/=/g, '');
};

export const validateInput = (input) => {
    return typeof input === 'string' && input.length > 0;
};
