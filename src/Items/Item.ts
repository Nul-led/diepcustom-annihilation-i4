import { Color } from "../Const/Enums";
import MazeWall from "../Entity/Misc/MazeWall";
import Nexus, { NexusShield } from "../Entity/Misc/TeamNexus";
import ObjectEntity from "../Entity/Object";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ClientCamera from "../Native/Camera";
import { NameGroup } from "../Native/FieldGroups";
import { ItemDefinition, RarityName } from "./ItemDefinitions";

export default class Item extends ObjectEntity {
    public nameData: NameGroup = new NameGroup(this);
    public definition: ItemDefinition;

    public pickupTimeout: number = 0;
    private _accel: number;
    private _angle: number;
    private spawnTick: number;

    constructor(game: GameServer, definition: ItemDefinition, baseAccel?: number, baseAngle?: number) {
        super(game);
        this.physicsData.size = 50;
        this.physicsData.pushFactor = 0;
        this._accel = baseAccel || 0;
        this._angle = baseAngle || 0;
        this.spawnTick = game.tick;
        
        this.definition = definition;

        switch(definition.rarityName) {
            case RarityName.Common: {
                this.styleData.color = Color.ItemCommon;
                this.physicsData.sides = 3;
                this.nameData.name = "Common Item";
                break;
            }
            case RarityName.Rare: {
                this.styleData.color = Color.ItemRare;
                this.physicsData.sides = 4;
                this.nameData.name = "Rare Item";
                break;
            }
            case RarityName.Epic: {
                this.styleData.color = Color.ItemEpic;
                this.physicsData.sides = 5;
                this.nameData.name = "Epic Item";
                break;
            }
        }
    }

    public onPickup(collector: TankBody) {
        if(!(collector.cameraEntity instanceof ClientCamera)) return;
        if(!collector.cameraEntity.client.inventory.canPickUpItem()) return;
        collector.cameraEntity.client.inventory.pickupItem(this);
    }

    public tick(tick: number) {
        if(tick === this.spawnTick + 1) this.addAcceleration(this._angle, this._accel);
        this.positionData.angle = -(tick * 0.01);

        this.velocity.setPosition(this.positionData.values);
        this.deletionAnimation?.tick();

        if(this.pickupTimeout) --this.pickupTimeout;

        if (!this.deletionAnimation) {
            const collidedEntities = this.findCollisions();
            for(const entity of collidedEntities) {
                if(!this.pickupTimeout && (entity as TankBody).cameraEntity && entity instanceof TankBody) {
                    this.onPickup(entity);
                    break;
                }
                if(entity instanceof MazeWall || entity instanceof Nexus || entity instanceof NexusShield) {
                    this.receiveKnockback(entity);
                }
            }
        }

        if (this.isViewed) for (let i = 0; i < this.children.length; ++i) this.children[i].tick(tick);
    }
}