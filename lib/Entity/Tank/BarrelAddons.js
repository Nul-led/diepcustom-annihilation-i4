"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarrelAddonById = exports.TrapLauncherAddon = exports.TrapLauncher = exports.BarrelAddon = void 0;
const Object_1 = require("../Object");
class BarrelAddon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
}
exports.BarrelAddon = BarrelAddon;
class TrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.TrapLauncher = TrapLauncher;
class TrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new TrapLauncher(owner);
    }
}
exports.TrapLauncherAddon = TrapLauncherAddon;
exports.BarrelAddonById = {
    trapLauncher: TrapLauncherAddon
};
