const CATEGORIES = {
    utility: [
        { name: 'ping', desc: 'Checks the bot\'s network status and latency metrics' },
        { name: 'info', desc: 'Displays information about the bot and the current server' },
        { name: 'serverinfo', desc: 'Displays detailed information about the current server' },
        { name: 'userinfo', desc: 'Displays detailed information about a user' },
        { name: 'avatar', desc: 'Displays a user\'s avatar in high resolution' },
        { name: 'math', desc: 'Evaluates a mathematical expression' },
        { name: 'timer', desc: 'Sets a countdown timer' }
    ],
    economy: [
        { name: 'balance', desc: 'Check your current account balance and net worth' },
        { name: 'daily', desc: 'Claim your 24-hour reward and build streaks' },
        { name: 'work', desc: 'Work a random shift to earn some credits' },
        { name: 'rob', desc: 'Risk it all and attempt to steal from a user' },
        { name: 'transfer', desc: 'Safely transfer credits to another user' },
        { name: 'leaderboard', desc: 'Displays the top 10 richest users based on net worth' },
        { name: 'shop', desc: 'View the item shop catalog' },
        { name: 'buy', desc: 'Buy an item from the shop' },
        { name: 'inventory', desc: 'View your purchased items' }
    ],
    casino: [
        { name: 'blackjack', desc: 'Play a game of Blackjack against the dealer' },
        { name: 'slots', desc: 'Bet your credits on the slot machine' }
    ],
    leveling: [
        { name: 'rank', desc: 'Displays your current Level and XP progress' }
    ],
    moderation: [
        { name: 'ban', desc: 'Ban a user from the server' },
        { name: 'kick', desc: 'Kick a user from the server' },
        { name: 'purge', desc: 'Bulk delete messages in the current channel' },
        { name: 'lock', desc: 'Locks the current channel (@everyone cannot send messages)' },
        { name: 'unlock', desc: 'Unlocks the current channel' },
        { name: 'slowmode', desc: 'Sets the channel slowmode duration' },
        { name: 'verify-setup', desc: 'Drops a verification panel (Admin Only)' }
    ],
    fun: [
        { name: '8ball', desc: 'Ask the Magic 8-Ball a yes/no question' },
        { name: 'coinflip', desc: 'Flips a coin returning Heads or Tails' },
        { name: 'roll', desc: 'Rolls a die (default 6 sides)' },
        { name: 'rps', desc: 'Play Rock, Paper, Scissors against the bot' },
        { name: 'trivia', desc: 'Answer a random trivia question' }
    ],
    media: [
        { name: 'cat', desc: 'Fetches a random picture of a cute cat' },
        { name: 'dog', desc: 'Fetches a random picture of a cute dog' },
        { name: 'meme', desc: 'Fetches a random top meme' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.getElementById('category-tabs');
    const commandList = document.getElementById('command-list');
    const searchInput = document.getElementById('command-search');
    const inviteBtn = document.getElementById('invite-btn');

    // Invite Link
    const CLIENT_ID = '1480725340753101031';
    inviteBtn.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;

    let activeCategory = 'utility';

    function renderCommands(filter = '') {
        commandList.innerHTML = '';
        
        // Decide what to show (all matching commands or active category)
        let commandsToDisplay = [];
        
        if (filter.trim()) {
            // Flatten all categories and filter
            Object.values(CATEGORIES).forEach(list => {
                const matches = list.filter(cmd => 
                    cmd.name.toLowerCase().includes(filter.toLowerCase()) || 
                    cmd.desc.toLowerCase().includes(filter.toLowerCase())
                );
                commandsToDisplay.push(...matches);
            });
            // Hide tabs when searching
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

    // Initial render
    renderCommands();
});
