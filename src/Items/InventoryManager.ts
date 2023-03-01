import Client from "../Client";
import { tps } from "../config";
import { ClientBound, Color, ColorsHexCode } from "../Const/Enums";
import { Entity } from "../Native/Entity";
import Item from "./Item";
import ItemDefinitions, { ItemDefinition, ItemId, RarityName } from "./ItemDefinitions";

export const MAX_ITEMS = 3;

const rarity: Record<RarityName, number> = {
    common: 0.1,
    rare: 0.2,
    epic: 0.3
}

export default class InventoryManager {
    public client: Client;
    public slots: ItemDefinition[] = [ItemDefinitions[ItemId.transformTank]];
    public isFirstItem: boolean = true;

    constructor(client: Client) {
        this.client = client;
    }

    canPickUpItem() {
        let count = 0;
        for(let i = 0; i < MAX_ITEMS; ++i) {
            if(this.slots[i]) ++count;
        }
        return count !== MAX_ITEMS;
    }

    pickupItem(item: Item) {
        let hasPickedUp = false;
        for(let i = 0; i < MAX_ITEMS; ++i) {
            if(!this.slots[i]) {
                this.slots[i] = item.definition;
                hasPickedUp = true;
                break;
            }
        }
        if(!hasPickedUp) return;
        item.destroy();
        item.pickupTimeout = Infinity;
        this.slots.sort((i1, i2) => (rarity[i1?.rarityName] || 1.1) - (rarity[i2?.rarityName] || 1.1));
        for(let i = 0; i < this.slots.length; ++i) this.sendSlotUpdate(i);
        if(this.isFirstItem) {
            this.isFirstItem = false;
            this.client.notify("You can use items via the keybinds or drop they via keybind + shift", ColorsHexCode[Color.TeamRed], 20000);
            this.client.notify("To change the keybinds check the diep console (cmd: util_set_slot_keybinds)", ColorsHexCode[Color.TeamRed], 20000);
        }
    }

    useItem(slot: number) {
        if(!this.client.camera?.cameraData.player || !this.slots[slot]) return;
        this.slots[slot].onUse(this.client, slot);
    }

    deleteItem(slot: number) {
        delete this.slots[slot];
        this.slots.sort((i1, i2) => (rarity[i1?.rarityName] || 1.1) - (rarity[i2?.rarityName] || 1.1));
        for(let i = 0; i < MAX_ITEMS; ++i) this.sendSlotUpdate(i);
    }

    dropItem(slot: number) {
        if(!this.client.camera?.cameraData.player || !this.client.camera.cameraData.player.positionData || !this.slots[slot]) return;
        const item = new Item(this.client.camera.game, this.slots[slot], 100, this.client.camera.cameraData.player.positionData.angle);
        item.positionData.x = this.client.camera.cameraData.player.positionData.x;
        item.positionData.y = this.client.camera.cameraData.player.positionData.y;
        item.pickupTimeout = tps * 5;
        this.deleteItem(slot);
    }

    sendSlotUpdate(slot: number, animation: null | number = null) {
        const item = this.slots[slot];
        const data = JSON.stringify(item ? ({ e: false, r: item.rarityName, n: item.name, a: animation }) : ({ e: true }));
        this.client.write()
            .u8(ClientBound.SetSlot)
            .u8(slot)
            .stringNT(data)
            .send();
    }

    sendInventoryUpdate() {
        this.client.write()
            .u8(ClientBound.SetInventory)
            .u8(Number(Entity.exists(this.client.camera?.cameraData.player)))
            .u8(Number(MAX_ITEMS))
            .send();
        for(let i = 0; i < MAX_ITEMS; ++i) this.sendSlotUpdate(i);
    }
}