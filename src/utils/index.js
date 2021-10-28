export const getRandom = (min = 0, max) => Math.floor(Math.random() * (max - min)) + min;

export const parseMoneyInput = (value, currency = '') => {
    return `${currency}${value
        .replace(/(?!\.)\D/g, '')
        .replace(/(?<=\..*)\./g, '')
        .replace(/(?<=\.\d\d).*/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const utils = {
    getRandom,
}