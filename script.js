const CATEGORIES = {
    utility: [
        { name: 'ping', desc: 'Checks the module connection and data latency' },
        { name: 'info', desc: 'Access global terminal and bot classification data' },
        { name: 'serverinfo', desc: 'Scan parameters and data regarding the current node' },
        { name: 'userinfo', desc: 'Pull system file and data on a specific user' },
        { name: 'avatar', desc: 'Extract a high-resolution user image file' },
        { name: 'servericon', desc: 'Extract the high-resolution icon of the current Nexus node' },
        { name: 'math', desc: 'Process a central intelligence operation' },
        { name: 'timer', desc: 'Initiate a synchronized countdown pulse' },
        { name: 'poll', desc: 'Fire up a quick community consensus vote' },
        { name: 'remind', desc: 'Have the system keep tabs on something for you' },
        { name: 'translate', desc: 'Translate text across language protocols' },
        { name: 'weather', desc: 'Pull atmospheric data for a location' },
        { name: 'profile', desc: 'View a comprehensive operative dossier' }
    ],
    economy: [
        { name: 'balance', desc: 'Scan current credit reserves and net worth' },
        { name: 'daily', desc: 'Receive your daily Nexus Credit allocation (streak bonus!)' },
        { name: 'work', desc: 'Execute a gig to earn Nexus Credits (scales with level)' },
        { name: 'rob', desc: 'Execute a cyber-heist on another user\'s local wallet' },
        { name: 'transfer', desc: 'Initiate an encrypted credit transfer' },
        { name: 'leaderboard', desc: 'Displays the top operatives by net worth' },
        { name: 'shop', desc: 'Access the underground hardware catalog (8 items!)' },
        { name: 'buy', desc: 'Acquire hardware from the shop' },
        { name: 'inventory', desc: 'View your locally stored items' },
        { name: 'quests', desc: 'Initialize your daily active sub-routines for credit bounties' }
    ],
    casino: [
        { name: 'blackjack', desc: 'Engage in a high-stakes protocol against the dealer' },
        { name: 'slots', desc: 'Wager credits on the random number generator' },
        { name: 'coinflip', desc: 'Execute a boolean 50/50 algorithm' }
    ],
    leveling: [
        { name: 'rank', desc: 'Analyze your current security clearance and XP progress' }
    ],
    moderation: [
        { name: 'ban', desc: 'Permanently sever a user from the node' },
        { name: 'kick', desc: 'Temporarily sever a user from the node' },
        { name: 'warn', desc: 'Issue a formal protocol strike to an entity' },
        { name: 'purge', desc: 'Initiate a mass data deletion in the current channel' },
        { name: 'lock', desc: 'Engage firewall on the current channel' },
        { name: 'unlock', desc: 'Disengage firewall on the current channel' },
        { name: 'slowmode', desc: 'Throttle output bandwidth in the current channel' },
        { name: 'say', desc: 'Transmit a cleartext message through the Nexus' },
        { name: 'verify-setup', desc: 'Drop a secure verification portal (Admin Only)' },
        { name: 'ticket-setup', desc: 'Deploy a support ticket interface' },
        { name: 'automod-setup', desc: 'Configure automatic network filters for spam and unauthorized uplinks' },
        { name: 'log-setup', desc: 'Establish an audit logging channel for purged and modified transmissions' },
        { name: 'starboard-setup', desc: 'Initialize a starboard node to archive highlighted transmissions' }
    ],
    fun: [
        { name: '8ball', desc: 'Query the Oracle array for a yes/no outcome' },
        { name: 'joke', desc: 'Process a humorous data packet' },
        { name: 'fact', desc: 'Extract an interesting file from the database' },
        { name: 'quote', desc: 'Extract an inspirational transmission' },
        { name: 'roll', desc: 'Execute a randomized integer sequence' },
        { name: 'rps', desc: 'Simulate Rock, Paper, Scissors against the CPU' },
        { name: 'trivia', desc: 'Process a trivia data packet' },
        { name: 'hack', desc: 'Initiate a harmless penetration test on a target' },
        { name: 'emojify', desc: 'Convert text data into an encrypted emoji string' }
    ],
    advanced: [
        { name: 'cyber-heist', desc: 'Execute a high-stakes multi-phase heist operation' },
        { name: 'giveaway', desc: 'Airdrop resources to the community' },
        { name: 'network-stats', desc: 'Display real-time shard and gateway diagnostics' },
        { name: 'shards', desc: 'View active shard processes and their health' }
    ],
    media: [
        { name: 'cat', desc: 'Fetches biological data on Felines' },
        { name: 'dog', desc: 'Fetches biological data on Canines' },
        { name: 'meme', desc: 'Intercepts top-tier humorous media' },
        { name: 'urban', desc: 'Query the Urban data archives for slang definitions' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const nav = document.querySelector('nav');
    const tabContainer = document.getElementById('category-tabs');
    const commandList = document.getElementById('command-list');
    const searchInput = document.getElementById('command-search');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    let activeCategory = 'utility';

    // --- Hamburger Menu ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Navbar scroll effect ---
    window.addEventListener('scroll', () => {
        if (nav && window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else if (nav) {
            nav.classList.remove('scrolled');
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Command Rendering (let allows safe wrapping for hover re-attach) ---
    let renderCommands = function renderCommands(filter = '') {
        if (!commandList) return;
        
        commandList.innerHTML = '';
        let commandsToDisplay = [];
        
        if (filter.trim()) {
            Object.values(CATEGORIES).forEach(list => {
                const matches = list.filter(cmd => 
                    cmd.name.toLowerCase().includes(filter.toLowerCase()) || 
                    cmd.desc.toLowerCase().includes(filter.toLowerCase())
                );
                commandsToDisplay.push(...matches);
            });
            if (tabContainer) tabContainer.style.display = 'none';
        } else {
            commandsToDisplay = CATEGORIES[activeCategory] || [];
            if (tabContainer) tabContainer.style.display = 'flex';
        }

        if (commandsToDisplay.length === 0) {
            commandList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-dim);">No command signals found.</div>';
            return;
        }

        commandsToDisplay.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.style.animationDelay = `${index * 0.05}s`;
            div.innerHTML = `
                <div class="cmd-name">
                    <span>/${cmd.name}</span>
                    <span class="cmd-copy">Copy</span>
                </div>
                <p class="cmd-desc">${cmd.desc}</p>
            `;

            div.onclick = () => {
                navigator.clipboard.writeText(`/${cmd.name}`).then(() => {
                    const copySpan = div.querySelector('.cmd-copy');
                    if (copySpan) {
                        copySpan.innerText = 'COPIED';
                        copySpan.style.color = 'var(--primary)';
                        setTimeout(() => {
                            copySpan.innerText = 'COPY';
                            copySpan.style.color = 'inherit';
                        }, 2000);
                    }
                });
            };

            commandList.appendChild(div);
        });
    };

    // Tabs
    if (tabContainer) {
        tabContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('tab-btn')) {
                activeCategory = e.target.dataset.category;
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderCommands();
            }
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderCommands(e.target.value);
        });
    }

    // --- Animated Stats Counter ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            if (Number.isNaN(target) || counter.dataset.done) return;

            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + suffix;
                    counter.dataset.done = 'true';
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(updateCounter);
                }
            };

            // Start animation when in viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !counter.dataset.done) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    animateCounters();

    // --- Operations Feed Typing Effect ---
    const opsFeed = document.getElementById('ops-feed');
    if (opsFeed) {
        const opsMessages = [
            { time: '21:52:10', module: 'SHARD_0', msg: 'Initializing neural level sync for guild_8829...', status: 'SUCCESS', statusClass: 'ops-success' },
            { time: '21:52:12', module: 'FIREWALL', msg: 'Unauthorized breach attempt detected in sector_G4. Blocking vector...', status: 'BLOCKED', statusClass: 'ops-error' },
            { time: '21:52:15', module: 'CORE', msg: 'Global heartbeat pulse emitted. Latency: 18ms.', status: '', statusClass: '' },
            { time: '21:52:20', module: 'UPLINK', msg: 'Gateway handshake confirmed with Discord API nodes.', status: '', statusClass: '' },
            { time: '21:52:25', module: 'ECONOMY', msg: 'Batching 4,821 credit transactions to global ledger...', status: '', statusClass: '' },
            { time: '21:52:28', module: 'XP_SYS', msg: 'Distributed 27 XP to operative_0092. Level check: PASS.', status: '', statusClass: '' },
            { time: '21:52:30', module: 'CASINO', msg: 'Slot terminal spin registered. Result: 💎💎🍋 — MINOR GAIN.', status: '', statusClass: '' },
            { time: '21:52:33', module: 'SECURITY', msg: 'Anti-spam module throttled entity_4412 in sector_B2.', status: 'THROTTLED', statusClass: 'ops-error' },
            { time: '21:52:35', module: 'SHARD_0', msg: 'Processing /PROFILE request from entity_0055...', status: 'OK', statusClass: 'ops-success' },
        ];

        let lineIndex = 0;

        function addOpsLine() {
            if (lineIndex >= opsMessages.length) {
                // Loop back
                lineIndex = 0;
                opsFeed.innerHTML = '';
            }

            const entry = opsMessages[lineIndex];
            const line = document.createElement('div');
            line.className = 'ops-line';
            line.innerHTML = `<span class="ops-timestamp">[${entry.time}]</span> <span class="ops-module">${entry.module}</span>: ${entry.msg}${entry.status ? ` <span class="${entry.statusClass}">${entry.status}</span>` : ''}`;
            
            // Remove cursor if exists
            const cursor = opsFeed.querySelector('.ops-cursor');
            if (cursor) cursor.remove();

            opsFeed.appendChild(line);

            // Re-add cursor
            const cursorEl = document.createElement('div');
            cursorEl.className = 'ops-cursor';
            cursorEl.textContent = '_ LISTENING_FOR_TRAFFIC...';
            opsFeed.appendChild(cursorEl);

            // Auto-scroll
            opsFeed.scrollTop = opsFeed.scrollHeight;

            lineIndex++;
        }

        // Start the feed
        addOpsLine();
        setInterval(addOpsLine, 3000);
    }

    // --- Reveal on Scroll ---
    const reveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal();

    // --- Parallax Effect ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const grid = document.querySelector('.grid-overlay');
        if (grid) {
            grid.style.transform = `perspective(1000px) rotateX(60deg) translate(${x}px, ${y}px)`;
        }

        const hero = document.querySelector('.hero-title');
        if (hero) {
            hero.style.transform = `translate(${x * -0.2}px, ${y * -0.2}px)`;
        }
    });

    // Initial render
    if (commandList) {
        renderCommands();
    }

    // --- Custom Cursor ---
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorTrail);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let trailX = mouseX, trailY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const updateCursor = () => {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;

        requestAnimationFrame(updateCursor);
    };
    updateCursor();

    const addHoverClass = () => document.body.classList.add('clickable-hover');
    const removeHoverClass = () => document.body.classList.remove('clickable-hover');

    const attachHoverToInteractive = () => {
        document.querySelectorAll('a, button, .cmd-item, .card').forEach(el => {
            el.addEventListener('mouseenter', addHoverClass);
            el.addEventListener('mouseleave', removeHoverClass);
        });
    };
    attachHoverToInteractive();
    // Re-attach hover when commands are re-rendered
    if (tabContainer || searchInput) {
        const originalRender = renderCommands;
        renderCommands = (filter) => {
            originalRender(filter);
            setTimeout(attachHoverToInteractive, 50);
        };
        // Run once manually to catch initial render
        setTimeout(attachHoverToInteractive, 50);
    }

    // --- Particle Network Canvas ---
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 234, 0.5)';
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 234, ${0.2 - dist/600})`;
                        ctx.stroke();
                    }
                }
                
                // Interactive distance to mouse
                const mdx = particles[i].x - mouseX;
                const mdy = particles[i].y - mouseY;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(157, 0, 255, ${0.4 - mDist/375})`;
                    ctx.stroke();
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // --- Dynamic Network Background Injection (If missing) ---
    if (!document.getElementById('network-canvas')) {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'nexus-bg';
        bgContainer.innerHTML = `
            <canvas id="network-canvas"></canvas>
            <div class="grid-overlay"></div>
            <div class="scanline"></div>
        `;
        document.body.prepend(bgContainer);
        // Reload location to trigger the canvas script initialized above (requires small refactor or just run it inline, easier to just reload if needed)
        // Actually, since we already missed the initialization above, let's just use CSS background if we don't want to re-execute. 
        // We will just leave it as is or the user will need to refresh.
    }

    // --- Dynamic Scroll-to-Top Button ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- FAQ Accordions ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Live Bot Stats Integration (same origin when site is served by the bot's Express static host) ---
    fetch('/api/stats', { credentials: 'same-origin' })
        .then(res => {
            if (!res.ok) throw new Error('API offline');
            return res.json();
        })
        .then(data => {
            const guilds = typeof data.guilds === 'number' ? data.guilds : 0;
            const ping = typeof data.ping === 'number' ? data.ping : 0;
            const shards = Math.max(1, data.shards || 1);

            const counters = document.querySelectorAll('.stat-number');
            if (counters.length >= 1) {
                const c0 = counters[0];
                if (c0.dataset.done) {
                    c0.textContent = `${guilds.toLocaleString()}+`;
                } else {
                    c0.dataset.target = String(guilds);
                }
            }

            document.querySelectorAll('[data-stat="latency"]').forEach(el => {
                el.textContent = `${ping}ms`;
            });
            document.querySelectorAll('[data-stat="shards"]').forEach(el => {
                const s = String(shards).padStart(3, '0');
                el.textContent = `${s} / ${s}`;
            });

            const shardHealth = document.querySelector('.shard-item');
            if (shardHealth) {
                shardHealth.innerHTML = `
                    <span style="color: var(--primary); font-family: 'JetBrains Mono'; font-size: 0.8rem;">SHARD_ACTIVE (${shards})</span>
                    <div style="font-size: 0.6rem; color: var(--text-dim);">UPLINK: ACTIVE | LATENCY: ${ping}ms</div>
                `;
            }
        })
        .catch(() => {
            /* Static preview or API down — placeholder values remain */
        });
});
