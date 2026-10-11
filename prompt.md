# Engineering Log & Prompts Journal

This document tracks the iterative building process, prompt strategies, and debugging steps utilized while developing the GitHub Search Client.

## Iteration Log

### Phase 1: Foundation & MVP Logic
- **Objective:** Establish the core HTML structure with Tailwind CSS and handle basic single-user fetch requests.
- **Engineering Notes:** 
  - Focused heavily on error handling. Added a try-catch block to intercept `404 Not Found` statuses so the UI gracefully falls back to an error message instead of breaking the script execution.
  - Added a clean loading spinner state using Tailwind's `animate-spin` utility during promise resolution.

### Phase 2: Endpoint Chaining & Repository Rendering
- **Objective:** Expand the application to traverse multiple endpoints.
- **Engineering Notes:**
  - Extracted `repos_url` from the initial user response object to perform a secondary asynchronous fetch request (`?sort=updated&per_page=5`).
  - Mapped repository items dynamically into the DOM, ensuring security with proper `target="_blank"` attributes for external portfolio links.

### Phase 3: Battle Mode & Advanced Array Methods
- **Objective:** Introduce state management toggle and comparative analytics.
- **Engineering Notes:**
  - Integrated `Promise.all()` to handle concurrent network requests for two independent users simultaneously without blocking the UI thread.
  - Used the JavaScript `reduce()` accumulator method to loop through repository star counts (`stargazers_count`) and compute total stars earned.
  - Implemented conditional DOM class manipulation to visually display a green `WINNER` badge and a red `LOSER` state.

