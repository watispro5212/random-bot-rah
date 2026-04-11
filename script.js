const CATEGORIES = {
    utility: [
        { name: 'help', desc: 'Interactive diagnostic protocol menu.' },
        { name: 'ping', desc: 'Check connection latency to the Nexus core.' },
        { name: 'serverinfo', desc: 'Comprehensive scan of current guild parameters.' },
        { name: 'weather', desc: 'Query atmospheric mapping sensors.' },
        { name: 'botinfo', desc: 'Technical specifications of the Nexus unit.' },
        { name: 'invite', desc: 'Get an encrypted uplink to add Nexus to another node.' },
        { name: 'uptime', desc: 'Process uptime and system heartbeat.' }
    ],
    moderation: [
        { name: 'warn', desc: 'Issue a formal protocol strike to an entity.' },
        { name: 'ban', desc: 'Permanently sever an entity from the node.' },
        { name: 'kick', desc: 'Temporarily sever an entity from the node.' },
        { name: 'purge', desc: 'Initiate a mass data deletion in the current channel.' },
        { name: 'timeout', desc: 'Temporarily restrict an entity\'s transmit permissions.' },
        { name: 'lock', desc: 'Engage firewall on the current channel.' },
        { name: 'unlock', desc: 'Disengage firewall on the current channel.' },
        { name: 'blacklist', desc: 'Global protocol exclusion.', ownerOnly: true }
    ],
    economy: [
        { name: 'work', desc: 'Execute a gig to earn Nexus Credits.' },
        { name: 'crime', desc: 'Initiate a high-risk security breach for credits.' },
        { name: 'balance', desc: 'Scan current credit reserves and net worth.' },
        { name: 'shop', desc: 'Access the decentralized asset market.' },
        { name: 'daily', desc: 'Receive your daily Nexus Credit allocation.' },
        { name: 'set-credits', desc: 'Modify user credit allocation.', ownerOnly: true }
    ],
    fun: [
        { name: 'meme', desc: 'Intercept humor data from the network.' },
        { name: 'hack', desc: 'Simulate a high-level breach on a target.' },
        { name: '8ball', desc: 'Query the Oracle array for a yes/no outcome.' },
        { name: 'coinflip', desc: 'Execute a boolean 50/50 algorithm.' }
    ],
    owner: [
        { name: 'eval', desc: 'Execute raw terminal logic.', ownerOnly: true },
        { name: 'shutdown', desc: 'Terminate all protocol shards.', ownerOnly: true },
        { name: 'reload', desc: 'Hot-reload protocol modules.', ownerOnly: true }
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
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function closeMobileNav() {
        if (!hamburger || !navLinks) return;
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // --- Hamburger Menu ---
    if (hamburger && navLinks) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = !navLinks.classList.contains('open');
            hamburger.classList.toggle('active', open);
            navLinks.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMobileNav());
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('open')) return;
            if (hamburger.contains(e.target) || navLinks.contains(e.target)) return;
            closeMobileNav();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileNav();
        });
    }

    // Pointer position & Bento Tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const grid = document.querySelector('.grid-overlay');
        if (grid) {
            grid.style.transform = `perspective(1000px) rotateX(60deg) translate(${xPercent}px, ${yPercent}px)`;
        }
        
        const hero = document.querySelector('.hero-title');
        if (hero) {
            hero.style.transform = `translate(${xPercent * -0.2}px, ${yPercent * -0.2}px)`;
        }

        // Bento magnetic tracking
        document.querySelectorAll('.bento-item').forEach(item => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        });
    });


    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (nav && window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else if (nav) {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Command Rendering ---
    let renderCommands = function renderCommands(filter = '') {
        if (!commandList) return;
        
        commandList.innerHTML = '';
        let commandsToDisplay = [];
        
        if (filter.trim()) {
            Object.values(CATEGORIES).forEach(list => {
                const matches = list.filter(cmd => 
                    !cmd.ownerOnly && (
                        cmd.name.toLowerCase().includes(filter.toLowerCase()) || 
                        cmd.desc.toLowerCase().includes(filter.toLowerCase())
                    )
                );
                commandsToDisplay.push(...matches);
            });
            if (tabContainer) tabContainer.style.display = 'none';
        } else {
            // Filter out ownerOnly commands for the public view
            commandsToDisplay = (CATEGORIES[activeCategory] || []).filter(cmd => !cmd.ownerOnly);
            if (tabContainer) tabContainer.style.display = 'flex';
        }

        if (commandsToDisplay.length === 0) {
            commandList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-dim);">No public command signals found.</div>';
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
            const btn = e.target.closest?.('.tab-btn');
            if (btn && tabContainer.contains(btn)) {
                // If it's the owner tab, we could hide the tab itself in CSS or here
                activeCategory = btn.dataset.category;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
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

    // --- Operations Feed ---
    const opsFeed = document.getElementById('ops-feed');
    if (opsFeed) {
        const opsMessages = [
            { module: 'SHARD_0', msg: 'Neural handshake established with node_8829...', status: 'STABLE', statusClass: 'ops-success' },
            { module: 'FIREWALL', msg: 'Recursive packet inspection: No anomalies found.', status: 'CLEAR', statusClass: 'ops-success' },
            { module: 'CORE', msg: 'Global heartbeat pulse emitted. Latency: 12ms.', status: 'SYNC', statusClass: 'ops-success' },
            { module: 'UPLINK', msg: 'Gateway bridge established with Discord mainframes.', status: 'ACTIVE', statusClass: 'ops-success' },
            { module: 'ECONOMY', msg: 'Ledger sync complete. 12.4k credits distributed.', status: 'DONE', statusClass: '' },
            { module: 'SECURITY', msg: 'Unauthorized breach attempt blocked in Sector 7.', status: 'BLOCKED', statusClass: 'ops-error' },
            { module: 'DB', msg: 'MongoDB transaction committed (1.2ms).', status: 'OK', statusClass: 'ops-success' },
        ];

        function getTimestamp() {
            const now = new Date();
            return now.toTimeString().split(' ')[0];
        }

        let lineIndex = 0;
        function addOpsLine() {
            const container = opsFeed;
            if (lineIndex >= 10) { // Keep only last 10 lines
                const first = container.querySelector('.ops-line');
                if (first) first.remove();
            }
            
            const entry = opsMessages[Math.floor(Math.random() * opsMessages.length)];
            const line = document.createElement('div');
            line.className = 'ops-line reveal active';
            line.innerHTML = `<span class="ops-timestamp">[${getTimestamp()}]</span> <span class="ops-module">${entry.module}</span>: ${entry.msg}${entry.status ? ` <span class="${entry.statusClass}">${entry.status}</span>` : ''}`;
            
            const cursor = container.querySelector('.ops-cursor');
            if (cursor) cursor.remove();
            
            container.appendChild(line);
            
            const cursorEl = document.createElement('div');
            cursorEl.className = 'ops-cursor';
            cursorEl.textContent = '_ WAITING_FOR_INPUT...';
            container.appendChild(cursorEl);
            
            container.scrollTop = container.scrollHeight;
            lineIndex++;
        }

        addOpsLine();
        setInterval(addOpsLine, 4000);
    }

    // --- Advanced Reveal Engine ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered appearance if multiple enter at once
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' 
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    if (commandList) renderCommands();

    // Background Canvas
    function initNetworkCanvas(canvas) {
        if (!canvas || canvas.dataset.nexusInit === '1') return;
        canvas.dataset.nexusInit = '1';
        const ctx = canvas.getContext('2d');
        let width, height;
        const particles = [];
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.2 + 0.5;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 234, 0.3)'; ctx.fill();
            }
        }
        for (let i = 0; i < 50; i++) particles.push(new Particle());
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };
        animate();
    }
    initNetworkCanvas(document.getElementById('network-canvas'));

    // Custom Cursor
    const useFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (useFinePointer) {
        document.body.classList.add('custom-cursor-enabled');
        const dot = document.createElement('div'); dot.className = 'cursor-dot';
        const trail = document.createElement('div'); trail.className = 'cursor-trail';
        document.body.appendChild(dot); document.body.appendChild(trail);
        let dx=mouseX, dy=mouseY, tx=mouseX, ty=mouseY;
        const update = () => {
            dx += (mouseX - dx) * 0.2; dy += (mouseY - dy) * 0.2;
            tx += (mouseX - tx) * 0.1; ty += (mouseY - ty) * 0.1;
            dot.style.transform = `translate(${dx}px, ${dy}px)`;
            trail.style.transform = `translate(${tx}px, ${ty}px)`;
            requestAnimationFrame(update);
        };
        update();
    }

    // API Stats
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('[data-target]').forEach(el => {
                const target = data[el.id] || el.dataset.target;
                el.dataset.target = target;
            });
            animateCounters();
        }).catch(() => {});
});
