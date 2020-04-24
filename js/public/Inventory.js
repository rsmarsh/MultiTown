class Inventory {
    constructor(config) {
        this.slots = config.items;
    }

    addToInventory(item, slot){
        this.slots[slot] = item;
    }

    isSlotEmpty(slot) {
        return this.slots[slot] === undefined;
    }

    retrieveItem(slot) {
        return this.slots[slot];
    }
}

export default Inventory;