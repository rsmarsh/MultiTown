//generates a random colour between #000000 and #ffffff
export function getRandomColour(prefix){
    // default to 0x, but allow for # colour prefixes
    prefix = prefix || '0x';

    return prefix
    +Math.floor(Math.random()*16).toString(16)+''
    +Math.floor(Math.random()*16).toString(16)+''
    +Math.floor(Math.random()*16).toString(16)+''
    +Math.floor(Math.random()*16).toString(16)+''
    +Math.floor(Math.random()*16).toString(16)+''
    +Math.floor(Math.random()*16).toString(16);
};