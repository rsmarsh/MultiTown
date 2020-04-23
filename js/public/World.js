import * as utils from './utilities.js';

class World {
    constructor(props) {
        this.sceneRef = props.sceneRef;

    }

    onScreenMessage (text, seconds) {

        // only one message at once currently
        if (this.messageDisplayed) {
            return;
        }
        this.messageDisplayed = true;
        let message = this.sceneRef.add.text(window.game.scale.width/2, window.game.scale.height/2, text, { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",  
            color: '#FFCCCC'
        });
        message.setOrigin(0.5);
        var timer = this.sceneRef.time.delayedCall(seconds*1000, function(){
            message.destroy();
            this.messageDisplayed = false;
        }, null, this); 
            
    }
};


export default World;