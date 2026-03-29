/**
 * Insane Mod — popup.js
 * Handles popup UI, live stats, bot controls, and page communication.
 */

'use strict';

/* ── Helpers ── */
const $ = id => document.getElementById(id);

function setStatus(text, badge, badgeClass) {
    const st = $('status-text');
    const sb = $('status-badge');
    const dot = $('status-dot');
    if (st) st.textContent = text;
    if (sb) {
        sb.textContent = badge;
        sb.className = badgeClass || '';
    }
    if (dot) {
        dot.className = 'status-dot ' + (badgeClass === 'ok' ? 'active' : badgeClass === 'err' ? 'inactive' : '');
    }
}

function addLog(msg) {
    const log = $('bot-log-popup');
    if (!log) return;
    if (log.textContent === 'No events yet.') log.innerHTML = '';
    const d = document.createElement('div');
    const ts = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    d.textContent = '[' + ts + '] ' + msg;
    log.insertBefore(d, log.firstChild);
    while (log.children.length > 30) log.removeChild(log.lastChild);
}

/* ── Get the active moomoo.io tab ── */
async function getMooTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab) return null;
    if (tab.url && (tab.url.includes('moomoo.io'))) return tab;
    /* If current tab isn't moomoo, find any moomoo tab */
    const mooTabs = await chrome.tabs.query({ url: ['*://moomoo.io/*', '*://*.moomoo.io/*'] });
    return mooTabs[0] || null;
}

/* ── Execute a function in the page (MAIN world) ── */
async function pageExec(tab, func, args) {
    if (!tab) return null;
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            world: 'MAIN',
            func: func,
            args: args || []
        });
        return results && results[0] ? results[0].result : null;
    } catch (e) {
        console.warn('[InsaneMod popup] pageExec failed:', e.message);
        return null;
    }
}

/* ── Poll live stats from the page ── */
async function pollStats(tab) {
    if (!tab) return;

    const result = await pageExec(tab, function () {
        /* Read stats written to window by the mod */
        return {
            loaded:   !!window.__insaneModLoaded,
            bots:     (window.__insaneBotStats && window.__insaneBotStats.total)  || 0,
            alive:    (window.__insaneBotStats && window.__insaneBotStats.alive)  || 0,
            kills:    (window.__insaneBotStats && window.__insaneBotStats.kills)  || 0,
            log:      (window.__insaneBotStats && window.__insaneBotStats.log)    || [],
            inGame:   !!window.inGame,
            wsUrl:    (window.WS && window.WS.url) ? window.WS.url : null,
        };
    });

    if (!result) {
        setStatus('Not on MooMoo or page not ready', '—', '');
        return;
    }

    if (result.loaded) {
        setStatus(
            result.inGame
                ? 'In game · ' + (result.wsUrl ? result.wsUrl.replace('wss://', '').split('/')[0] : '?')
                : 'On MooMoo · waiting for game',
            result.inGame ? 'IN GAME' : 'MENU',
            'ok'
        );
    } else {
        setStatus('Mod injecting...', 'LOADING', '');
        $('status-dot').classList.add('pulsing');
    }

    /* Update stat chips */
    const bv = $('stat-bots');   if (bv) bv.textContent = result.bots;
    const av = $('stat-alive');  if (av) av.textContent = result.alive;
    const kv = $('stat-kills');  if (kv) kv.textContent = result.kills;

    /* Update log */
    const log = $('bot-log-popup');
    if (log && Array.isArray(result.log) && result.log.length) {
        log.innerHTML = result.log
            .slice(0, 30)
            .map(l => '<div>' + escHtml(l) + '</div>')
            .join('');
    }
}

function escHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/* ── Sync popup weapon/count inputs to page ── */
async function syncSettingsToPage(tab) {
    const weapon = $('popup-weapon') ? $('popup-weapon').value : 'sword';
    const count  = $('popup-count')  ? parseInt($('popup-count').value) : 3;

    await pageExec(tab, function (weapon, count) {
        /* Push settings into the page's UI elements so spawnBots() picks them up */
        const w = document.getElementById('bot-weapon');
        const c = document.getElementById('bot-count');
        if (w) w.value = weapon;
        if (c) c.value = count;
        /* Also store on window for direct access */
        window.__popupBotWeapon = weapon;
        window.__popupBotCount  = count;
    }, [weapon, count]);
}

/* ── Button handlers ── */
async function handleSpawn() {
    const tab = await getMooTab();
    if (!tab) { addLog('No MooMoo tab found'); return; }
    await syncSettingsToPage(tab);
    await pageExec(tab, function () {
        if (typeof window.spawnBots === 'function') {
            window.spawnBots();
        } else {
            console.warn('[InsaneMod] spawnBots not ready');
        }
    });
    addLog('Spawn command sent');
}

async function handleStop() {
    const tab = await getMooTab();
    if (!tab) { addLog('No MooMoo tab found'); return; }
    await pageExec(tab, function () {
        if (typeof window.stopBots === 'function') {
            window.stopBots();
        }
    });
    addLog('Stop command sent');
}

async function handleMenu() {
    const tab = await getMooTab();
    if (!tab) { addLog('No MooMoo tab found'); return; }
    await pageExec(tab, function () {
        /* Toggle MenuRangeIsTrue which the mod watches to open/close the modal */
        if (typeof window.MenuRangeIsTrue !== 'undefined') {
            window.MenuRangeIsTrue = !window.MenuRangeIsTrue;
        }
    });
    addLog('Menu toggled');
}

async function handleReload() {
    const tab = await getMooTab();
    if (!tab) { addLog('No MooMoo tab found'); return; }
    chrome.tabs.reload(tab.id);
    addLog('Page reloading...');
}

/* ── Clock ── */
function updateClock() {
    const el = $('clock-foot');
    if (el) el.textContent = new Date().toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

/* ── Init ── */
async function init() {
    updateClock();
    setInterval(updateClock, 1000);

    /* Wire up slider */
    const countSlider = $('popup-count');
    const countVal    = $('popup-count-val');
    if (countSlider && countVal) {
        countSlider.addEventListener('input', () => {
            countVal.textContent = countSlider.value;
        });
    }

    /* Wire up buttons */
    const spawnBtn  = $('btn-spawn');
    const stopBtn   = $('btn-stop');
    const menuBtn   = $('btn-menu');
    const reloadBtn = $('btn-reload');

    if (spawnBtn)  spawnBtn.addEventListener('click',  handleSpawn);
    if (stopBtn)   stopBtn.addEventListener('click',   handleStop);
    if (menuBtn)   menuBtn.addEventListener('click',   handleMenu);
    if (reloadBtn) reloadBtn.addEventListener('click', handleReload);

    /* Initial status check */
    const tab = await getMooTab();
    if (!tab) {
        setStatus('Open moomoo.io first', 'NOT FOUND', 'err');
        addLog('No MooMoo tab detected. Open moomoo.io.');
        return;
    }

    /* Check if the page is a moomoo.io game page */
    setStatus('Connecting...', '...', '');
    await pollStats(tab);

    /* Poll every 1.5s */
    setInterval(async () => {
        const t = await getMooTab();
        if (t) await pollStats(t);
    }, 1500);
}

document.addEventListener('DOMContentLoaded', init);
