//generates a random colour between #000000 and #ffffff
export function getRandomColour(){
    return '0x'
        +Math.floor(Math.random()*16).toString(16)+''
        +Math.floor(Math.random()*16).toString(16)+''
        +Math.floor(Math.random()*16).toString(16)+''
        +Math.floor(Math.random()*16).toString(16)+''
        +Math.floor(Math.random()*16).toString(16)+''
        +Math.floor(Math.random()*16).toString(16);
};