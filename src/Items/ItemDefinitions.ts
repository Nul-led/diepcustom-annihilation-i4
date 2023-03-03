import Client from "../Client";
import { tps } from "../config";
import { DevTank } from "../Const/DevTankDefinitions";
import TankBody from "../Entity/Tank/TankBody";
import { EntityStateFlags } from "../Native/Entity";
import Item from "./Item";
import { DroneSummon, MinionSummon, TrapWall } from "./ItemUtils";

export enum RarityName {
    Common  = "common",
    Rare    = "rare",
    Epic    = "epic",
};

export enum ItemName {
    transformTank           = "Tank Transform",
    droneSpawner            = "2 Respawning Drones",
    additionalStats         = "1 Permanent Stat",
    invulnerability         = "20s God Mode",
    
    damageAmplifier         = "30s 1.5x Damage",
    reloadAmplifier         = "30s 1.5x Reload",
    sacrificingAmplifier    = "30s 2x Sacrificing",
    healthAmplifier         = "25% Health Boost",
    fovAmplifier            = "10% FoV Boost",
    accuracyAmplifier       = "25% Bullet Accuracy",

    absoption               = "30% Absorption",
    trapWall                = "Construct Trap Wall",
    baseTp                  = "Teleport to Base",
    minionSummon            = "Summon a Minion",
    instantHealth           = "50% Instant Health",
    droneSummon             = "Summon 2 Drones",
    invisibility            = "90s Invisibility",
}

export enum ItemId {
    transformTank       = 0,
    droneSpawner        = 1,
    additionalStats     = 2,
    invulnerability     = 3,
    damageAmplifier     = 4,
    reloadAmplifier     = 5,
    healthAmplifier     = 6,
    fovAmplifier        = 7,
    accuracyAmplifier   = 8,
    absoption           = 9,
    trapWall            = 10,
    baseTp              = 11,
    minionSummon        = 12,
    instantHealth       = 13,
    droneSummon         = 14,
    invisibility        = 15,
    sacrificingAmplifier = 16,
}


export interface ItemDefinition {
    name: string,
    rarityName: RarityName,
    onUse: (client: Client, slot: number) => void
    onPickup?: (client: Client, item: Item) => void
}

const ItemDefinitions: Record<ItemId, ItemDefinition> = {
    "0": {
        name: ItemName.transformTank,
        rarityName: RarityName.Epic,
        onPickup: (client: Client, item: Item) => {
            client.notify("You may now use this item to transform to the special tank 'Vortex'. This item has unlimited uses.");
        },
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody) || client.camera.cameraData.player.currentTank === DevTank.Vortex) return;
            client.camera.cameraData.player.setTank(DevTank.Vortex);
        }
    },
    "1": {
        name: ItemName.droneSpawner,
        rarityName: RarityName.Epic,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.droneSpawner.wantedDrones += 2;
            client.notify("You summoned two drones, they will keep respawning, this effect is permanent until you die.");
            client.inventory.deleteItem(slot);
        }
    },
    "2": {
        name: ItemName.additionalStats,
        rarityName: RarityName.Epic,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.extraStatEffect += 1;
            client.camera.cameraData.statsAvailable += 1;
            client.notify("You unlocked one additional stat upgrade point, this effect is permanent until you disconnect.");
            client.inventory.deleteItem(slot);
        }
    },
    "3": {
        name: ItemName.invulnerability,
        rarityName: RarityName.Epic,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.invulnerabilityEffect += 20 * tps;
            client.inventory.deleteItem(slot);
        }
    },
    "4": {
        name: ItemName.damageAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.damageEffect += 30 * tps;
            client.inventory.deleteItem(slot);
        }
    },
    "5": {
        name: ItemName.reloadAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.reloadEffect += 30 * tps;
            client.inventory.deleteItem(slot);
        }
    },
    "6": {
        name: ItemName.healthAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.healthEffect += 0.25;
            client.inventory.deleteItem(slot);
        }
    },
    "7": {
        name: ItemName.fovAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            if(client.fovEffect >= 0.5) return client.notify("Unable to increase fov any further");
            client.fovEffect += 0.10;
            client.camera.setFieldFactor(client.camera.cameraData.player.definition.fieldFactor);
            client.inventory.deleteItem(slot);
        }
    },
    "8": {
        name: ItemName.accuracyAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            if(client.accuracyEffect >= 1) return client.notify("Unable to increase accuracy any further");
            client.accuracyEffect += 0.25;
            client.inventory.deleteItem(slot);
        }
    },
    "9": {
        name: ItemName.absoption,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.absorptionEffect += client.camera.cameraData.player.healthData.maxHealth * 0.5;
            client.inventory.deleteItem(slot);
        }
    },
    "10": {
        name: ItemName.trapWall,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            for(let i = -7; i < 7; ++i) new TrapWall(client.camera.game, i * 0.05, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "11": {
        name: ItemName.baseTp,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody) || !client.spawnBase) return;
            client.camera.cameraData.player.positionData.x = client.spawnBase.positionData.x;
            client.camera.cameraData.player.positionData.y = client.spawnBase.positionData.y;
            client.camera.cameraData.player.setVelocity(0, 0);
            client.camera.cameraData.player.entityState |= EntityStateFlags.needsCreate | EntityStateFlags.needsDelete;
            client.inventory.deleteItem(slot);
        }
    },
    "12": {
        name: ItemName.minionSummon,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            new MinionSummon(client.camera.game, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "13": {
        name: ItemName.instantHealth,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.camera.cameraData.player.healthData.health += client.camera.cameraData.player.healthData.maxHealth * 0.5;
            client.inventory.deleteItem(slot);
        }
    },
    "14": {
        name: ItemName.droneSummon,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            for(let i = 0; i < 2; ++i) new DroneSummon(client.camera.game, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "15": {
        name: ItemName.invisibility,
        rarityName: RarityName.Common,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.invisibilityEffect += 90 * tps;
            client.inventory.deleteItem(slot);            
        }
    },
    "16": {
        name: ItemName.sacrificingAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client: Client, slot: number) => {
            if(!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody)) return;
            client.sacrificingEffect += 30 * tps;
            client.inventory.deleteItem(slot);
        }
    }
};

export default ItemDefinitions;