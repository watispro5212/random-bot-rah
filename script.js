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
    const tabContainer = document.getElementById('category-tabs');
    const commandList = document.getElementById('command-list');
    const searchInput = document.getElementById('command-search');
    const inviteBtn = document.getElementById('invite-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    const dailyJokeEl = document.getElementById('daily-joke');

    // invite link
    const CLIENT_ID = '1480725340753101031';
    inviteBtn.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;

    let activeCategory = 'utility';

    function renderCommands(filter = '') {
        commandList.innerHTML = '';
        
        // decide what to show (all matching commands or active category)
        let commandsToDisplay = [];
        
        if (filter.trim()) {
            // flatten all categories and filter
            Object.values(CATEGORIES).forEach(list => {
                const matches = list.filter(cmd => 
                    cmd.name.toLowerCase().includes(filter.toLowerCase()) || 
                    cmd.desc.toLowerCase().includes(filter.toLowerCase())
                );
                commandsToDisplay.push(...matches);
            });
            // hide tabs when searching
            tabContainer.style.display = 'none';
        } else {
            commandsToDisplay = CATEGORIES[activeCategory] || [];
            tabContainer.style.display = 'flex';
        }

        if (commandsToDisplay.length === 0) {
            commandList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No commands found matching your search.</div>';
            return;
        }

        commandsToDisplay.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'command-item';
            div.style.animationDelay = `${index * 0.05}s`;
            
            div.innerHTML = `
                <div class="command-name">
                    /${cmd.name}
                    <span class="copy-indicator">Click to copy</span>
                </div>
                <p class="command-desc">${cmd.desc}</p>
            `;

            div.onclick = () => {
                navigator.clipboard.writeText(`/${cmd.name}`).then(() => {
                    const indicator = div.querySelector('.copy-indicator');
                    const originalText = indicator.innerText;
                    indicator.innerText = 'Copied!';
                    indicator.style.color = 'var(--accent)';
                    setTimeout(() => {
                        indicator.innerText = originalText;
                        indicator.style.color = 'var(--text-muted)';
                    }, 2000);
                });
            };

            commandList.appendChild(div);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderCommands(e.target.value);
    });

    // Tab switching
    tabContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;

        activeCategory = tab.dataset.category;
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCommands();
    });

    // Scroll Reveal functionality
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Surprise Me Logic
    if (surpriseBtn) {
        surpriseBtn.onclick = () => {
            const allCats = Object.keys(CATEGORIES);
            const randomCat = allCats[Math.floor(Math.random() * allCats.length)];
            const commands = CATEGORIES[randomCat];
            const randomCmd = commands[Math.floor(Math.random() * commands.length)];

            // Switch to that category
            activeCategory = randomCat;
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.category === randomCat);
            });
            renderCommands();

            // Find the element, scroll, and highlight
            setTimeout(() => {
                const items = document.querySelectorAll('.command-item');
                const target = Array.from(items).find(el => el.innerText.includes(`/${randomCmd.name}`));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.classList.add('highlight');
                    setTimeout(() => target.classList.remove('highlight'), 3000);
                }
            }, 100);
        };
    }

    // Joke of the Day
    const DAILY_JOKES = [
        "Why did the developer go broke? Because he used up all his cache!",
        "There are 10 types of people: those who understand binary, and those who don't.",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Real programmers count from 0.",
        "Hardware is the part of a computer you can kick; software is the part you can only curse at."
    ];
    if (dailyJokeEl) {
        dailyJokeEl.innerText = DAILY_JOKES[Math.floor(Math.random() * DAILY_JOKES.length)];
    }

    // Initial render
    renderCommands();
});
