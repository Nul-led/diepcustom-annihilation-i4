/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

const BUILD = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
const CDN = "https://static.diep.io/";
const API_URL = `${window.location.href}api/`;

const CHANGELOG = [
    "Updated recently",
    "",
    "Check out the GitHub repository!: github.com/ABCxFF/diepcustom",
    "Join our Discord server: discord.gg/SyxWdxgHnT :)"
];

const ASM_CONSTS = {
    1024: "createCanvasCtxWithAlpha",
    3781: "createImage",
    4211: "websocketSend",
    4388: "wipeContext",
    4528: "modulo",
    4551: "wipeSocket",
    4777: "setTextInput",
    4827: "wipeImage",
    4902: "reloadWindowTimeout",
    4968: "existsInWindowObject",
    5011: "empty", // ads
    5093: "empty", // ads
    5124: "empty", // ads
    5443: "empty", // ads
    5506: "empty", // ads
    5563: "empty", // ads
    5827: "getQueries",
    6547: "empty", // ads
    6927: "empty", // ads
    7068: "getLocalStorage",
    7293: "deleteLocalStorage",
    7343: "removeChildNode",
    7449: "checkElementProperty",
    7675: "existsQueryOrIsBlank",
    7886: "empty", // ads
    8008: "setLocalStorage",
    8254: "empty", // ads
    8472: "empty", // ads
    9178: "empty", // ads
    9362: "getGamepad",
    9558: "toggleFullscreen",
    10188: "getCanvasSize",
    10299: "setCursorDefault",
    10363: "setCursorPointer",
    10427: "setCursorText",
    10488: "getTextInput",
    10530: "enableTyping",
    11181: "disableTyping",
    11296: "focusCanvas",
    11444: "setCanvasSize",
    11529: "empty", // anti cheat
    11586: "copyUTF8",
    11637: "alert",
    11884: "saveContext",
    11952: "restoreContext",
    12020: "scaleContextAlpha",
    12063: "empty", // ads
    12501: "empty", // ads
    12976: "empty", // ads
    13247: "empty", // ads
    13331: "empty", // ads
    13414: "setContextFillStyle",
    13493: "setContextTransform",
    13560: "contextFillRect",
    13611: "contextBeginPath",
    13645: "contextClip",
    13674: "contextFill",
    13703: "setContextLineJoinRound",
    13744: "setContextLineJoinBevel",
    13785: "setContextLineJoinMiter",
    13826: "setContextLineWidth",
    13863: "setContextStrokeStyle",
    13939: "setContextTransformBounds",
    14002: "contextStroke",
    14033: "contextRect",
    14072: "getFontsLoaded",
    14174: "setContextFont",
    14240: "measureContextTextWidth",
    14308: "setContextAlpha",
    14347: "contextFillText",
    14402: "contextStrokeText",
    14459: "setContextTextBaselineTop",
    14502: "setContextTextBaselineHanging",
    14549: "setContextTextBaselineMiddle",
    14595: "setContextTextBaselineAlphabetic",
    14645: "setContextTextBaselineIdeographic",
    14696: "setContextTextBaselineBottom",
    15084: "setContextTransformNormalize",
    15137: "contextMoveTo",
    15178: "contextLineTo",
    15215: "contextClosePath",
    15288: "contextArc",
    16282: "copyToKeyboard",
    16505: "setLocation",
    16959: "contextDrawImage",
    24403: "getImage",
    24601: "contextDrawCanvas",
    24706: "setContextLineCapButt",
    24745: "setContextLineCapRound",
    24785: "setContextLineCapSquare",
    25012: "contextStrokeRect",
    25057: "contextDrawFullCanvas",
    25399: "isContextPatternAvailable",
    25462: "createContextPattern",
    25748: "contextGetPixelColor",
    25862: "contextDrawCanvasSourceToPixel",
    25954: "contextFillRectWithPattern",
    26051: "wipePattern",
    26281: "empty", // ?
    26345: "empty", // ?
    26430: "existsQuery",
    26890: "empty", // anti cheat
    26958: "canvasHasSamePropertyAsDocumentBody",
    27065: "existsDocumentBodyProperty",
    27120: "existsDocumentBodyProperty2",
    27166: "existsDivPropertyAndEqualsPropertyOnDocumentBody",
    27326: "empty", // anti cheat
    27575: "empty", // anti cheat
    27656: "empty", // anti cheat
    27778: "acCheckWindow", // anti cheat
    27886: "getDocumentBody",
    27945: "empty", // anti cheat
    28057: "empty", // anti cheat
    28125: "getUserAgent",
    28186: "empty", // anti cheat
    28407: "getQuerySelectorToString",
    28509: "getFillTextToString",
    28632: "getStrokeRectToString",
    28757: "getStrokeTextToString",
    28882: "getScaleToString",
    29002: "getTranslateToString",
    29126: "getFillRectToString",
    29249: "getRotateToString",
    29370: "getGetImageDataToString",
    29518: "empty", // ads
    29633: "contextClearRect",
    29740: "createCanvasCtx",
    29980: "setContextMiterLimit",
    30178: "getWindowLocation",
    30225: "setLoadingStatus",
    30352: "m28nReply",
    30767: "isSSL",
    30836: "createWebSocket",
    31548: "findServerById",
    31923: "invalidPartyId",
    31954: "wipeLocation",
    32047: "getGamepadAxe",
    32156: "getGamepadButtonPressed",
    32290: "pollWebSocketEvent",
    32446: "updateToNewVersion",
    32506: "empty", // pow
    32813: "reloadWindow",
    32840: "getWindowLocationSearch",
    32889: "getWindowReferrer",
    33085: "empty", // fingerprinting
    33169: "empty", // fingerprinting
    33222: "empty", // fingerprinting
    33330: "empty", // fingerprinting
    33425: "empty", // fingerprinting
    33488: "empty", // fingerprinting
    33528: "empty", // fingerprinting
};

