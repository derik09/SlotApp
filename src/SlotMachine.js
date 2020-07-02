import { SlotNew } from './SlotNew.js';

class SlotMachine {

    // Method to initialize the data
    draw = () => {
        let slotNew = new SlotNew();
        slotNew.createCanvasWithReels();
    }    
}

let x = new SlotMachine();
x.draw();