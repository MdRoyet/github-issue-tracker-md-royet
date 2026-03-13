
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

