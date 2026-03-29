(function() {
    'use strict';

    // SVG Icons
    const ICONS = {
        combat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-crosshair"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>`,
        visuals: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        bots: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
        stats: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };

    class InsaneMenu {
        constructor() {
            this.container = null;
            this.activeTab = 'combat';
            this.config = window.__insaneConfig || {
                autoHeal: true,
                autoPlace: true,
                instaKill: false,
                wallHack: true,
                esp: true,
                botCount: 0,
                fps: 60,
                ping: 0
            };
            this.init();
        }

        init() {
            this.createDOM();
            this.attachEvents();
            this.updateStats();
        }

        createDOM() {
            const menu = document.createElement('div');
            menu.id = 'insane-menu';
            menu.className = 'hidden';
            menu.innerHTML = `
                <div id="insane-header">
                    <div class="header-title">
                        <h1>INSANE MOD</h1>
                        <span style="font-size: 10px; opacity: 0.5;">v4.1.0</span>
                    </div>
                    <div class="header-stats">
                        <div class="stat-item">FPS: <span id="fps-val">60</span></div>
                        <div class="stat-item">PING: <span id="ping-val">0</span>ms</div>
                        <div class="stat-item">BOTS: <span id="bots-val">0</span></div>
                    </div>
                </div>
                <div id="insane-body">
                    <div id="insane-sidebar">
                        <div class="sidebar-btn active" data-tab="combat">
                            ${ICONS.combat} Combat
                        </div>
                        <div class="sidebar-btn" data-tab="visuals">
                            ${ICONS.visuals} Visuals
                        </div>
                        <div class="sidebar-btn" data-tab="bots">
                            ${ICONS.bots} Bots
                        </div>
                        <div class="sidebar-btn" data-tab="stats">
                            ${ICONS.stats} Stats
                        </div>
                    </div>
                    <div id="insane-content">
                        <div id="combat" class="tab-pane active">
                            <h2 style="margin-bottom: 20px;">Combat Systems</h2>
                            <div class="settings-grid">
                                ${this.createToggleCard('Auto Heal', 'Automatically eats food when health is low.', 'autoHeal')}
                                ${this.createToggleCard('Insta Kill', 'Advanced weapon and hat combos for maximum damage.', 'instaKill')}
                                ${this.createToggleCard('Auto Place', 'Automatically replaces destroyed buildings.', 'autoPlace')}
                                ${this.createToggleCard('Protect', 'Automatically places spikes/traps around you.', 'protect')}
                            </div>
                        </div>
                        <div id="visuals" class="tab-pane">
                            <h2 style="margin-bottom: 20px;">Visual Enhancements</h2>
                            <div class="settings-grid">
                                ${this.createToggleCard('Wall Hack', 'See through trees, rocks, and buildings.', 'wallHack')}
                                ${this.createToggleCard('ESP', 'View player name, health, and distance.', 'esp')}
                                ${this.createToggleCard('Tracers', 'Draw lines toward nearby enemies.', 'tracers')}
                                ${this.createToggleCard('Map Guide', 'Enhanced mini-map features.', 'mapGuide')}
                            </div>
                        </div>
                        <div id="bots" class="tab-pane">
                            <h2 style="margin-bottom: 20px;">Bot Management</h2>
                            <div class="settings-grid">
                                ${this.createToggleCard('Auto Spawn', 'Automatically respawn bots when they die.', 'botAutoSpawn')}
                                ${this.createToggleCard('Aggressive', 'Bots will actively attack nearby players.', 'botAggressive')}
                            </div>
                            <div style="margin-top: 24px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                                <h3>Bot Control</h3>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <button onclick="window.spawnInsecureBot()" style="flex: 1; padding: 10px; background: var(--accent-color); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">Spawn 1 Bot</button>
                                    <button onclick="window.clearBots()" style="flex: 1; padding: 10px; background: #ef4444; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">Clear All Bots</button>
                                </div>
                            </div>
                        </div>
                        <div id="stats" class="tab-pane">
                            <h2 style="margin-bottom: 10px;">Live Statistics</h2>
                            <div id="log-container" style="height: 300px; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 11px; overflow-y: auto; color: #a5b4fc;">
                                [SYSTEM] Mod initialized...<br>
                                [SYSTEM] Waiting for socket connection...<br>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(menu);
            this.container = menu;
        }

        createToggleCard(name, desc, key) {
            const isActive = this.config[key];
            return `
                <div class="setting-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="setting-info">
                            <h3>${name}</h3>
                            <p>${desc}</p>
                        </div>
                        <div class="toggle-switch ${isActive ? 'active' : ''}" data-key="${key}"></div>
                    </div>
                </div>
            `;
        }

        attachEvents() {
            // Dragging
            const header = this.container.querySelector('#insane-header');
            let isDragging = false;
            let offset = { x: 0, y: 0 };

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offset.x = e.clientX - this.container.offsetLeft;
                offset.y = e.clientY - this.container.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                this.container.style.left = (e.clientX - offset.x) + 'px';
                this.container.style.top = (e.clientY - offset.y) + 'px';
                this.container.style.transform = 'none'; // Clear translate(-50%, -50%)
            });

            document.addEventListener('mouseup', () => isDragging = false);

            // Tab Switching
            this.container.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.getAttribute('data-tab');
                    this.switchTab(tabId);
                });
            });

            // Toggles
            this.container.querySelectorAll('.toggle-switch').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const key = toggle.getAttribute('data-key');
                    this.config[key] = !this.config[key];
                    toggle.classList.toggle('active');
                    
                    // Sync with global config
                    window.__insaneConfig = this.config;
                    this.log(`Toggled ${key}: ${this.config[key] ? 'ON' : 'OFF'}`);
                });
            });

            // Keyboard Toggle (Escape or F1)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Shift' || e.code === 'ShiftRight') {
                    this.container.classList.toggle('hidden');
                }
            });
        }

        switchTab(tabId) {
            this.container.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
            });
            this.container.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.id === tabId);
            });
            this.activeTab = tabId;
        }

        log(msg) {
            const logBox = this.container.querySelector('#log-container');
            const time = new Date().toLocaleTimeString();
            logBox.innerHTML += `[${time}] ${msg}<br>`;
            logBox.scrollTop = logBox.scrollHeight;
        }

        updateStats() {
            setInterval(() => {
                if (window.__insaneStats) {
                    this.container.querySelector('#fps-val').textContent = Math.round(window.__insaneStats.fps || 60);
                    this.container.querySelector('#ping-val').textContent = window.__insaneStats.ping || 0;
                    this.container.querySelector('#bots-val').textContent = window.__insaneBotCount || 0;
                }
            }, 500);
        }
    }

    // Initialize the menu
    window.onload = () => {
        window.__insaneMenu = new InsaneMenu();
    };
})();
