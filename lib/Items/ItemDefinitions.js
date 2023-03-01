"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemId = exports.ItemName = exports.RarityName = void 0;
const config_1 = require("../config");
const TankBody_1 = require("../Entity/Tank/TankBody");
const ItemUtils_1 = require("./ItemUtils");
var RarityName;
(function (RarityName) {
    RarityName["Common"] = "common";
    RarityName["Rare"] = "rare";
    RarityName["Epic"] = "epic";
})(RarityName = exports.RarityName || (exports.RarityName = {}));
;
var ItemName;
(function (ItemName) {
    ItemName["transformTank"] = "Tank Transform";
    ItemName["droneSpawner"] = "2 Permanent Drones";
    ItemName["additionalStats"] = "1 Permanent Stat";
    ItemName["invulnerability"] = "20s Godmode";
    ItemName["damageAmplifier"] = "30s 2x Damage";
    ItemName["reloadAmplifier"] = "30s 2x Reload";
    ItemName["sacrificingAmplifier"] = "30s 2x Sacrificing";
    ItemName["healthAmplifier"] = "25% Health Boost";
    ItemName["fovAmplifier"] = "25% FoV Boost";
    ItemName["accuracyAmplifier"] = "25% Bullet Accuracy";
    ItemName["absoption"] = "30% Absorption";
    ItemName["trapWall"] = "Construct Trap Wall";
    ItemName["baseTp"] = "Teleport to Base";
    ItemName["minionSummon"] = "Summon a Minion";
    ItemName["instantHealth"] = "50% Instant Health";
    ItemName["droneSummon"] = "Summon 2 Drones";
    ItemName["invisibility"] = "90s Invisibility";
})(ItemName = exports.ItemName || (exports.ItemName = {}));
var ItemId;
(function (ItemId) {
    ItemId[ItemId["transformTank"] = 0] = "transformTank";
    ItemId[ItemId["droneSpawner"] = 1] = "droneSpawner";
    ItemId[ItemId["additionalStats"] = 2] = "additionalStats";
    ItemId[ItemId["invulnerability"] = 3] = "invulnerability";
    ItemId[ItemId["damageAmplifier"] = 4] = "damageAmplifier";
    ItemId[ItemId["reloadAmplifier"] = 5] = "reloadAmplifier";
    ItemId[ItemId["healthAmplifier"] = 6] = "healthAmplifier";
    ItemId[ItemId["fovAmplifier"] = 7] = "fovAmplifier";
    ItemId[ItemId["accuracyAmplifier"] = 8] = "accuracyAmplifier";
    ItemId[ItemId["absoption"] = 9] = "absoption";
    ItemId[ItemId["trapWall"] = 10] = "trapWall";
    ItemId[ItemId["baseTp"] = 11] = "baseTp";
    ItemId[ItemId["minionSummon"] = 12] = "minionSummon";
    ItemId[ItemId["instantHealth"] = 13] = "instantHealth";
    ItemId[ItemId["droneSummon"] = 14] = "droneSummon";
    ItemId[ItemId["invisibility"] = 15] = "invisibility";
    ItemId[ItemId["sacrificingAmplifier"] = 16] = "sacrificingAmplifier";
})(ItemId = exports.ItemId || (exports.ItemId = {}));
const ItemDefinitions = {
    "0": {
        name: ItemName.transformTank,
        rarityName: RarityName.Epic,
        onUse: (client, slot) => {
        }
    },
    "1": {
        name: ItemName.droneSpawner,
        rarityName: RarityName.Epic,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.droneSpawner.wantedDrones += 2;
            client.notify("You summoned two drones, they will keep respawning, this effect is permanent until you disconnect.");
            client.inventory.deleteItem(slot);
        }
    },
    "2": {
        name: ItemName.additionalStats,
        rarityName: RarityName.Epic,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.extraStatEffect += 1;
            client.camera.cameraData.statsAvailable += 1;
            client.notify("You unlocked one additional stat upgrade point, this effect is permanent until you disconnect.");
            client.inventory.deleteItem(slot);
        }
    },
    "3": {
        name: ItemName.invulnerability,
        rarityName: RarityName.Epic,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.invulnerabilityEffect += 20 * config_1.tps;
            client.inventory.deleteItem(slot);
        }
    },
    "4": {
        name: ItemName.damageAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.damageEffect += 30 * config_1.tps;
            client.inventory.deleteItem(slot);
        }
    },
    "5": {
        name: ItemName.reloadAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.reloadEffect += 30 * config_1.tps;
            client.inventory.deleteItem(slot);
        }
    },
    "6": {
        name: ItemName.healthAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.healthEffect += 0.25;
            client.inventory.deleteItem(slot);
        }
    },
    "7": {
        name: ItemName.fovAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            if (client.fovEffect >= 0.5)
                return client.notify("Unable to increase fov any further");
            client.fovEffect += 0.25;
            client.camera.setFieldFactor(client.camera.cameraData.player.definition.fieldFactor);
            client.inventory.deleteItem(slot);
        }
    },
    "8": {
        name: ItemName.accuracyAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            if (client.fovEffect >= 1)
                return client.notify("Unable to increase accuracy any further");
            client.accuracyEffect += 0.25;
            client.inventory.deleteItem(slot);
        }
    },
    "9": {
        name: ItemName.absoption,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.absorptionEffect += client.camera.cameraData.player.healthData.maxHealth * 0.5;
            client.inventory.deleteItem(slot);
        }
    },
    "10": {
        name: ItemName.trapWall,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            for (let i = -7; i < 7; ++i)
                new ItemUtils_1.TrapWall(client.camera.game, i * 0.05, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "11": {
        name: ItemName.baseTp,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default) || !client.spawnBase)
                return;
            client.camera.cameraData.player.positionData.x = client.spawnBase.positionData.x;
            client.camera.cameraData.player.positionData.y = client.spawnBase.positionData.y;
            client.camera.cameraData.player.setVelocity(0, 0);
            client.camera.cameraData.player.entityState |= 2 | 4;
            client.inventory.deleteItem(slot);
        }
    },
    "12": {
        name: ItemName.minionSummon,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            new ItemUtils_1.MinionSummon(client.camera.game, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "13": {
        name: ItemName.instantHealth,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.camera.cameraData.player.healthData.health += client.camera.cameraData.player.healthData.maxHealth * 0.5;
            client.inventory.deleteItem(slot);
        }
    },
    "14": {
        name: ItemName.droneSummon,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            for (let i = 0; i < 2; ++i)
                new ItemUtils_1.DroneSummon(client.camera.game, client.camera.cameraData.player);
            client.inventory.deleteItem(slot);
        }
    },
    "15": {
        name: ItemName.invisibility,
        rarityName: RarityName.Common,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.invisibilityEffect += 90 * config_1.tps;
            client.inventory.deleteItem(slot);
        }
    },
    "16": {
        name: ItemName.sacrificingAmplifier,
        rarityName: RarityName.Rare,
        onUse: (client, slot) => {
            if (!client.camera?.cameraData.player || !(client.camera.cameraData.player instanceof TankBody_1.default))
                return;
            client.sacrificingEffect += 30 * config_1.tps;
            client.inventory.deleteItem(slot);
        }
    }
};
exports.default = ItemDefinitions;
