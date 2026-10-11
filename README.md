# GitHub Search Client (Dev-Detective)

A modern, responsive client-side web application built to interface with the official GitHub REST API. Developed as part of the Prodesk IT Frontend Engineering Pipeline (Sprint 3).

## 🚀 Features Implemented

### Phase 1: Base MVP & Robust Architecture
- **Search Functionality:** Real-time search for any GitHub handle with clean input validation.
- **Async/Await Handling:** Smooth asynchronous HTTP GET requests using native browser `fetch()`.
- **Defensive UI States:** Built-in loading spinner and a 404 error fallback state to ensure the app never crashes on invalid requests.

### Phase 2: Data Expansion & Formatting
- **Endpoint Chaining:** Automatically chains the primary user response into a second API request to fetch repositories.
- **List Rendering:** Maps and displays the user's top 5 latest updated repositories with direct links opening in a new tab.
- **Date Utilities:** Converts raw ISO timestamps into readable human formats (e.g., *25 Jan 2023*).

### Phase 3: Advanced Logic & "Battle Mode"
- **Promise.all() Concurrency:** Implemented a toggleable dual-input UI allowing simultaneous fetching of two GitHub users.
- **Data Reduction:** Uses JavaScript `reduce()` to calculate the total `stargazers_count` across repository arrays.
- **Conditional Styling:** Automatically evaluates totals, declaring a green-badged `WINNER` and red-badged `LOSER`.

## 🛠️ Tech Stack
- **HTML5 & CSS3** (Semantic layout)
- **Tailwind CSS** (Modern utility-first design framework)
- **Vanilla JavaScript (ES6+)** (Async/Await, Array methods, DOM manipulation)
- **GitHub REST API**

## 💻 Local Setup & Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/naveengajula-spy/github-search-client.git](https://github.com/naveengajula-spy/github-search-client.git)