const WASM_IMPORTS = {
    "i": "assertFail",
    "q": "mapFile",
    "p": "sysMunmap",
    "b": "abort",
    "d": "asmConstsDII",
    "a": "asmConstsIII",
    "j": "exitLive",
    "m": "exitForce",
    "g": "getNow",
    "n": "memCopyBig",
    "e": "random",
    "f": "resizeHeap",
    "r": "setMainLoop",
    "k": "envGet",
    "l": "envSize",
    "h": "fdWrite",
    "c": "roundF",
    "o": "timeString",
    "memory": "wasmMemory",
    "table": "wasmTable"
};

const WASM_EXPORTS = {
    "s": "wasmCallCtors", // constructors
    "t": "connect", // used to connect to ip, unused
    "u": "hasTank", // does player have a tank
    "v": "setConvar", // sets console var
    "w": "getConvar", // gets console var
    "x": "execute", // execute console cmd
    "y": "printConsoleHelp", // prints console help
    "z": "main", // main function
    "A": "checkWS", // polls ws
    "B": "free", // frees memory
    "C": "videoAdsLoaded", // event for ads loaded, unused
    "D": "videoAdsDone", // event for ad done, unused
    "E": "mouse", // sets mouse pos
    "F": "keyDown", // sets key down
    "G": "keyUp", // sets key up
    "H": "resetKeys", // resets key listeners
    "I": "preventRightClick", // should prevent right click if true
    "J": "flushInputHooks", // flushes all inputs (keys, mouse, gamepad)
    "K": "mouseWheel", // sets mouse wheel delta
    "L": "cp5Idle", // idle mode, unused
    "M": "cp5Destroy", // destroy cp5 obj, unused
    "N": "powResult", // pow result, unused 
    "O": "restReply", // server finder reply 
    "P": "getErrorLocation", // gets pointer for setting error code
    "Q": "malloc", // allocates memory
    "R": "dynCallVI", // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
    "S": "dynCallV" // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
};

const MOD_CONFIG = {
    "wasmFunctions": {
        "loadGamemodeButtons": 296,
        "loadVectorDone": 22,
        "loadChangelog": 447,
        "loadTankDefinitions": 277,
        "getTankDefinition": 101,
        "findCommand": 496
    },
    "memory": {
        "gamemodeDisabledText": 16420,
        "gamemodeButtons": 113480,
        "changelog": 167328,
        "changelogLoaded": 168632,
        "tankDefinitions": 166572,
        "tankDefinitionsCount": 166576,
        "commandList": 53064,
        "netColorTable": 49584
    },
    "wasmFunctionHookOffset": {
        "gamemodeButtons": 33,
        "changelog": 28
    }
};

const ADDON_MAP = {
    "barrelAddons": {
        "trapLauncher": 147
    },
    "tankAddons": {
        "auto3": 148,
        "smasher": 149,
        "pronounced": 150,
        "landmine": 151,
        "auto5": 153,
        "autoturret": 154, // Auto Trapper (154) & Auto Gunner (152)
        "autosmasher": 155,
        "spike": 156,
        "launcher": 157, // Skimmer (157) & Rocketeer (158)
        "dombase": 159,
        "dompronounced": 160, // Dom1 (160) & Dom2 (161) 
    }
};

