"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemManager = void 0;
const util_1 = require("../util");
const Item_1 = require("./Item");
const ItemDefinitions_1 = require("./ItemDefinitions");
const COMMON_ITEMS = Object.values(ItemDefinitions_1.default).filter(e => e.rarityName === ItemDefinitions_1.RarityName.Common);
const RARE_ITEMS = Object.values(ItemDefinitions_1.default).filter(e => e.rarityName === ItemDefinitions_1.RarityName.Rare);
const EPIC_ITEMS = Object.values(ItemDefinitions_1.default).filter(e => e.rarityName === ItemDefinitions_1.RarityName.Epic);
class ItemManager {
    constructor(arena) {
        this.items = [];
        this.arena = arena;
        this.game = arena.game;
    }
    spawnItem() {
        const r = Math.random();
        let item;
        if (r < 0.05) {
            item = new Item_1.default(this.game, EPIC_ITEMS[0 | Math.random() * EPIC_ITEMS.length]);
        }
        else if (r < 0.3) {
            item = new Item_1.default(this.game, RARE_ITEMS[0 | Math.random() * RARE_ITEMS.length]);
        }
        else {
            item = new Item_1.default(this.game, COMMON_ITEMS[0 | Math.random() * COMMON_ITEMS.length]);
        }
        const offsetX = Math.random() * this.arena.width / 4;
        const offsetY = Math.random() * this.arena.height / 4;
        item.positionData.x = Math.random() > 0.5 ? offsetX : -offsetX;
        item.positionData.y = Math.random() > 0.5 ? offsetY : -offsetY;
        return item;
    }
    get wantedItems() {
        return Math.ceil(this.game.clients.size / 2);
    }
    tick() {
        for (let i = 0; i < this.wantedItems; ++i) {
            const shape = this.items[i];
            if (!shape)
                this.items.push(this.spawnItem());
            else if (shape.hash === 0)
                (0, util_1.removeFast)(this.items, i);
        }
    }
}
exports.ItemManager = ItemManager;
