# JavaScript Capstone: Unified Application Dashboard

A modern, fast, and unified Single Page Application (SPA) dashboard containing 6 distinct applications built entirely with pure HTML, CSS, and vanilla JavaScript. This project was developed as a comprehensive capstone to demonstrate core frontend engineering concepts without relying on external UI frameworks.

## 🌟 Overview

The dashboard utilizes a premium, AMOLED-friendly dark aesthetic with custom typography and smooth interactions. It operates as a Single Page Application (SPA) using a custom hash-based router, allowing users to seamlessly switch between the 6 different applications without reloading the page.

### Included Applications:
1. **Team Agency Portfolio:** A data-driven landing page rendering team members dynamically from JavaScript objects, featuring a contact form with client-side validation.
2. **Interactive Quiz App:** A multiple-choice quiz demonstrating complex state management, running score calculation, and visual feedback for correct/incorrect answers.
3. **Expense Tracker:** A CRUD application that calculates income, expenses, and total balance using advanced array methods (`reduce()`, `filter()`). Data is persisted securely using `localStorage`.
4. **Live News Feed:** A real-time news aggregator integrating the NewsAPI via `async/await` and the `Fetch API`, complete with loading states, error handling, and category filters.
5. **GitHub Developer Explorer:** A developer search tool using the GitHub REST API. Features rate-limit handling, data transformation, and dynamic rendering of repositories and language breakdowns.
6. **Kanban Task Board:** A drag-and-drop task management board (To Do, In Progress, Done) built using the native HTML5 Drag and Drop API, with full data persistence.

## ✨ Key Features

- **Zero Frameworks:** 100% Vanilla JS, HTML5, and CSS3. No React, Angular, Vue, or Tailwind.
- **Custom SPA Router:** Hash-based (`#`) routing system to swap views instantly while maintaining application state.
- **Robust State Persistence:** `localStorage` is implemented safely with `try...catch` blocks to prevent crashes on corrupted data.
- **Security First:** User inputs are strictly sanitized using custom escaping functions before DOM insertion to prevent Cross-Site Scripting (XSS).
- **Responsive Design:** Fully fluid layouts optimized for mobile, tablet, and desktop viewing.
- **Light/Dark Theme:** Persistent theme toggler that defaults to a sleek dark mode.

## 📂 Project Structure

```text
ojt-project-s2/
├── index.html                  # Main SPA entry point and unified DOM structure
├── css/                        # Centralized stylesheets
│   ├── style.css               # Global variables, sidebar, and layout styling
│   ├── devExplorer.css         # GitHub Explorer styles
│   ├── expenseTracker.css      # Expense Tracker styles
│   ├── newsFeed.css            # Live News styles
│   ├── quizApp.css             # Quiz App styles
│   └── taskBoard.css           # Kanban Board styles
├── js/                         # Core global logic
│   ├── router.js               # Hash-based SPA routing engine
│   └── script.js               # Portfolio rendering and Theme toggling
├── assets/                     # Static media (images, icons)
├── ExpenseTrackerApp/          # Expense Tracker logic
├── GitHubDeveloperExplorer/    # GitHub API logic
├── InteractiveQuizApp/         # Quiz logic
├── KanbanTaskBoard/            # Consolidated Kanban logic (app.js)
└── LiveNewsFeed/               # News API logic
```
*(Note: Each app folder contains its respective JavaScript modules).*

## 🚀 Setup & Installation

Because this project is built with vanilla web technologies, there are no dependencies to install or complex build steps.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ojt-project-s2.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd ojt-project-s2
   ```
3. **Open the app:**
   Simply double-click `index.html` to open it in your browser. 
   
   *Note: For the Live News Feed to work correctly (due to CORS or API key restrictions), you may need to serve the directory using a local web server (e.g., VS Code's "Live Server" extension or `npx serve`).*

## 🛠️ Technologies Used

- **HTML5:** Semantic markup, Drag & Drop API.
- **CSS3:** Custom Properties (Variables), Flexbox, CSS Grid, Media Queries.
- **JavaScript (ES6+):** Modules, Promises, Async/Await, Array Methods (`map`, `filter`, `reduce`), DOM Manipulation.
- **Web Storage API:** `localStorage` for state persistence.
- **External APIs:** GitHub REST API, NewsAPI.
- **Assets:** Google Fonts (Inter, Playfair Display), Phosphor Icons.
