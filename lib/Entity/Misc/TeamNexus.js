"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexusShield = void 0;
const config_1 = require("../../config");
const Enums_1 = require("../../Const/Enums");
const Entity_1 = require("../../Native/Entity");
const FieldGroups_1 = require("../../Native/FieldGroups");
const util_1 = require("../../util");
const Live_1 = require("../Live");
const Object_1 = require("../Object");
const TankBody_1 = require("../Tank/TankBody");
class Nexus extends Live_1.default {
    constructor(game, x, y, team, config, nexusBase, spawnBase) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.sacrifices = new Set();
        this.lastNotificationTick = 0;
        this.shield = new NexusShield(game, this, config.shield, config.size * 1.7);
        this.team = team;
        this.config = config;
        this.relationsData.team = team;
        this.base = nexusBase;
        this.spawnBase = spawnBase;
        this.styleData.color = team.teamData.teamColor;
        this.styleData.zIndex = this.shield.styleData.zIndex + 1;
        this.healthData.maxHealth = config.health;
        this.healthData.health = config.health;
        this.healthData.flags |= 1;
        this.physicsData.absorbtionFactor = 0;
        this.physicsData.pushFactor = 5.0;
        this.physicsData.sides = 6;
        this.physicsData.size = this.config.size;
        this.physicsData.flags |= 16;
        this.positionData.x = x;
        this.positionData.y = y;
        this.scoreReward = 100000;
    }
    setInvicibility(isInvincible) {
        this.damageReduction = isInvincible ? 0 : 1;
        this.shield.damageReduction = isInvincible ? 0 : 1;
    }
    notifyShieldBroke() {
        if (this.game.arena.state !== 0)
            return;
        const nexusPos = this.getWorldPosition();
        for (const client of this.game.clients) {
            if (!client.camera)
                continue;
            if (!(client.camera.cameraData.player instanceof TankBody_1.default))
                continue;
            const tank = client.camera.cameraData.player;
            if (tank.relationsData.team === this.relationsData.team) {
                client.notify(`Your team's nexus has lost its shield (${Math.round(this.healthData.health)} hp remaining)!`, Enums_1.ColorsHexCode[4], 3000, 'shield_broke');
            }
            else {
                client.notify(`The other team's nexus has lost its shield!`, Enums_1.ColorsHexCode[6], 3000, 'shield_broke');
                const pos = tank.getWorldPosition();
                const distance = Math.sqrt(pos.distanceToSQ(nexusPos));
                if (distance > 3000)
                    continue;
                tank.addAcceleration(Math.atan2(pos.y - nexusPos.y, pos.x - nexusPos.x), 300 - distance / 10);
                tank.applyPhysics();
            }
        }
    }
    notifyDamage() {
        if (this.game.arena.state !== 0)
            return;
        if (this.lastNotificationTick + config_1.tps * 5 > this.game.tick)
            return;
        const hp = Math.round(this.healthData.health);
        const shield = Math.round(this.shield.healthData.health);
        const notification = `Your team's nexus is being attacked (${this.shield.isBroken ? hp + " Health remaining" : hp + " Health, " + shield + " Shield remaining"})`;
        for (const client of this.game.clients) {
            if (!client.camera)
                continue;
            if (!(client.camera.cameraData.player instanceof TankBody_1.default))
                continue;
            if (client.camera.cameraData.player.relationsData.team !== this.relationsData.team)
                continue;
            client.notify(notification, Enums_1.ColorsHexCode[4], 5000, 'nexus_attack');
        }
        this.lastNotificationTick = this.game.tick;
    }
    sacrifice(client) {
        if (!client.camera || !Entity_1.Entity.exists(client.camera.cameraData.player) || !Entity_1.Entity.exists(this))
            return;
        if (!(client.camera.cameraData.player instanceof Live_1.default))
            return;
        if (this.sacrifices.has(client)) {
            client.notify("Sacificing stopped by player.", 0xFFA500, 2000, 'cant_claim_info');
            return this.sacrifices.delete(client);
        }
        if (this.game.arena.invincibilityTimeLeft)
            return client.notify("Sacificing disable in this phase.", 0xFFA500, 2000, 'cant_claim_info');
        const playerPos = client.camera.cameraData.player.positionData;
        const playerPhysics = client.camera.cameraData.player.physicsData;
        const basePos = this.base.positionData;
        const basePhysics = this.base.physicsData;
        const dX = (0, util_1.constrain)(playerPos.x, basePos.x - basePhysics.size / 2, basePos.x + basePhysics.size / 2) - playerPos.x;
        const dY = (0, util_1.constrain)(playerPos.y, basePos.y - basePhysics.width / 2, basePos.y + basePhysics.width / 2) - playerPos.y;
        const isInBase = dX ** 2 + dY ** 2 <= playerPhysics.sides ** 2;
        if (!isInBase)
            return client.notify("Unable to sacrifice to the nexus, out of reach.", 0xFFA500, 2000, 'cant_claim_info');
        this.sacrifices.add(client);
        client.notify("Sacificing started, stay close to the nexus.", 0xFFA500, 2000, 'cant_claim_info');
    }
    updateShield() {
        if (!Entity_1.Entity.exists(this.shield))
            return;
        if (!this.shield.isBroken)
            return;
        if (this.shield.brokenTick + config_1.tps * 30 > this.game.tick)
            return;
        this.shield.revive();
    }
    onDeath(killer) {
        if (!Entity_1.Entity.exists(this))
            return;
        if (Entity_1.Entity.exists(this.shield))
            this.shield.delete();
        this.base.setPainful(false);
        this.spawnBase.setPainful(false);
        this.base.styleData.color = 12;
        this.spawnBase.styleData.color = 12;
        this.game.broadcast()
            .u8(3)
            .stringNT(`${killer.nameData?.name || "An unnamed tank"} has destroyed the ${this.relationsData.team.teamName} Nexus!`)
            .u32(killer.styleData ? Enums_1.ColorsHexCode[killer.styleData.color] : 0x000000)
            .float(15000)
            .stringNT("").send();
    }
    applyPhysics() {
        Object_1.default.prototype.applyPhysics.call(this);
        if (this.healthData.values.health <= 0) {
            this.destroy(true);
            this.damagedEntities = [];
            return;
        }
        if (this.healthData.values.health > this.healthData.values.maxHealth) {
            this.healthData.health = this.healthData.values.maxHealth;
        }
        this.damagedEntities = [];
    }
    tick(tick) {
        if (this.game.arena.invincibilityTimeLeft > 0) {
            this.nameData.name = "Nexus (Invincible)";
        }
        else {
            if (this.shield.isBroken)
                this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, Shield recovers in ${(30 - (this.game.tick - this.shield.brokenTick) / config_1.tps).toFixed(2)} seconds)`;
            else
                this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, ${Math.round(this.shield.healthData.health)} Shield)`;
        }
        this.positionData.angle = -(tick * 0.01);
        this.updateShield();
        this.lastDamageAnimationTick = tick;
        super.tick(tick);
        if (this.game.arena.invincibilityTimeLeft > 0)
            return;
        for (const sacrifice of this.sacrifices) {
            if (!sacrifice.camera
                || !Entity_1.Entity.exists(sacrifice.camera.cameraData.player)
                || !Entity_1.Entity.exists(this)
                || !(sacrifice.camera.cameraData.player instanceof Live_1.default)) {
                sacrifice.notify("Sacificing stopped.", 0xFFA500, 2000, 'cant_claim_info');
                this.sacrifices.delete(sacrifice);
                continue;
            }
            const playerPos = sacrifice.camera.cameraData.player.positionData;
            const playerPhysics = sacrifice.camera.cameraData.player.physicsData;
            const basePos = this.base.positionData;
            const basePhysics = this.base.physicsData;
            const dX = (0, util_1.constrain)(playerPos.x, basePos.x - basePhysics.size / 2, basePos.x + basePhysics.size / 2) - playerPos.x;
            const dY = (0, util_1.constrain)(playerPos.y, basePos.y - basePhysics.width / 2, basePos.y + basePhysics.width / 2) - playerPos.y;
            const isInBase = dX ** 2 + dY ** 2 <= playerPhysics.sides ** 2;
            if (!isInBase) {
                sacrifice.notify("Sacificing stopped, out of reach.", 0xFFA500, 2000, 'cant_claim_info');
                this.sacrifices.delete(sacrifice);
                continue;
            }
            const entity = sacrifice.camera.cameraData.player;
            entity.lastDamageTick = tick;
            if (this.healthData.health >= this.healthData.maxHealth)
                continue;
            this.healthData.health += (entity.healthData.maxHealth * entity.damagePerTick / (entity instanceof TankBody_1.default ? 20 : 8) * 0.01) * (sacrifice.sacrificingEffect ? 2 : 1);
            entity.healthData.health -= entity.healthData.maxHealth * 0.005 + entity.regenPerTick;
        }
        if (this.lastDamageTick === tick)
            this.notifyDamage();
    }
}
exports.default = Nexus;
class NexusShield extends Live_1.default {
    constructor(game, nexus, health, size) {
        super(game);
        this.isBroken = false;
        this.brokenTick = 0;
        this.nexus = nexus;
        this.healthData.maxHealth = health;
        this.healthData.health = health;
        this.healthData.flags |= 1;
        this.regenPerTick = health * 0.0001;
        this.styleData.color = 0;
        this.styleData.opacity = 1.0;
        this.physicsData.absorbtionFactor = 0.0;
        this.physicsData.pushFactor = 1.0;
        this.physicsData.flags |= 16;
        this.physicsData.sides = 6;
        this.physicsData.size = size;
    }
    revive() {
        this.isBroken = false;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 6;
        this.lastDamageTick = this.game.tick;
    }
    onDeath(killer) {
        if (this.isBroken)
            return;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 0;
        this.isBroken = true;
        this.brokenTick = this.game.tick;
        this.nexus.notifyShieldBroke();
    }
    tick(tick) {
        this.relationsData.team = this.nexus.relationsData.team;
        this.relationsData.owner = this.nexus;
        this.positionData.x = this.nexus.positionData.x;
        this.positionData.y = this.nexus.positionData.y;
        this.positionData.angle = tick * 0.01;
        this.styleData.opacity = this.healthData.health / this.healthData.maxHealth;
        this.lastDamageAnimationTick = tick;
        super.tick(tick);
        if (this.lastDamageTick === tick)
            this.nexus.notifyDamage();
    }
}
exports.NexusShield = NexusShield;
