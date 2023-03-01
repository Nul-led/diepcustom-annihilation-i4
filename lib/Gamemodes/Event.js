"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const Enums_1 = require("../Const/Enums");
const MazeWall_1 = require("../Entity/Misc/MazeWall");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const TeamNexus_1 = require("../Entity/Misc/TeamNexus");
const TankBody_1 = require("../Entity/Tank/TankBody");
const ItemManager_1 = require("../Items/ItemManager");
const Arena_1 = require("../Native/Arena");
const Entity_1 = require("../Native/Entity");
const ARENA_SIZE = 16000;
const BASE_SIZE = ARENA_SIZE / 8;
const NEXUS_CONFIG = {
    health: 100000,
    shield: 10000,
    size: 150
};
class EventArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.redTeam = new TeamEntity_1.TeamEntity(this.game, 3);
        this.blueTeam = new TeamEntity_1.TeamEntity(this.game, 4);
        this.spawnBaseRed = new TeamBase_1.default(this.game, this.redTeam, -ARENA_SIZE / 2 + BASE_SIZE / 2, -ARENA_SIZE / 2 + BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, true);
        this.spawnBaseBlue = new TeamBase_1.default(this.game, this.blueTeam, ARENA_SIZE / 2 - BASE_SIZE / 2, ARENA_SIZE / 2 - BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, true);
        this.nexusBaseRed = new TeamBase_1.default(this.game, this.redTeam, 0, -ARENA_SIZE / 2 + BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, false);
        this.nexusBaseBlue = new TeamBase_1.default(this.game, this.blueTeam, 0, ARENA_SIZE / 2 - BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, false);
        this.redNexus = new TeamNexus_1.default(this.game, this.nexusBaseRed.positionData.x, this.nexusBaseRed.positionData.y, this.redTeam, NEXUS_CONFIG, this.nexusBaseRed, this.spawnBaseRed);
        this.blueNexus = new TeamNexus_1.default(this.game, this.nexusBaseBlue.positionData.x, this.nexusBaseBlue.positionData.y, this.blueTeam, NEXUS_CONFIG, this.nexusBaseBlue, this.spawnBaseBlue);
        this.playerTeamMap = new Map();
        this.items = new ItemManager_1.ItemManager(this);
        this.invincibilityTimeLeft = config_1.tps * 60 * 3;
        this._timerIsOver = false;
        this.updateBounds(ARENA_SIZE, ARENA_SIZE);
        new MazeWall_1.default(game, 0, -ARENA_SIZE / 2 + BASE_SIZE * 1.5, BASE_SIZE / 2.5, BASE_SIZE * 1.5);
        new MazeWall_1.default(game, 0, ARENA_SIZE / 2 - BASE_SIZE * 1.5, BASE_SIZE / 2.5, BASE_SIZE * 1.5);
        new MazeWall_1.default(game, -ARENA_SIZE / 2 + BASE_SIZE * 0.875 - this.ARENA_PADDING, ARENA_SIZE / 2 - BASE_SIZE * 0.875 + this.ARENA_PADDING, BASE_SIZE * 1.75 + this.ARENA_PADDING, BASE_SIZE * 1.75 + this.ARENA_PADDING);
        new MazeWall_1.default(game, ARENA_SIZE / 2 - BASE_SIZE * 0.875 + this.ARENA_PADDING, -ARENA_SIZE / 2 + BASE_SIZE * 0.875 - this.ARENA_PADDING, BASE_SIZE * 1.75 + this.ARENA_PADDING, BASE_SIZE * 1.75 + this.ARENA_PADDING);
        new MazeWall_1.default(game, -ARENA_SIZE / 2 + BASE_SIZE * 0.4375 - this.ARENA_PADDING, BASE_SIZE * 0.4375 - this.ARENA_PADDING * 1.375, ARENA_SIZE / 2, BASE_SIZE * 0.875 + this.ARENA_PADDING);
        new MazeWall_1.default(game, ARENA_SIZE / 2 - BASE_SIZE * 0.4375 + this.ARENA_PADDING, -BASE_SIZE * 0.4375 + this.ARENA_PADDING * 1.375, ARENA_SIZE / 2, BASE_SIZE * 0.875 + this.ARENA_PADDING);
        new MazeWall_1.default(game, -ARENA_SIZE / 2 + BASE_SIZE * 1.375 - this.ARENA_PADDING / 2, 0, BASE_SIZE / 2.5, BASE_SIZE);
        new MazeWall_1.default(game, ARENA_SIZE / 2 - BASE_SIZE * 1.375 + this.ARENA_PADDING / 2, 0, BASE_SIZE / 2.5, BASE_SIZE);
        this.blueNexus.setInvicibility(true);
        this.redNexus.setInvicibility(true);
    }
    spawnPlayer(tank, client) {
        let team = this.playerTeamMap.get(client);
        findTeam: {
            if (team)
                break findTeam;
            if (!Entity_1.Entity.exists(this.blueNexus) && Entity_1.Entity.exists(this.redNexus)) {
                team = this.redNexus;
                break findTeam;
            }
            else if (!Entity_1.Entity.exists(this.redNexus) && Entity_1.Entity.exists(this.blueNexus)) {
                team = this.blueNexus;
                break findTeam;
            }
            let blue = 0, red = 0;
            for (const [client, nexus] of this.playerTeamMap.entries()) {
                if (client.terminated) {
                    this.playerTeamMap.delete(client);
                    continue;
                }
                if (nexus === this.blueNexus)
                    ++blue;
                else
                    ++red;
            }
            if (red === blue)
                team = [this.blueNexus, this.redNexus][0 | Math.random() * 2];
            else if (red < blue)
                team = this.redNexus;
            else
                team = this.blueNexus;
        }
        this.playerTeamMap.set(client, team);
        if (!Entity_1.Entity.exists(team)) {
            tank.setTank(-12);
            if (client.camera)
                client.camera.cameraData.respawnLevel = 0;
            tank.positionData.x = 0;
            tank.positionData.y = 0;
            return;
        }
        const xOffset = (Math.random() - 0.5) * BASE_SIZE, yOffset = (Math.random() - 0.5) * BASE_SIZE;
        const base = team.spawnBase;
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        tank.cameraEntity.cameraData.respawnLevel = 45;
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
        client.spawnBase = base;
    }
    updateScoreboard() {
        const writeInvincibility = (i) => {
            this.arenaData.scoreboardColors[i] = 18;
            this.arenaData.scoreboardNames[i] = "Invincibility";
            this.arenaData.scoreboardScores[i] = Math.round((this.invincibilityTimeLeft / config_1.tps > 60 ? this.invincibilityTimeLeft / 60 : this.invincibilityTimeLeft) / config_1.tps);
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardSuffixes[i] = this.invincibilityTimeLeft / config_1.tps > 60 ? " min" : " sec";
        };
        const writeNexusHealth = (nexus, i) => {
            this.arenaData.scoreboardColors[i] = nexus.styleData.color;
            this.arenaData.scoreboardNames[i] = `${nexus.relationsData.team.teamName} Nexus`;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = nexus.healthData.health;
            this.arenaData.scoreboardSuffixes[i] = " HP";
        };
        const writePlayerCount = (count, team, i) => {
            this.arenaData.scoreboardColors[i] = team.teamData.teamColor;
            this.arenaData.scoreboardNames[i] = team.teamName;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = count;
            this.arenaData.scoreboardSuffixes[i] = " players";
        };
        const blueAlive = Entity_1.Entity.exists(this.blueNexus);
        const redAlive = Entity_1.Entity.exists(this.redNexus);
        if (this.invincibilityTimeLeft === 0 && (!blueAlive || !redAlive) && !this._timerIsOver) {
            for (const client of this.game.clients)
                client.notify("From now on attacking a Nexus deals double the damage!", 0x0000FF, 10000, 'phase_transition');
            this.blueNexus.damageReduction = 2;
            this.blueNexus.shield.damageReduction = 2;
            this.redNexus.damageReduction = 2;
            this.redNexus.shield.damageReduction = 2;
            this._timerIsOver = true;
        }
        if (this.arenaData.flags & 2)
            this.arenaData.flags ^= 2;
        let firstPlace = this.invincibilityTimeLeft ? 1 : 0;
        let secondPlace = firstPlace + 1;
        if (this.invincibilityTimeLeft)
            writeInvincibility(0);
        if (blueAlive && redAlive) {
            if (this.blueNexus.healthData.health > this.redNexus.healthData.health) {
                writeNexusHealth(this.blueNexus, firstPlace);
                writeNexusHealth(this.redNexus, secondPlace);
            }
            else {
                writeNexusHealth(this.redNexus, firstPlace);
                writeNexusHealth(this.blueNexus, secondPlace);
            }
        }
        else if (blueAlive && !redAlive) {
            let playerCount = 0;
            let leader = null;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team !== this.redTeam)
                    continue;
                if (!leader || leader.camera.cameraData.score < client.camera.cameraData.score) {
                    leader = client;
                    this.arenaData.leaderX = leader.camera?.cameraData.player?.positionData?.x || 0;
                    this.arenaData.leaderY = leader.camera?.cameraData.player?.positionData?.y || 0;
                    this.arenaData.flags |= 2;
                }
                ++playerCount;
                if (client.camera.cameraData.level < 45)
                    client.camera.cameraData.score += 450 / client.camera.cameraData.level;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if (!playerCount && this.state === 0) {
                this.close();
                for (const client of this.game.clients)
                    client.notify("Team RED won the game!", Enums_1.ColorsHexCode[4], -1);
            }
            writeNexusHealth(this.blueNexus, firstPlace);
            writePlayerCount(playerCount, this.redTeam, secondPlace);
        }
        else if (!blueAlive && redAlive) {
            let playerCount = 0;
            let leader = null;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team !== this.blueTeam)
                    continue;
                if (!leader || leader.camera.cameraData.score < client.camera.cameraData.score) {
                    leader = client;
                    this.arenaData.leaderX = leader.camera?.cameraData.player?.positionData?.x || 0;
                    this.arenaData.leaderY = leader.camera?.cameraData.player?.positionData?.y || 0;
                    this.arenaData.flags |= 2;
                }
                ++playerCount;
                if (client.camera.cameraData.level < 45)
                    client.camera.cameraData.score += 450 / client.camera.cameraData.level;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if (!playerCount && this.state === 0) {
                this.close();
                for (const client of this.game.clients)
                    client.notify("Team BLUE won the game!", Enums_1.ColorsHexCode[3], -1);
            }
            writeNexusHealth(this.redNexus, firstPlace);
            writePlayerCount(playerCount, this.blueTeam, secondPlace);
        }
        else {
            let bluePlayers = 0, redPlayers = 0;
            let leader = null;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team === this.redTeam)
                    ++redPlayers;
                else if (client.camera.cameraData.player.relationsData.team === this.blueTeam)
                    ++bluePlayers;
                else
                    continue;
                if (!leader || leader.camera.cameraData.score < client.camera.cameraData.score) {
                    leader = client;
                    this.arenaData.leaderX = leader.camera?.cameraData.player?.positionData?.x || 0;
                    this.arenaData.leaderY = leader.camera?.cameraData.player?.positionData?.y || 0;
                    this.arenaData.flags |= 2;
                }
                if (client.camera.cameraData.level < 45)
                    client.camera.cameraData.score += 450 / client.camera.cameraData.level;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if ((!bluePlayers || !redPlayers) && this.state === 0) {
                this.close();
                if (!bluePlayers) {
                    for (const client of this.game.clients)
                        client.notify("Team BLUE won the game!", Enums_1.ColorsHexCode[3], -1);
                }
                else {
                    for (const client of this.game.clients)
                        client.notify("Team RED won the game!", Enums_1.ColorsHexCode[4], -1);
                }
            }
            if (bluePlayers > redPlayers) {
                writePlayerCount(bluePlayers, this.blueTeam, firstPlace);
                writePlayerCount(redPlayers, this.redTeam, secondPlace);
            }
            else {
                writePlayerCount(redPlayers, this.redTeam, firstPlace);
                writePlayerCount(bluePlayers, this.blueTeam, secondPlace);
            }
        }
        this.arenaData.scoreboardAmount = this.invincibilityTimeLeft ? 3 : 2;
    }
    tick(tick) {
        this.items.tick();
        this.updateScoreboard();
        if (this.invincibilityTimeLeft) {
            --this.invincibilityTimeLeft;
            this.blueNexus.setInvicibility(true);
            this.redNexus.setInvicibility(true);
        }
        else {
            this.blueNexus.setInvicibility(false);
            this.redNexus.setInvicibility(false);
        }
        if (this.state === 2) {
            let players = 0;
            for (const client of this.game.clients) {
                if (client.camera
                    && Entity_1.Entity.exists(client.camera.cameraData.player)
                    && client.camera.cameraData.player instanceof TankBody_1.default
                    && client.camera.cameraData.player.physicsData.sides > 0)
                    ++players;
            }
            if (players)
                return;
            this.state = 3;
            setTimeout(() => this.game.end(), 5000);
            return;
        }
    }
}
exports.default = EventArena;
