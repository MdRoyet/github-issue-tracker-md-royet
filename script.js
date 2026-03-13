
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

