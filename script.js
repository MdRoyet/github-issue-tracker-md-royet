
/**
 * GITHUB ISSUES TRACKER - LOGIC
 * Handles: Authentication, API Fetching, Rendering, and Filtering
 */

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

// State Management
let allIssues = [];

// DOM Elements
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const loginForm = document.getElementById('login-form');
const issuesGrid = document.getElementById('issues-grid');
const loader = document.getElementById('loader');
const issueCount = document.getElementById('issue-count');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('issue-modal');
const modalBody = document.getElementById('modal-body');

/**
 * 1. LOGIN HANDLER
 * Simple hardcoded check for demo purposes
 */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        fetchIssues();
    } else {
        alert("Invalid Credentials! Try admin / admin123");
    }
});

/**
 * 2. DATA FETCHING
 */
async function fetchIssues() {
    toggleLoader(true);
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        allIssues = json.data;
        renderIssues(allIssues);
    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        toggleLoader(false);
    }
}

/**
 * 3. RENDER CARDS
 * Dynamically builds the issue cards using Tailwind classes
 */
function renderIssues(issues) {
    issuesGrid.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    if (issues.length === 0) {
        issuesGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-10">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const statusColor = issue.status === 'open' ? 'border-open' : 'border-closed';
        const priorityStyles = getPriorityStyles(issue.priority);
        const statusImg = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        const labelsHTML = issue.labels.map((label, index) => {
            const isBug = label.toLowerCase().includes('bug');
            const colorClass = index === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-600 border-rose-100';
            return `
                <span class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${colorClass}">
                    <i class="fas ${isBug ? 'fa-bug' : 'fa-life-ring'}"></i> ${label}
                </span>`;
        }).join('');

        const card = document.createElement('div');
        card.className = `bg-white rounded-xl border-t-4 ${statusColor} border-x border-b border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden`;
        
        card.innerHTML = `
            <div class="p-5 flex-grow" onclick="showModal(${issue.id})">
                <div class="flex justify-between items-center mb-4">
                    <img src="${statusImg}" class="w-5 h-5 object-contain">
                    <span class="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${priorityStyles}">
                        ${issue.priority}
                    </span>
                </div>
                <h4 class="font-bold text-slate-800 leading-snug mb-2 line-clamp-2">${issue.title}</h4>
                <p class="text-sm text-slate-500 line-clamp-2 mb-4">${issue.description}</p>
                <div class="flex flex-wrap gap-2">${labelsHTML}</div>
            </div>
            <div class="px-5 py-4 bg-slate-50/50 border-t border-slate-100 text-[12px] text-slate-400">
                #${issue.id} by <span class="text-slate-600 font-medium">${issue.author}</span><br>
                ${new Date(issue.createdAt).toLocaleDateString()}
            </div>
        `;
        issuesGrid.appendChild(card);
    });
}

/**
 * 4. MODAL DETAIL VIEW
 */
async function showModal(id) {
    toggleLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const json = await res.json();
        const issue = json.data;
        const date = new Date(issue.createdAt).toLocaleDateString('en-GB');

        modalBody.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-extrabold text-slate-900 pr-8">${issue.title}</h2>
                <button onclick="closeModalWindow()" class="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>
            
            <div class="flex items-center gap-3 text-sm text-slate-500 mb-6">
                <span class="bg-open text-white px-3 py-1 rounded-full font-bold text-xs capitalize">${issue.status}</span>
                <span>• Opened by <b class="text-slate-700">${issue.author}</b> • ${date}</span>
            </div>

            <p class="text-slate-600 leading-relaxed mb-8 border-l-4 border-slate-100 pl-4 italic">
                "${issue.description}"
            </p>

            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl mb-8">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Assignee</label>
                    <span class="font-bold text-slate-800">${issue.author}</span>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Priority</label>
                    <span class="bg-rose-500 text-white px-3 py-0.5 rounded text-xs font-black uppercase">${issue.priority}</span>
                </div>
            </div>

            <div class="flex justify-end">
                <button onclick="closeModalWindow()" class="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
                    Done
                </button>
            </div>
        `;
        modal.classList.remove('hidden');
    } catch (err) {
        console.error(err);
    } finally {
        toggleLoader(false);
    }
}


/**
 * 5. UTILITIES & EVENT LISTENERS
 */
function closeModalWindow() { modal.classList.add('hidden'); }

function toggleLoader(show) {
    show ? loader.classList.remove('hidden') : loader.classList.add('hidden');
}

function getPriorityStyles(p) {
    const priority = p.toLowerCase();
    if (priority === 'high') return 'bg-rose-100 text-rose-600';
    if (priority === 'medium') return 'bg-amber-100 text-amber-600';
    return 'bg-slate-100 text-slate-500';
}

// Search Functionality
searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (!query) return fetchIssues();
        
        toggleLoader(true);
        try {
            const res = await fetch(`${SEARCH_URL}${query}`);
            const json = await res.json();
            renderIssues(json.data);
        } finally {
            toggleLoader(false);
        }
    }
});

// Tab Filtering
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // UI Update
        tabBtns.forEach(b => b.classList.remove('bg-primary', 'text-white'));
        tabBtns.forEach(b => b.classList.add('text-slate-500'));
        btn.classList.add('bg-primary', 'text-white');
        btn.classList.remove('text-slate-500');

        // Filter Logic
        const filter = btn.dataset.filter;
        const filtered = filter === 'all' ? allIssues : allIssues.filter(i => i.status === filter);
        renderIssues(filtered);
    });
});

