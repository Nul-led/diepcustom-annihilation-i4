"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinionSummon = exports.TrapWall = exports.DroneSummon = exports.DroneSpawner = void 0;
const config_1 = require("../config");
const AI_1 = require("../Entity/AI");
const Live_1 = require("../Entity/Live");
const Barrel_1 = require("../Entity/Tank/Barrel");
const Drone_1 = require("../Entity/Tank/Projectile/Drone");
const Minion_1 = require("../Entity/Tank/Projectile/Minion");
const Camera_1 = require("../Native/Camera");
const Entity_1 = require("../Native/Entity");
const util_1 = require("../util");
class DroneSpawner {
    constructor(game) {
        this.drones = [];
        this.wantedDrones = 0;
        this.game = game;
    }
    tick(tank) {
        for (let i = 0; i < this.wantedDrones; ++i) {
            const drone = this.drones[i];
            if (!drone || drone.hash === 0)
                this.drones[i] = new DroneSummon(this.game, tank);
        }
    }
}
exports.DroneSpawner = DroneSpawner;
class DroneSummon extends Live_1.default {
    constructor(game, tank) {
        super(game);
        this.restCycle = true;
        this.baseAccel = 16;
        this.movementAngle = false;
        this.tank = tank;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2;
        this.physicsData.sides = 3;
        this.physicsData.size = 30;
        this.physicsData.flags |= 32;
        this.styleData.flags |= 128;
        this.healthData.values.flags |= 1;
        this.physicsData.pushFactor = 4;
        this.physicsData.absorbtionFactor = 1;
        this.damagePerTick = 16;
        this.healthData.maxHealth = this.healthData.health = 300;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.positionData.x = tank.positionData.x;
        this.positionData.y = tank.positionData.y;
        this.styleData.color = this.tank.styleData.color;
        this.relationsData.team = this.relationsData.owner = tank.relationsData.team;
        this.positionData.flags |= 2;
    }
    tick(tick) {
        super.tick(tick);
        if (!Entity_1.Entity.exists(this.tank))
            return this.destroy();
        this.baseAccel = 16 * this.tank.cameraEntity.cameraData.movementSpeed;
        if (this.ai.state === 0) {
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            const base = this.baseAccel;
            let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone_1.default.MAX_RESTING_RADIUS;
            if (unitDist <= 1 && this.restCycle) {
                this.baseAccel /= 6;
                this.positionData.angle += 0.01 + 0.012 * unitDist;
            }
            else {
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.y;
                this.positionData.angle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.5)
                    this.baseAccel /= 3;
                this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (this.tank.physicsData.values.size ** 2);
            }
            this.baseAccel = base;
        }
        else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false;
        }
        this.maintainVelocity(this.movementAngle === false ? this.positionData.values.angle : Number(this.movementAngle), this.ai.target ? this.baseAccel / 1.5 : this.baseAccel);
    }
}
exports.DroneSummon = DroneSummon;
class TrapWall extends Live_1.default {
    constructor(game, angle, owner) {
        super(game);
        this.relationsData.team = this.relationsData.owner = owner.relationsData.team;
        this.styleData.color = owner.styleData.color;
        this.positionData.x = owner.positionData.x;
        this.positionData.y = owner.positionData.y;
        this.spawnTick = game.tick;
        this.angle = owner.positionData.angle + angle;
        this.physicsData.sides = 3;
        this.physicsData.size = 30;
        this.physicsData.flags |= 8;
        this.styleData.flags |= 32 | 16 | 128;
        this.damagePerTick = 1;
        this.physicsData.pushFactor = 2;
        this.healthData.maxHealth = 500;
        this.healthData.health = 500;
        this.positionData.values.angle = Math.random() * util_1.PI2;
    }
    tick(tick) {
        if (tick === this.spawnTick + 1)
            this.addAcceleration(this.angle, 75);
        if (tick >= this.spawnTick + config_1.tps * 60)
            this.destroy();
        super.tick(tick);
    }
}
exports.TrapWall = TrapWall;
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 3,
        damage: 3,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class MinionSummon extends DroneSummon {
    constructor(game, tank) {
        super(game, tank);
        this.ai.viewRange = 900 * tank.sizeFactor;
        this.inputs = this.ai.inputs;
        this.physicsData.sides = 1;
        this.physicsData.size *= 1.2;
        this.reloadTime = 8;
        this.cameraEntity = new Camera_1.CameraEntity(game);
        new Barrel_1.default(this, MinionBarrelDefinition);
    }
    get sizeFactor() {
        return this.physicsData.size / 50;
    }
    tick(tick) {
        if (this.ai.state !== 0) {
            this.inputs.flags |= 1;
            const dist = this.inputs.mouse.distanceToSQ(this.positionData.values);
            if (dist < Minion_1.default.FOCUS_RADIUS / 4) {
                this.movementAngle = this.positionData.angle + Math.PI;
            }
            else if (dist < Minion_1.default.FOCUS_RADIUS) {
                this.movementAngle = this.positionData.angle + Math.PI / 2;
            }
            else
                this.movementAngle = this.positionData.angle;
        }
        else
            this.movementAngle = false;
        super.tick(tick);
    }
}
exports.MinionSummon = MinionSummon;
