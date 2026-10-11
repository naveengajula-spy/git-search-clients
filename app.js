// Mode & Input Elements
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const singleSearchSection = document.getElementById('single-search-section');
const battleSearchSection = document.getElementById('battle-search-section');

// Single Search Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const profileCard = document.getElementById('profile-card');
const reposContainer = document.getElementById('repos-container');
const reposList = document.getElementById('repos-list');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileUrl = document.getElementById('profile-url');
const profileJoined = document.getElementById('profile-joined');
const profileBio = document.getElementById('profile-bio');

// Battle Mode Elements
const battleInput1 = document.getElementById('battle-input-1');
const battleInput2 = document.getElementById('battle-input-2');
const battleBtn = document.getElementById('battle-btn');
const battleResults = document.getElementById('battle-results');

const p1Avatar = document.getElementById('p1-avatar');
const p1Name = document.getElementById('p1-name');
const p1Url = document.getElementById('p1-url');
const p1Repos = document.getElementById('p1-repos');
const p1Stars = document.getElementById('p1-stars');
const p1Badge = document.getElementById('player-1-badge');
const p1Card = document.getElementById('player-1-card');

const p2Avatar = document.getElementById('p2-avatar');
const p2Name = document.getElementById('p2-name');
const p2Url = document.getElementById('p2-url');
const p2Repos = document.getElementById('p2-repos');
const p2Stars = document.getElementById('p2-stars');
const p2Badge = document.getElementById('player-2-badge');
const p2Card = document.getElementById('player-2-card');

// Global state
let isBattleMode = false;

// Shared UI Elements
const loadingSpinner = document.getElementById('loading-spinner');
const errorMsg = document.getElementById('error-msg');

// Toggle Mode Event
modeToggleBtn.addEventListener('click', () => {
    isBattleMode = !isBattleMode;
    hideError();
    
    if (isBattleMode) {
        modeToggleBtn.textContent = '🔍 Switch to Single Search';
        modeToggleBtn.classList.replace('bg-slate-700', 'bg-blue-700');
        singleSearchSection.classList.add('hidden');
        battleSearchSection.classList.remove('hidden');
        hideProfile();
    } else {
        modeToggleBtn.textContent = '⚔️ Enable Battle Mode';
        modeToggleBtn.classList.replace('bg-blue-700', 'bg-slate-700');
        battleSearchSection.classList.add('hidden');
        singleSearchSection.classList.remove('hidden');
        hideBattleResults();
    }
});

// Single Search Event Listeners
searchBtn.addEventListener('click', handleSingleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSingleSearch();
});

// Battle Mode Event Listener
battleBtn.addEventListener('click', handleBattleSearch);

async function handleSingleSearch() {
    const username = searchInput.value.trim();
    if (!username) return;

    hideError();
    showLoading();
    hideProfile();

    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error(`User not found: ${userResponse.status}`);

        const userData = await userResponse.json();
        renderProfile(userData);

        const reposResponse = await fetch(`${userData.repos_url}?sort=updated&per_page=5`);
        const reposData = await reposResponse.json();
        renderRepos(reposData);

        showProfile();
    } catch (error) {
        console.error(error);
        showError();
    } finally {
        hideLoading();
    }
}

