"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ITEMS = void 0;
const config_1 = require("../config");
const Enums_1 = require("../Const/Enums");
const Entity_1 = require("../Native/Entity");
const Item_1 = require("./Item");
const ItemDefinitions_1 = require("./ItemDefinitions");
exports.MAX_ITEMS = 3;
const rarity = {
    common: 0.1,
    rare: 0.2,
    epic: 0.3
};
class InventoryManager {
    constructor(client) {
        this.slots = [ItemDefinitions_1.default[ItemDefinitions_1.ItemId.transformTank], ItemDefinitions_1.default[ItemDefinitions_1.ItemId.minionSummon]];
        this.isFirstItem = true;
        this.client = client;
    }
    canPickUpItem() {
        let count = 0;
        for (let i = 0; i < exports.MAX_ITEMS; ++i) {
            if (this.slots[i])
                ++count;
        }
        return count !== exports.MAX_ITEMS;
    }
    pickupItem(item) {
        let hasPickedUp = false;
        for (let i = 0; i < exports.MAX_ITEMS; ++i) {
            if (!this.slots[i]) {
                this.slots[i] = item.definition;
                hasPickedUp = true;
                break;
            }
        }
        if (!hasPickedUp)
            return;
        item.destroy();
        item.pickupTimeout = Infinity;
        this.slots.sort((i1, i2) => (rarity[i1?.rarityName] || 1.1) - (rarity[i2?.rarityName] || 1.1));
        for (let i = 0; i < this.slots.length; ++i)
            this.sendSlotUpdate(i);
        if (this.isFirstItem) {
            this.isFirstItem = false;
            this.client.notify("You can use items via the keybinds or drop they via keybind + shift", Enums_1.ColorsHexCode[4], 20000);
            this.client.notify("To change the keybinds check the diep console (cmd: util_set_slot_keybinds)", Enums_1.ColorsHexCode[4], 20000);
        }
    }
    useItem(slot) {
        if (!this.client.camera?.cameraData.player || !this.slots[slot])
            return;
        this.slots[slot].onUse(this.client, slot);
    }
    deleteItem(slot) {
        delete this.slots[slot];
        this.slots.sort((i1, i2) => (rarity[i1?.rarityName] || 1.1) - (rarity[i2?.rarityName] || 1.1));
        for (let i = 0; i < exports.MAX_ITEMS; ++i)
            this.sendSlotUpdate(i);
    }
    dropItem(slot) {
        if (!this.client.camera?.cameraData.player || !this.client.camera.cameraData.player.positionData || !this.slots[slot])
            return;
        const item = new Item_1.default(this.client.camera.game, this.slots[slot], 100, this.client.camera.cameraData.player.positionData.angle);
        item.positionData.x = this.client.camera.cameraData.player.positionData.x;
        item.positionData.y = this.client.camera.cameraData.player.positionData.y;
        item.pickupTimeout = config_1.tps * 5;
        this.deleteItem(slot);
    }
    sendSlotUpdate(slot, animation = null) {
        const item = this.slots[slot];
        const data = JSON.stringify(item ? ({ e: false, r: item.rarityName, n: item.name, a: animation }) : ({ e: true }));
        this.client.write()
            .u8(31)
            .u8(slot)
            .stringNT(data)
            .send();
    }
    sendInventoryUpdate() {
        this.client.write()
            .u8(30)
            .u8(Number(Entity_1.Entity.exists(this.client.camera?.cameraData.player)))
            .u8(Number(exports.MAX_ITEMS))
            .send();
        for (let i = 0; i < exports.MAX_ITEMS; ++i)
            this.sendSlotUpdate(i);
    }
}
exports.default = InventoryManager;
