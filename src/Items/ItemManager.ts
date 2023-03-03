import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";
import { removeFast } from "../util";
import Item from "./Item";
import ItemDefinitions, { RarityName } from "./ItemDefinitions";


const COMMON_ITEMS = Object.values(ItemDefinitions).filter(e => e.rarityName === RarityName.Common);
const RARE_ITEMS = Object.values(ItemDefinitions).filter(e => e.rarityName === RarityName.Rare);
const EPIC_ITEMS = Object.values(ItemDefinitions).filter(e => e.rarityName === RarityName.Epic);

export class ItemManager {
    public game: GameServer;
    public arena: ArenaEntity;
    public items: Item[] = [];

    constructor(arena: ArenaEntity) {
        this.arena = arena;
        this.game = arena.game;
    }

    public spawnItem(): Item {
        const r = Math.random();
        let item;
        if(r < 0.05) {
            item = new Item(this.game, EPIC_ITEMS[0 | Math.random() * EPIC_ITEMS.length]);
        } else if(r < 0.3) {
            item = new Item(this.game, RARE_ITEMS[0 | Math.random() * RARE_ITEMS.length]);
        } else {
            item = new Item(this.game, COMMON_ITEMS[0 | Math.random() * COMMON_ITEMS.length]);
        }
        const offsetX = Math.random() * this.arena.width / 3;
        const offsetY = Math.random() * this.arena.height / 3;
        item.positionData.x = Math.random() > 0.5 ? offsetX : -offsetX;
        item.positionData.y = Math.random() > 0.5 ? offsetY : -offsetY;
        return item;
    }

    public get wantedItems() {
        return Math.ceil(this.game.clients.size / 2);
    }

    public tick() {
        for (let i = 0; i < this.wantedItems; ++i) {
            const shape = this.items[i];
            if(!shape) this.items.push(this.spawnItem());
            else if(shape.hash === 0) removeFast(this.items, i);
        }
    }
}