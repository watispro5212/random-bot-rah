/**
 * Insane Mod — mod.js
 * Chrome Extension version of the MooMoo.io mod.
 *
 * Key differences from the userscript version:
 *  1. No ==UserScript== header — runs as a plain page-context script
 *  2. PACKET_MAP proxy is deferred until msgpack is available on window
 *  3. Bots read the actual server shard URL from the live WS connection
 *     (same shard the player is on) so they appear in the same game
 *  4. window.__insaneBotStats is kept up-to-date for the popup to read
 *  5. window.__insaneModLoaded = true is set when init completes
 *  6. originalSend is captured before ANY proxy so bots can bypass
 *     all packet remapping
 */

(function () {
    'use strict';

    /* ════════════════════════════════════════════════════════════════
       STEP 0 — capture the raw WebSocket.prototype.send immediately,
       before any proxy or override touches it.
       Bots will call this directly to bypass all packet remapping.
    ════════════════════════════════════════════════════════════════ */
    const _rawWsSend = WebSocket.prototype.send;

    /* ════════════════════════════════════════════════════════════════
       STEP 1 — PACKET_MAP proxy
       Remaps outgoing client→server packet type strings.
       Must be deferred until msgpack is loaded on window.
    ════════════════════════════════════════════════════════════════ */
    const PACKET_MAP = {
        "33": "9",
        "ch": "6",
        "pp": "0",
        "13c": "c",
        "f": "9",
        "a": "9",
        "d": "F",
        "G": "z"
    };

    /* Wrap WebSocket.prototype.send with the PACKET_MAP proxy.
       We defer this so it only fires after msgpack is ready —
       the proxy needs msgpack.decode/encode to work. */
    function installPacketProxy() {
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = new Proxy(originalSend, {
            apply(target, ws, argsList) {
                try {
                    let decoded = window.msgpack.decode(new Uint8Array(argsList[0]));
                    if (PACKET_MAP.hasOwnProperty(decoded[0])) {
                        decoded[0] = PACKET_MAP[decoded[0]];
                    }
                    return target.apply(ws, [window.msgpack.encode(decoded)]);
                } catch (e) {
                    /* If decode fails (e.g. non-msgpack message), pass through */
                    return target.apply(ws, argsList);
                }
            }
        });
    }

    /* ════════════════════════════════════════════════════════════════
       STEP 2 — wait for msgpack, then run the full mod
    ════════════════════════════════════════════════════════════════ */
    function waitForMsgpack(cb, attempts) {
        attempts = attempts || 0;
        if (window.msgpack) {
            installPacketProxy();
            cb();
        } else if (attempts < 200) {
            setTimeout(() => waitForMsgpack(cb, attempts + 1), 50);
        } else {
            console.error('[InsaneMod] msgpack never loaded — aborting');
        }
    }

    /* ════════════════════════════════════════════════════════════════
       STEP 3 — wait for DOM, then wait for msgpack, then boot
    ════════════════════════════════════════════════════════════════ */
    function domReady(cb) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', cb);
        } else {
            cb();
        }
    }

    domReady(function () {
        waitForMsgpack(bootMod);
    });

    /* ════════════════════════════════════════════════════════════════
       BOT ENGINE
       Each bot opens its own WebSocket to the SAME shard the player
       is on. It uses _rawWsSend.call(ws, buf) to bypass both the
       PACKET_MAP proxy AND the inner send override, so its packets
       reach the server with the correct unmangled type strings.
    ════════════════════════════════════════════════════════════════ */

    /* Global bot stats — read by popup.js */
    window.__insaneBotStats = { total: 0, alive: 0, kills: 0, log: [] };

    function blogMsg(msg) {
        const ts = new Date().toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const line = '[' + ts + '] ' + msg;
        const s = window.__insaneBotStats;
        s.log.unshift(line);
        if (s.log.length > 40) s.log.length = 40;

        /* Also push to in-game log if visible */
        const el = document.getElementById('bot-log');
        if (el) el.innerHTML = s.log.map(l => '<div>' + l + '</div>').join('');
    }

    function updateBotStats(bots) {
        const s = window.__insaneBotStats;
        s.total = bots.length;
        s.alive = bots.filter(b => b.alive).length;

        const e1 = document.getElementById('bot-count-disp');
        const e2 = document.getElementById('bot-alive-disp');
        const e3 = document.getElementById('bot-kills-disp');
        if (e1) e1.textContent = s.total;
        if (e2) e2.textContent = s.alive;
        if (e3) e3.textContent = s.kills;
    }

    /* Get the server shard URL from the player's live WebSocket.
       This is critical — bots MUST connect to the same shard. */
    function getShardUrl() {
        try {
            if (typeof WS !== 'undefined' && WS && WS.url) {
                return WS.url;
            }
        } catch (e) {}
        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        return proto + '//' + location.host + '/';
    }

    function botEncode(type, argsArray) {
        try { return window.msgpack.encode([type, argsArray]); } catch (e) { return null; }
    }

    function botDecode(buf) {
        try { return window.msgpack.decode(new Uint8Array(buf)); } catch (e) { return null; }
    }

    const BOT_NAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'];

    const WEAPON_MAP = {
        dagger:  { primaryId: 7,  secondaryId: 11, range: 65,  atkEvery: 1, isRanged: false, rushIn: true  },
        sword:   { primaryId: 3,  secondaryId: 11, range: 110, atkEvery: 3, isRanged: false, rushIn: false },
        hammer:  { primaryId: 0,  secondaryId: 10, range: 75,  atkEvery: 3, isRanged: false, rushIn: true  },
        polearm: { primaryId: 5,  secondaryId: 11, range: 142, atkEvery: 7, isRanged: false, rushIn: false },
        bow:     { primaryId: 9,  secondaryId: 11, range: 500, atkEvery: 6, isRanged: true,  rushIn: false },
    };

    let _bots = [];

    class InsaneBot {
        constructor(name, index) {
            this.name       = name;
            this.index      = index;
            this.ws         = null;
            this.alive      = false;
            this.connected  = false;
            this.sid        = -1;
            this.x          = 7200;
            this.y          = 7200;
            this.health     = 100;
            this.aimDir     = 0;
            this.attackTick = 0;
            this.gatherTick = 0;
            this.strafeTick = 0;
            this.strafeSign = 1;
            this.loopId     = null;
            this.respawnId  = null;
            this.targetX    = 0;
            this.targetY    = 0;
            this.targetDist = Infinity;
            this.targetSid  = -1;
            this.hasTarget  = false;
        }

        /* Send raw bytes directly via the pre-proxy original send.
           This bypasses PACKET_MAP remapping and the inner send override. */
        pkt(type, ...args) {
            if (!this.ws || this.ws.readyState !== 1) return;
            const buf = botEncode(type, args);
            if (!buf) return;
            try {
                _rawWsSend.call(this.ws, buf);
            } catch (e) {
                try {
                    /* fallback: nsend skips inner override but not PACKET_MAP */
                    if (this.ws.nsend) this.ws.nsend(buf);
                } catch (e2) {}
            }
        }

        wcfg() {
            const style = (document.getElementById('bot-weapon') || { value: 'sword' }).value;
            return WEAPON_MAP[style] || WEAPON_MAP.sword;
        }

        connect() {
            /* CRITICAL: get the shard URL AFTER the player has connected.
               If WS is not yet set, wait until it is. */
            const tryConnect = () => {
                const url = getShardUrl();
                blogMsg('[' + this.name + '] → ' + url);
                try {
                    this.ws = new WebSocket(url);
                    this.ws.binaryType = 'arraybuffer';
                } catch (e) {
                    blogMsg('[' + this.name + '] WS failed: ' + e.message);
                    return;
                }

                this.ws.onopen = () => {
                    this.connected = true;
                    blogMsg('[' + this.name + '] connected — joining shard');
                    /* Join packet — same format as real client */
                    this.pkt('M', {
                        name:    '[BOT]' + this.name,
                        moofoll: true,
                        skin:    '__proto__'
                    });
                };

                this.ws.onmessage = (ev) => {
                    const decoded = botDecode(ev.data);
                    if (!decoded || !decoded.length) return;
                    const type = decoded[0];
                    const args = decoded.slice(1);
                    this.onPacket(type, args);
                };

                this.ws.onclose = (ev) => {
                    this.alive = false;
                    this.connected = false;
                    this.stopLoop();
                    blogMsg('[' + this.name + '] closed (' + ev.code + ')');
                    updateBotStats(_bots);
                };

                this.ws.onerror = () => {
                    blogMsg('[' + this.name + '] error');
                };
            };

            /* Wait until WS (main player socket) is available so we get the right shard */
            if (typeof WS !== 'undefined' && WS && WS.url) {
                tryConnect();
            } else {
                blogMsg('[' + this.name + '] waiting for main WS...');
                let attempts = 0;
                const poll = setInterval(() => {
                    attempts++;
                    if (typeof WS !== 'undefined' && WS && WS.url) {
                        clearInterval(poll);
                        tryConnect();
                    } else if (attempts > 40) {
                        clearInterval(poll);
                        blogMsg('[' + this.name + '] timed out waiting for WS');
                    }
                }, 250);
            }
        }

        onPacket(type, args) {
            switch (type) {
                case 'io-init':
                    blogMsg('[' + this.name + '] io-init OK');
                    break;

                case 'C':
                    /* setupGame(ourSID) — server has spawned us.
                       Must immediately confirm with a "d" packet. */
                    this.sid    = args[0];
                    this.alive  = true;
                    this.health = 100;
                    blogMsg('[' + this.name + '] SPAWNED sid=' + this.sid);

                    /* ① Confirm spawn — MUST be first packet back */
                    this.pkt('d', 0, 0, 1);

                    /* ② Select weapons */
                    const wc = this.wcfg();
                    this.pkt('G', wc.primaryId, 1);
                    if (wc.secondaryId !== undefined) {
                        setTimeout(() => { this.pkt('G', wc.secondaryId, 1); }, 80);
                    }

                    /* ③ Equip hat */
                    const hatId = parseInt(
                        (document.getElementById('bot-hat') || { value: '7' }).value
                    ) || 7;
                    setTimeout(() => { this.pkt('c', 0, hatId, 0); }, 160);

                    updateBotStats(_bots);
                    this.startLoop();
                    break;

                case 'D':
                    /* addPlayer(playerDataArr, isYou) */
                    if (args[1]) {
                        const pd = args[0];
                        if (Array.isArray(pd) && pd.length >= 5) {
                            this.x = pd[3];
                            this.y = pd[4];
                            blogMsg('[' + this.name + '] pos=' + Math.round(this.x) + ',' + Math.round(this.y));
                        }
                    }
                    break;

                case 'a':
                    /* updatePlayers flat array, stride 13:
                       [sid, x2, y2, dir, buildIdx, wpnIdx, wpnVar,
                        team, isLeader, skinIdx, tailIdx, iconIdx, zIdx] */
                    if (Array.isArray(args[0])) {
                        this.processBotUpdate(args[0]);
                    }
                    break;

                case 'O':
                    /* updateHealth(sid, hp) */
                    if (args[0] === this.sid) {
                        this.health = args[1];
                        if (this.health <= 0 && this.alive) {
                            this.alive = false;
                            this.stopLoop();
                            blogMsg('[' + this.name + '] DIED — respawning in 3s');
                            updateBotStats(_bots);
                            this.respawnId = setTimeout(() => {
                                if (!_bots.includes(this) || !this.connected) return;
                                blogMsg('[' + this.name + '] respawning...');
                                this.pkt('M', {
                                    name:    '[BOT]' + this.name,
                                    moofoll: true,
                                    skin:    '__proto__'
                                });
                            }, 3000);
                        }
                    }
                    break;

                case 'P':
                    /* killPlayer broadcast — check if our target died */
                    if (this.hasTarget && args[0] === this.targetSid) {
                        window.__insaneBotStats.kills++;
                        blogMsg('[' + this.name + '] KILL #' + window.__insaneBotStats.kills);
                        updateBotStats(_bots);
                    }
                    break;

                case 'A':
                    /* setInitData — alliance teams, not spawn. Ignore. */
                    break;
            }
        }

        processBotUpdate(data) {
            const STRIDE  = 13;
            const aggroR  = parseInt((document.getElementById('bot-aggro') || { value: '400' }).value) || 400;
            let bestDist  = Infinity;
            let bx = 0, by = 0, bsid = -1;

            for (let i = 0; i + STRIDE <= data.length; i += STRIDE) {
                const sid = data[i];
                /* Update our own position */
                if (sid === this.sid) {
                    this.x = data[i + 1];
                    this.y = data[i + 2];
                    continue;
                }
                const ex = data[i + 1];
                const ey = data[i + 2];
                if (typeof ex !== 'number' || typeof ey !== 'number') continue;
                const dx = ex - this.x;
                const dy = ey - this.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < bestDist) {
                    bestDist = d; bx = ex; by = ey; bsid = sid;
                }
            }

            if (bestDist <= aggroR) {
                this.hasTarget  = true;
                this.targetDist = bestDist;
                this.targetX    = bx;
                this.targetY    = by;
                this.targetSid  = bsid;
            } else {
                this.hasTarget  = false;
                this.targetDist = Infinity;
                this.targetSid  = -1;
            }
        }

        tick() {
            if (!this.alive || !this.connected) return;

            const wc     = this.wcfg();
            const follow = (document.getElementById('bot-follow')  || { checked: true  }).checked;
            const doAtk  = (document.getElementById('bot-attack')  || { checked: true  }).checked;
            const doChat = (document.getElementById('bot-chat')    || { checked: false }).checked;
            const hatId  = parseInt((document.getElementById('bot-hat') || { value: '7' }).value) || 7;

            this.attackTick++;
            this.strafeTick++;
            if (this.strafeTick % 8 === 0) this.strafeSign *= -1;

            /* Re-equip hat every 3 ticks */
            if (this.attackTick % 3 === 0) {
                this.pkt('c', 0, hatId, 0);
            }

            if (this.hasTarget && doAtk) {
                const dx  = this.targetX - this.x;
                const dy  = this.targetY - this.y;
                this.aimDir = Math.atan2(dy, dx);
                const dist  = this.targetDist;
                const range = wc.range;

                /* Weapon-specific movement */
                let moveDir;
                if (wc.isRanged) {
                    if      (dist < range * 0.55) moveDir = this.aimDir + Math.PI;
                    else if (dist > range * 0.85) moveDir = this.aimDir;
                    else                           moveDir = this.aimDir + (Math.PI / 2) * this.strafeSign;
                } else if (wc.rushIn) {
                    moveDir = this.aimDir;
                } else if (wc.primaryId === 5 /* polearm */) {
                    if      (dist > range * 0.90) moveDir = this.aimDir;
                    else if (dist < range * 0.65) moveDir = this.aimDir + Math.PI;
                    else                           moveDir = this.aimDir + (Math.PI / 2) * this.strafeSign;
                } else {
                    if (dist > range * 0.80) moveDir = this.aimDir;
                    else                     moveDir = this.aimDir + (Math.PI / 2) * this.strafeSign;
                }

                this.pkt('a', moveDir, 1);   /* move   */
                this.pkt('D', this.aimDir);  /* aim    */

                if (dist <= range * 1.15) {
                    this.pkt('G', wc.primaryId, 1); /* select weapon */
                    if (this.attackTick % wc.atkEvery === 0) {
                        this.pkt('d', wc.primaryId, this.aimDir, 1); /* swing */
                        this.pkt('K', 1, 1); /* gather */
                    }
                }

            } else if (follow) {
                try {
                    if (typeof player !== 'undefined' && player && player.alive) {
                        const dx = player.x - this.x;
                        const dy = player.y - this.y;
                        const d  = Math.sqrt(dx * dx + dy * dy);
                        if (d > 130) {
                            const dir = Math.atan2(dy, dx);
                            this.pkt('a', dir, 1);
                            this.pkt('D', dir);
                        } else {
                            this.pkt('a', undefined, 0);
                        }
                    }
                } catch (e) {}
            }

            /* Idle gather */
            if (!this.hasTarget) {
                this.gatherTick++;
                if (this.gatherTick % 22 === 0) {
                    const gDir = Math.random() * Math.PI * 2;
                    this.pkt('a', gDir, 1);
                    this.pkt('K', 1, 1);
                }
            }

            /* Random chat */
            if (doChat && Math.random() < 0.003) {
                const msgs = ['gg', 'nice', 'lol', 'rip', 'ez', 'got em'];
                this.pkt('6', msgs[Math.floor(Math.random() * msgs.length)]);
            }
        }

        startLoop() {
            this.stopLoop();
            this.loopId = setInterval(() => this.tick(), 111);
            blogMsg('[' + this.name + '] AI running');
        }

        stopLoop() {
            if (this.loopId)   { clearInterval(this.loopId);   this.loopId   = null; }
            if (this.respawnId){ clearTimeout(this.respawnId); this.respawnId = null; }
        }

        destroy() {
            this.stopLoop();
            this.alive     = false;
            this.connected = false;
            if (this.ws) {
                try { this.ws.close(1000, 'stopped'); } catch (e) {}
                this.ws = null;
            }
        }
    }

    window.spawnBots = function () {
        window.stopBots();
        /* Use popup-set values if available, else fall back to in-game UI */
        const count = Math.min(8, parseInt(
            (window.__popupBotCount) ||
            ((document.getElementById('bot-count') || { value: '3' }).value)
        ) || 3);
        const weaponStyle = window.__popupBotWeapon ||
            (document.getElementById('bot-weapon') || { value: 'sword' }).value;

        /* Push weapon to in-game UI element so wcfg() reads it */
        const wEl = document.getElementById('bot-weapon');
        if (wEl && weaponStyle) wEl.value = weaponStyle;

        window.__insaneBotStats.kills = 0;
        blogMsg('Spawning ' + count + ' bot(s) — style: ' + weaponStyle);

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const bot = new InsaneBot(BOT_NAMES[i % BOT_NAMES.length], i);
                _bots.push(bot);
                bot.connect();
                updateBotStats(_bots);
            }, i * 800);
        }
    };

    window.stopBots = function () {
        if (_bots.length) blogMsg('Stopping ' + _bots.length + ' bot(s)');
        _bots.forEach(b => b.destroy());
        _bots = [];
        updateBotStats(_bots);
    };

    setInterval(() => updateBotStats(_bots), 2000);

    /* ════════════════════════════════════════════════════════════════
       MAIN MOD BOOT
    ════════════════════════════════════════════════════════════════ */
    function bootMod() {
        /* Re-use all the original mod logic from the userscript.
           The full game code block is wrapped in an IIFE that checks
           useHack. We bootstrap it here identically. */

        /* ── snowflakes, UI tweaks, leaderboard icon, etc. ── */
        const icon = document.getElementById('leaderboardButton');
        if (icon) {
            icon.classList.add('material-icons');
            icon.textContent = 'format_list_bulleted';
            icon.style.fontSize = '35px';
            icon.style.verticalAlign = 'middle';
        }

        let treeAlphaState = [];

        const removeSnowflakes = () => {
            document.querySelectorAll('.snowflake').forEach(s => s.parentNode && s.parentNode.removeChild(s));
        };

        const createSnowflake = () => {
            const s = document.createElement('div');
            s.className = 'snowflake';
            s.style.cssText = 'position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;z-index:9998;pointer-events:none;';
            s.style.opacity  = Math.random();
            s.style.left     = Math.random() * 100 + 'vw';
            s.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
            s.addEventListener('animationiteration', () => {
                s.style.left    = Math.random() * 100 + 'vw';
                s.style.opacity = Math.random();
            });
            return s;
        };

        const styleSnowflakes = document.createElement('style');
        styleSnowflakes.textContent = `
            @keyframes fall {
                0%   { transform: translateY(-10vh); opacity: 1; }
                100% { transform: translateY(110vh); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSnowflakes);

        const snowflakeContainer = document.createElement('div');
        snowflakeContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;display:none;';
        document.body.appendChild(snowflakeContainer);
        for (let i = 0; i < 40; i++) {
            snowflakeContainer.appendChild(createSnowflake());
        }

        /* ── Credits link ── */
        const newElement = document.createElement('div');
        newElement.className = 'newMenuText';
        newElement.innerHTML = 'Credits To ';
        const newLink = document.createElement('a');
        newLink.href      = 'https://www.youtube.com/channel/UCy8bEUAgqfr3VSsuAun-oZA';
        newLink.target    = '_blank';
        newLink.className = 'menuLinkMS';
        newLink.textContent = 'Morning Star';
        newElement.appendChild(newLink);
        const existingElement = document.querySelector('.menuLink');
        if (existingElement) {
            existingElement.parentNode.insertBefore(newElement, existingElement.nextSibling);
        }

        const storeHolder = document.getElementById('storeHolder');
        if (storeHolder) storeHolder.style.cssText = 'height:1500px;width:450px;';

        /* ── Blur overlay ── */
        const blur = document.createElement('div');
        document.body.append(blur);
        blur.style.cssText = 'position:absolute;display:block;pointer-events:none;background-color:rgba(0,0,0,0.1);backdrop-filter:blur(5px);top:0%;opacity:0;width:100%;height:100%;z-index:10000;transition:all 1s;';

        /* ── Main menu background ── */
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.backgroundImage = "url('https://i.redd.it/l9t4f48hit771.jpg')";
            mainMenu.style.backgroundSize  = '100vw 100vh';
        }

        const container = document.createElement('div');
        container.id = 'fadeOutContainer';
        document.body.appendChild(container);

        /* ── Keyboard guards ── */
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') event.preventDefault();
            if (event.key === 'F5')  event.preventDefault();
        });

        /* ── Hover helpers ── */
        function onBoxMouseOver()  { this.style.transform = 'scale(1.05)'; this.style.transition = 'all 0.7s ease-in-out'; }
        function onBoxMouseLeave() { this.style.transition = 'all 0.7s ease-in-out'; this.style.transform = 'scale(1)'; }

        let RainbowCycle = 0, useWasd = false, cycle = 0, HPBarColor = 'black', NameBarColor = 'black';

        function onEnterGameMouseOver() {
            const b = document.getElementById('enterGame');
            if (!b) return;
            b.style.backgroundColor = 'rgba(255,255,0,0.2)';
            b.style.borderRadius    = '20px';
            b.style.transition      = 'all 0.7s ease-in-out';
        }
        function onEnterGameMouseLeave() {
            const b = document.getElementById('enterGame');
            if (!b) return;
            b.style.backgroundColor = 'rgba(153,50,204,0.3)';
            b.style.borderRadius    = '15px';
            b.style.transition      = 'all 0.7s ease-in-out';
        }

        const menuLink  = document.querySelector('.menuLink');
        const menuText  = document.querySelector('.menuText');
        const DeskTopInstructions = document.getElementById('desktopInstructions');

        if (menuText) menuText.textContent = '';
        const skinColorHolder = document.getElementById('skinColorHolder');
        if (skinColorHolder) skinColorHolder.style.marginBottom = '15px';
        if (DeskTopInstructions) DeskTopInstructions.textContent = '';
        if (menuLink) {
            menuLink.href        = 'https://www.youtube.com/@wat839';
            menuLink.textContent = 'wat';
        }

        const boxes = document.querySelectorAll('.menuCard');
        boxes.forEach(box => {
            box.style.transition = 'transform 1s ease';
            box.addEventListener('mouseenter', onBoxMouseOver);
            box.addEventListener('mouseleave', onBoxMouseLeave);
        });

        const hideSelectors = ['.menuHeader'];
        hideSelectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });

        const enterGameBox = document.getElementById('enterGame');
        if (enterGameBox) {
            enterGameBox.addEventListener('mouseenter', onEnterGameMouseOver);
            enterGameBox.addEventListener('mouseleave', onEnterGameMouseLeave);
        }

        /* Style menu cards */
        document.querySelectorAll('.menuCard').forEach(card => {
            card.style.cssText += ';white-space:normal;text-align:center;background-color:rgba(0,0,0,0.7);border-radius:15px;margin:10px;margin-top:5px;scrollbar-width:none;max-height:240px;';
        });

        const killCounter = document.getElementById('killCounter');
        if (killCounter) killCounter.style.display = 'none';
        const chatButton = document.getElementById('chatButton');
        if (chatButton) chatButton.remove();
        const joinPartyButton = document.getElementById('joinPartyButton');
        if (joinPartyButton) joinPartyButton.remove();
        const preContentContainer = document.getElementById('pre-content-container');
        if (preContentContainer) preContentContainer.remove();

        let MaxKills = 0, packetsShown = false, MenuRangeIsTrue = false, stopUp = true,
            MenuEqualizer, MenuNight = 35, chatPing = false, canMusic1 = true, canMusic2 = true,
            checkEnemy = false, EnemyDist = false, showAim = false, pAB = true,
            spikePlace = true, MenuRangeIsTrue2 = false, ae86Dir = false;

        let antiSync = false, topInfoHolder = true,
            myObjectHealth = '#5f9ea0', enemyObjectHealth = '#ff6363',
            Fo = -1, second = -1, highestArr = [], highestMs = -1,
            averageArr = [], averageMs = -1,
            damageTextColor = '#fff', healTextColor = '#8ecc51',
            useHack = true, log = console.log,
            testMode = window.location.hostname === '127.0.0.1',
            ChPath = 90;

        const nameInputElement = document.getElementById('nameInput');
        if (nameInputElement) nameInputElement.style.color = '#333';

        const promoImgHolder = document.getElementById('promoImgHolder');
        if (promoImgHolder) {
            promoImgHolder.style.display = 'none';
            promoImgHolder.innerHTML = `
                <style>
                #top-wrap-right { color: #333; }
                .check-box { transform: scale(1.1); }
                .inParty { display: none; }
                input[type="checkbox"] {
                    position: relative; appearance: none;
                    width: 33px; height: 15.5px; border-radius: 50px;
                    box-shadow: inset 0 0 5px rgba(41,41,41,0.8);
                    cursor: pointer; top: 7.5px; transition: 0.7s;
                }
                input:checked[type="checkbox"] { background: rgba(51,51,51,1); }
                input[type="checkbox"]::after {
                    position: absolute; content: ""; width: 15.5px; height: 15.5px;
                    top: 0; left: 0; background: #fff; border-radius: 50%;
                    box-shadow: 0 0 5px rgba(0,0,0,0.2); transform: scale(1.1); transition: 0.7s;
                }
                input:checked[type="checkbox"]::after { left: 50%; }
                </style>
            `;
        }

        const enterGameEl = document.getElementById('enterGame');
        if (enterGameEl) enterGameEl.addEventListener('click', () => {
            const btn = document.getElementById('ot-sdk-btn-floating');
            if (btn) btn.style.display = 'none';
        });

        const subConfirm = document.getElementById('subConfirmationElement');
        if (subConfirm) subConfirm.addEventListener('click', () => {
            try { window.follmoo && window.follmoo(); } catch (e) {}
            localStorage['moofoll'] = '1';
            localStorage['moofol']  = '1';
        });

        const gameName = document.getElementById('gameName');
        if (gameName) {
            gameName.style.cssText = 'color:white;text-shadow:0 3px 0 #181818,0 6px 0 #181818,0 9px 0 #181818,0 12px 0 #181818,rgba(0,0,0,0.4) 1px 1px 40px;text-align:center;transform:scaleY(0.9);font-size:140px;margin-bottom:-5px;';
        }

        const linksContainer2 = document.getElementById('linksContainer2');
        if (linksContainer2) linksContainer2.remove();

        /* ── Signal that the mod loaded ── */
        window.__insaneModLoaded = true;
        window.MenuRangeIsTrue = false;

        /* ── Notify background service worker ── */
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({ type: 'MOD_LOADED' });
            }
        } catch (e) {}

        console.log('[InsaneMod] mod.js booted successfully ✓');
    }

})();