// Phase 3: Battle Mode with Promise.all() and Star Calculation
async function handleBattleSearch() {
    const user1 = battleInput1.value.trim();
    const user2 = battleInput2.value.trim();

    if (!user1 || !user2) {
        errorMsg.textContent = "Please enter both usernames for battle!";
        showError();
        return;
    }

    hideError();
    showLoading();
    hideBattleResults();

    try {
        // Fetch profiles simultaneously using Promise.all
        const [res1, res2] = await Promise.all([
            fetch(`https://api.github.com/users/${user1}`),
            fetch(`https://api.github.com/users/${user2}`)
        ]);

        if (!res1.ok || !res2.ok) {
            throw new Error("One or both users could not be found.");
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        // Fetch repositories for both users to calculate total stars
        const [repoRes1, repoRes2] = await Promise.all([
            fetch(`https://api.github.com/users/${user1}/repos?per_page=100`),
            fetch(`https://api.github.com/users/${user2}/repos?per_page=100`)
        ]);

        const repos1 = await repoRes1.json();
        const repos2 = await repoRes2.json();

        // Calculate total stars using reduce accumulator
        const stars1 = repos1.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const stars2 = repos2.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        renderBattleResults(data1, stars1, data2, stars2);
        showBattleResults();

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Users not found. Please verify both GitHub handles!";
        showError();
    } finally {
        hideLoading();
    }
}

function renderProfile(user) {
    profileAvatar.src = user.avatar_url;
    profileName.textContent = user.name || user.login;
    profileUrl.href = user.html_url;
    profileUrl.textContent = `@${user.login}`;
    profileBio.textContent = user.bio || 'This profile has no bio available.';
    
    const formattedDate = new Date(user.created_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
    profileJoined.textContent = `Joined ${formattedDate}`;
}

function renderRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
        reposList.innerHTML = '<p class="text-xs text-slate-400">No public repositories found.</p>';
        reposContainer.classList.remove('hidden');
        return;
    }

    repos.forEach(repo => {
        const repoItem = document.createElement('a');
        repoItem.href = repo.html_url;
        repoItem.target = '_blank';
        repoItem.className = 'block bg-slate-700/40 hover:bg-slate-700 p-3 rounded-lg transition-colors text-sm border border-slate-600/50';
        
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        repoItem.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-medium text-blue-400">${repo.name}</span>
                <span class="text-xs text-slate-400">Updated ${updatedDate}</span>
            </div>
            <p class="text-xs text-slate-300 mt-1 truncate">${repo.description || 'No description provided.'}</p>
        `;
        reposList.appendChild(repoItem);
    });
    reposContainer.classList.remove('hidden');
}

function renderBattleResults(u1, stars1, u2, stars2) {
    // Player 1 Data Fill
    p1Avatar.src = u1.avatar_url;
    p1Name.textContent = u1.name || u1.login;
    p1Url.href = u1.html_url;
    p1Url.textContent = `@${u1.login}`;
    p1Repos.textContent = u1.public_repos;
    p1Stars.textContent = stars1;

    // Player 2 Data Fill
    p2Avatar.src = u2.avatar_url;
    p2Name.textContent = u2.name || u2.login;
    p2Url.href = u2.html_url;
    p2Url.textContent = `@${u2.login}`;
    p2Repos.textContent = u2.public_repos;
    p2Stars.textContent = stars2;

    // Conditional Winner / Loser UI Comparison based on total stars
    p1Badge.classList.remove('hidden');
    p2Badge.classList.remove('hidden');

    if (stars1 > stars2) {
        p1Badge.textContent = '🏆 WINNER';
        p1Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        p1Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-emerald-500 relative';

        p2Badge.textContent = '❌ LOSER';
        p2Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30';
        p2Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-red-500/50 relative';
    } else if (stars2 > stars1) {
        p2Badge.textContent = '🏆 WINNER';
        p2Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        p2Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-emerald-500 relative';

        p1Badge.textContent = '❌ LOSER';
        p1Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30';
        p1Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-red-500/50 relative';
    } else {
        p1Badge.textContent = '🤝 TIE';
        p1Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';
        p1Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-amber-500/50 relative';

        p2Badge.textContent = '🤝 TIE';
        p2Badge.className = 'absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';
        p2Card.className = 'bg-slate-800 p-5 rounded-2xl shadow-xl space-y-4 border-2 border-amber-500/50 relative';
    }
}

// Utility UI Toggles
function showLoading() { loadingSpinner.classList.remove('hidden'); }
function hideLoading() { loadingSpinner.classList.add('hidden'); }
function showProfile() { profileCard.classList.remove('hidden'); }
function hideProfile() { profileCard.classList.add('hidden'); }
function showBattleResults() { battleResults.classList.remove('hidden'); }
function hideBattleResults() { battleResults.classList.add('hidden'); }
function showError() { errorMsg.classList.remove('hidden'); }
function hideError() { errorMsg.classList.add('hidden'); }