const CUSTOM_COMMANDS = [
    {
        "id": "util_test",
        "description": "Test command to check if custom commands are working, prints 'Hello World' to the console",
        "callback": args => { // array of strings, you need to parse them yourself
            console.log("Hello World");
        }
    }, {
        "id": "util_set_dev_password",
        "usage": "[password]",
        "description": "Sets the dev password (reconnect required)",
        "callback": args => {
            if(!args[0]) return;
            window.localStorage.setItem("password", args[0]);
        }
    }, {
        "id": "util_toggle_vsync",
        "usage": "[?enable]",
        "description": "Toggles VSync on / off",
        "callback": args => {
            if(args[0] === 'on') {
                Module.scheduler = window.requestAnimationFrame;
            } else if(args[0] === 'off') {
                Module.scheduler = window.setTimeout;
            } else {
                Module.scheduler = Module.scheduler === window.requestAnimationFrame ? window.setTimeout : window.requestAnimationFrame;
            }
        }
    }, {
        "id": "util_reload_servers",
        "usage": "[?interval]",
        "description": "Sets the interval in which gamemodes are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadServersInterval = -1;
                        case "connect":
                            return Module.reloadServersInterval = -2;
                    }
                }
                return Module.reloadServersInterval = num;
            }
            Game.reloadServers();
        }
    }, {
        "id": "util_reload_tanks",
        "usage": "[?interval]",
        "description": "Sets the interval in which tanks are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadTanksInterval = -1;
                        case "connect":
                            return Module.reloadTanksInterval = -2;
                    }
                }
                return Module.reloadTanksInterval = num;
            }
            Game.reloadTanks();
        }
    }, {
        "id": "util_reload_commands",
        "usage": "[?interval]",
        "description": "Sets the interval in which commands are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadCommandsInterval = -1;
                        case "connect":
                            return Module.reloadCommandsInterval = -2;
                    }
                }
                return Module.reloadCommandsInterval = num;
            }
            Game.reloadCommands();
        }
    }, {
        "id": "util_set_changelog",
        "usage": "[line 1\\n] [line 2] ...",
        "description": "Sets the changelog to the given text, remember to use \\n before and after each line",
        "callback": args => {
            Game.changeChangelog(args.join(' ').split("\\n"));
        }
    }, {
        "id": "util_set_slot_keybinds",
        "usage": "[slot 1] [slot 2] ...",
        "description": "Sets the keybinds for item activation & dropping",
        "callback": args => {
            const keybinds = [];
            for(const arg of args) {
                if(!arg || arg.length !== 1 || !(/[a-z]/.test(arg))) return;
                keybinds.push(arg);
            }
            localStorage.setItem("inventorySlotKeybinds", JSON.stringify(args));
            SLOT_KEYBINDS.length = 0;
            for(const key of keybinds) SLOT_KEYBINDS.push(key);
        }
    }
];

const COMMANDS_LOOKUP = {
    "con_toggle": 52952,
    "game_spawn": 52992,
    "help": 49956,
    "lb_reconnect": 50056,
    "net_replace_color": 50152,
    "net_replace_colors": 50192,
    "ui_replace_colors": 49916
};

const WASM_TABLE = {
    "initial": 687,
    "element": "anyfunc"
};

const INITIAL_MEMORY = 67108864;
const WASM_PAGE_SIZE = 65536; // A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB

const DYNAMIC_BASE = 5426112; // start of dynmic memory
const DYNAMIC_TOP_PTR = 183072; // points to start of dynamic memory

const WASM_MEMORY = {
    "initial": INITIAL_MEMORY / WASM_PAGE_SIZE,
    "maximum": INITIAL_MEMORY / WASM_PAGE_SIZE
};

const ITEM_ICONS = {
    "common": "data:image/png;base64,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",
    "rare": "data:image/png;base64,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",
    "epic": "data:image/png;base64,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",
    "empty": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAABu0lEQVR42u3SQREAAAzCsOHf9F6oIJXQS07TxQIABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAgAACwAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAAsAEAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAKg9kK0BATSHu+YAAAAASUVORK5CYII="
};

const ITEM_COLOR = {
    "common": "#66CBFF",
    "rare": "#FD9F3B",
    "epic": "#CC33FF"
};

const SCOREBOARD_ICON = [
    "data:image/png;base64,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",
    "data:image/png;base64,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",
    "data:image/png;base64,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"
];

const SCOREBOARD_COLOR = [
    "#FFEEA3",
    "#E1EBF2",
    "#FFC49C"
];

const SLOT_KEYBINDS = (() => {
    try {
        const local = JSON.parse(localStorage.getItem("inventorySlotKeybinds"));
        if(!(local instanceof Array)) throw "";
        return local;
    } catch(e) {
        return ["v", "b", "n"]; 
    }
})();