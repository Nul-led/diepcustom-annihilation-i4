"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MazeWall_1 = require("../Entity/Misc/MazeWall");
const TeamNexus_1 = require("../Entity/Misc/TeamNexus");
const Object_1 = require("../Entity/Object");
const TankBody_1 = require("../Entity/Tank/TankBody");
const Camera_1 = require("../Native/Camera");
const FieldGroups_1 = require("../Native/FieldGroups");
const ItemDefinitions_1 = require("./ItemDefinitions");
class Item extends Object_1.default {
    constructor(game, definition, baseAccel, baseAngle) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.pickupTimeout = 0;
        this.physicsData.size = 50;
        this.physicsData.pushFactor = 0;
        this._accel = baseAccel || 0;
        this._angle = baseAngle || 0;
        this.spawnTick = game.tick;
        this.definition = definition;
        switch (definition.rarityName) {
            case ItemDefinitions_1.RarityName.Common: {
                this.styleData.color = 19;
                this.physicsData.sides = 3;
                this.nameData.name = "Common Item";
                break;
            }
            case ItemDefinitions_1.RarityName.Rare: {
                this.styleData.color = 20;
                this.physicsData.sides = 4;
                this.nameData.name = "Rare Item";
                break;
            }
            case ItemDefinitions_1.RarityName.Epic: {
                this.styleData.color = 21;
                this.physicsData.sides = 5;
                this.nameData.name = "Epic Item";
                break;
            }
        }
    }
    onPickup(collector) {
        if (!(collector.cameraEntity instanceof Camera_1.default))
            return;
        if (!collector.cameraEntity.client.inventory.canPickUpItem())
            return;
        collector.cameraEntity.client.inventory.pickupItem(this);
    }
    tick(tick) {
        if (tick === this.spawnTick + 1)
            this.addAcceleration(this._angle, this._accel);
        this.positionData.angle = -(tick * 0.01);
        this.velocity.setPosition(this.positionData.values);
        this.deletionAnimation?.tick();
        if (this.pickupTimeout)
            --this.pickupTimeout;
        if (!this.deletionAnimation) {
            const collidedEntities = this.findCollisions();
            for (const entity of collidedEntities) {
                if (!this.pickupTimeout && entity.cameraEntity && entity instanceof TankBody_1.default) {
                    this.onPickup(entity);
                    break;
                }
                if (entity instanceof MazeWall_1.default || entity instanceof TeamNexus_1.default || entity instanceof TeamNexus_1.NexusShield) {
                    this.receiveKnockback(entity);
                }
            }
        }
        if (this.isViewed)
            for (let i = 0; i < this.children.length; ++i)
                this.children[i].tick(tick);
    }
}
exports.default = Item;
