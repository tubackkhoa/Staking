


export const getRandom = (min = 0, max) => Math.floor(Math.random() * (max - min)) + min;


export const utils = {
    getRandom,
}