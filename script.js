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
        { name: 'remind', desc: 'Have the system keep tabs on something for you' }
    ],
    economy: [
        { name: 'balance', desc: 'Scan current credit reserves and net worth' },
        { name: 'daily', desc: 'Receive your daily Nexus Credit allocation' },
        { name: 'work', desc: 'Execute a gig to earn Nexus Credits' },
        { name: 'rob', desc: 'Execute a cyber-heist on another user\'s local wallet' },
        { name: 'transfer', desc: 'Initiate an encrypted credit transfer' },
        { name: 'leaderboard', desc: 'Displays the top operatives by net worth' },
        { name: 'shop', desc: 'Access the underground hardware catalog' },
        { name: 'buy', desc: 'Acquire hardware from the shop' },
        { name: 'inventory', desc: 'View your locally stored items' }
    ],
    casino: [
        { name: 'blackjack', desc: 'Engage in a high-stakes protocol against the dealer' },
        { name: 'slots', desc: 'Wager credits on the random number generator' }
    ],
    leveling: [
        { name: 'rank', desc: 'Analyze your current security clearance and XP progress' }
    ],
    moderation: [
        { name: 'ban', desc: 'Permanently sever a user from the node' },
        { name: 'kick', desc: 'Temporarily sever a user from the node' },
        { name: 'purge', desc: 'Initiate a mass data deletion in the current channel' },
        { name: 'lock', desc: 'Engage firewall on the current channel' },
        { name: 'unlock', desc: 'Disengage firewall on the current channel' },
        { name: 'slowmode', desc: 'Throttle output bandwidth in the current channel' },
        { name: 'verify-setup', desc: 'Drop a secure verification portal (Admin Only)' },
        { name: 'say', desc: 'Transmit a cleartext message through the Nexus' }
    ],
    fun: [
        { name: '8ball', desc: 'Query the Oracle array for a yes/no outcome' },
        { name: 'joke', desc: 'Process a humorous data packet' },
        { name: 'fact', desc: 'Extract an interesting file from the database' },
        { name: 'quote', desc: 'Extract an inspirational transmission' },
        { name: 'coinflip', desc: 'Execute a boolean 50/50 algorithm' },
        { name: 'roll', desc: 'Execute a randomized integer sequence' },
        { name: 'rps', desc: 'Simulate Rock, Paper, Scissors against the CPU' },
        { name: 'trivia', desc: 'Process a trivia data packet' },
        { name: 'hack', desc: 'Initiate a harmless penetration test on a target' },
        { name: 'emojify', desc: 'Convert text data into an encrypted emoji string' },
        { name: 'giveaway', desc: 'Airdrop resources to the community' }
    ],
    media: [
        { name: 'cat', desc: 'Fetches biological data on Felines' },
        { name: 'dog', desc: 'Fetches biological data on Canines' },
        { name: 'meme', desc: 'Intercepts top-tier humorous media' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const tabContainer = document.getElementById('category-tabs');
    const commandList = document.getElementById('command-list');
    const searchInput = document.getElementById('command-search');
    
    let activeCategory = 'utility';

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    function renderCommands(filter = '') {
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
            tabContainer.style.display = 'none';
        } else {
            commandsToDisplay = CATEGORIES[activeCategory] || [];
            tabContainer.style.display = 'flex';
        }

        if (commandsToDisplay.length === 0) {
            commandList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-dim);">No command signals found in this bandwidth.</div>';
            return;
        }

        commandsToDisplay.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'cmd-item reveal active';
            div.style.transitionDelay = `${index * 0.05}s`;
            
            div.innerHTML = `
                <div class="cmd-name">
                    /${cmd.name}
                    <span class="cmd-copy">Copy</span>
                </div>
                <p class="cmd-desc">${cmd.desc}</p>
            `;

            div.onclick = () => {
                navigator.clipboard.writeText(`/${cmd.name}`).then(() => {
                    const copySpan = div.querySelector('.cmd-copy');
                    copySpan.innerText = 'COPIED';
                    copySpan.style.color = 'var(--primary)';
                    setTimeout(() => {
                        copySpan.innerText = 'COPY';
                        copySpan.style.color = 'inherit';
                    }, 2000);
                });
            };

            commandList.appendChild(div);
        });
    }

    // Tabs
    tabContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            activeCategory = e.target.dataset.category;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderCommands();
        }
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        renderCommands(e.target.value);
    });

    // Reveal on scroll
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // init

    // Initial Commands
    renderCommands();
});
