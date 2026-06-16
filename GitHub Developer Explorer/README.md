# GitHub Developer Explorer

A production-quality web application built strictly with Pure HTML, CSS, and Vanilla JavaScript that allows users to explore GitHub developer profiles, analyze repository language breakdown, and easily search/filter/sort repositories.

## Features
- **Profile Overview:** View key metrics (total stars, follower counts, etc.).
- **Language Chart Visualization:** Pure HTML5 Canvas donut chart depicting repository languages, without the use of heavy charting libraries.
- **Repository Explorer:** View, filter (by name/language), and sort (by stars, forks, size, activity) up to thousands of user repositories seamlessly.
- **Rate Limit Resilience:** Displays accurate API usage ceilings with countdown timers. Gracefully degrades by serving cached records.
- **Aggressive Local Caching:** `localStorage` is utilized with 30-minute Time-To-Live logic to prevent unnecessary network requests.
- **Responsive & Accessible:** Dark/Light theme support, ARIA attributes, semantic HTML, and fluid layouts for 320px to desktop widths.

## Setup Instructions

Because the application uses modern JavaScript ES Modules (`type="module"`), it must be served via a local web server (opening the `index.html` file directly via the `file://` protocol will result in CORS module blocking).

1. Clone or extract the files to a directory.
2. Ensure the directory structure remains flat for the HTML/CSS, with a `js/` subfolder: