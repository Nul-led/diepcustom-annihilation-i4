import { tps } from "../config";
import { HealthFlags, InputFlags, PhysicsFlags, PositionFlags, StyleFlags } from "../Const/Enums";
import { BarrelDefinition } from "../Const/TankDefinitions";
import { AI, AIState, Inputs } from "../Entity/AI";
import LivingEntity from "../Entity/Live";
import Barrel from "../Entity/Tank/Barrel";
import Drone from "../Entity/Tank/Projectile/Drone";
import Minion from "../Entity/Tank/Projectile/Minion";
import TankBody, { BarrelBase } from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import { CameraEntity } from "../Native/Camera";
import { Entity } from "../Native/Entity";
import { CameraGroup } from "../Native/FieldGroups";
import { PI2 } from "../util";

export class DroneSpawner {
    public drones: DroneSummon[] = [];
    public wantedDrones: number = 0;
    public game: GameServer;
    constructor(game: GameServer) {
        this.game = game;
    }

    tick(tank: TankBody) {
        for(let i = 0; i < this.wantedDrones; ++i) {
            const drone = this.drones[i];
            if(!drone || drone.hash === 0) this.drones[i] = new DroneSummon(this.game, tank);
        }
    }
}

export class DroneSummon extends LivingEntity {
    /** The AI of the drone (for AI mode) */
    public ai: AI;

    /** Used let the drone go back to the player in time. */
    private restCycle = true;

    public tank: TankBody;

    private baseAccel: number = 16;

    public movementAngle: number | boolean = false;

    constructor(game: GameServer, tank: TankBody) {
        super(game);
        this.tank = tank;

        this.ai = new AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2;
        this.physicsData.sides = 3;
        this.physicsData.size = 30;
        this.physicsData.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator;
        this.healthData.values.flags |= HealthFlags.hiddenHealthbar;
        this.physicsData.pushFactor = 4;
        this.physicsData.absorbtionFactor = 1;
        this.damagePerTick = 16;
        this.healthData.maxHealth = this.healthData.health = 300;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.positionData.x = tank.positionData.x;
        this.positionData.y = tank.positionData.y;
        this.styleData.color = this.tank.styleData.color;
        this.relationsData.team = this.relationsData.owner = tank.relationsData.team;
        this.positionData.flags |= PositionFlags.canMoveThroughWalls;
    }

    public tick(tick: number) {
        super.tick(tick);
        if(!Entity.exists(this.tank)) return this.destroy();
        this.baseAccel = 16 * this.tank.cameraEntity.cameraData.movementSpeed;
        if (this.ai.state === AIState.idle) {
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            }

            const base = this.baseAccel;

            // still a bit inaccurate, works though
            let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone.MAX_RESTING_RADIUS;
            if (unitDist <= 1 && this.restCycle) {
                this.baseAccel /= 6;
                this.positionData.angle += 0.01 + 0.012 * unitDist;
            } else {
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.y;
                this.positionData.angle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.5) this.baseAccel /= 3;
                this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (this.tank.physicsData.values.size ** 2);
            }

            this.baseAccel = base;
        } else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false;
        }

        this.maintainVelocity(this.movementAngle === false ? this.positionData.values.angle : Number(this.movementAngle), this.ai.target ? this.baseAccel / 1.5 : this.baseAccel);
    }
}

export class TrapWall extends LivingEntity {
    private spawnTick: number;
    private angle: number;
    constructor(game: GameServer, angle: number, owner: TankBody) {
        super(game);
        this.relationsData.team = this.relationsData.owner = owner.relationsData.team;
        this.styleData.color = owner.styleData.color;
        this.positionData.x = owner.positionData.x;
        this.positionData.y = owner.positionData.y;
        this.spawnTick = game.tick;
        this.angle = owner.positionData.angle + angle;
        this.physicsData.sides = 3;
        this.physicsData.size = 30;
        this.physicsData.flags |= PhysicsFlags.noOwnTeamCollision;
        this.styleData.flags |= StyleFlags.isTrap | StyleFlags.isStar | StyleFlags.hasNoDmgIndicator;
        this.damagePerTick = 1;
        this.physicsData.pushFactor = 2;
        this.healthData.maxHealth = 500;
        this.healthData.health = 500;
        this.positionData.values.angle = Math.random() * PI2;
    }

    public tick(tick: number) {
        if(tick === this.spawnTick + 1) this.addAcceleration(this.angle, 75);
        if(tick >= this.spawnTick + tps * 60) this.destroy();
        super.tick(tick);
    }
}

const MinionBarrelDefinition: BarrelDefinition = {
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

export class MinionSummon extends DroneSummon implements BarrelBase {
    public inputs: Inputs;
    public cameraEntity: Entity;
    public reloadTime: number;
    constructor(game: GameServer, tank: TankBody) {
        super(game, tank);
        this.ai.viewRange = 900 * tank.sizeFactor;
        this.inputs = this.ai.inputs;
        this.physicsData.sides = 1;
        this.physicsData.size *= 1.2;
        this.reloadTime = 8;
        this.cameraEntity = new CameraEntity(game);
        new Barrel(this, MinionBarrelDefinition)
    }

    public get sizeFactor() {
        return this.physicsData.size / 50;
    }

    public tick(tick: number) {
        if(this.ai.state !== AIState.idle) {
            this.inputs.flags |= InputFlags.leftclick;

            const dist = this.inputs.mouse.distanceToSQ(this.positionData.values);

            if (dist < Minion.FOCUS_RADIUS / 4) {
                this.movementAngle = this.positionData.angle + Math.PI;
            } else if (dist < Minion.FOCUS_RADIUS) {
                this.movementAngle = this.positionData.angle + Math.PI / 2;
            } else this.movementAngle = this.positionData.angle;
        }
        else this.movementAngle = false;
        super.tick(tick);
    }
}


