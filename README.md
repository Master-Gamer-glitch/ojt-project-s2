# Team Agency Portfolio

A modern, fast, and minimal pitch-black portfolio landing page designed for a high-performing agency team. Built with pure HTML, CSS, and vanilla JavaScript, it emphasizes a premium dark aesthetic with smooth interactions, custom typography, and a collapsible sidebar.

## Features

- **Premium Dark Aesthetic:** By default, the site features a sleek, AMOLED-friendly pitch-black theme with subtle borders and deep shadow hover effects.
- **Collapsible Sidebar Layout:** An IDE-style sidebar for easy navigation across multiple projects (e.g., "Interactive Quiz App", "Expense Tracker"), sliding in and pushing main content dynamically.
- **Data-Driven Team Grid:** Team members (avatars, roles, skills, and social links) are rendered dynamically from a JavaScript array, making it incredibly simple to add or update staff profiles.
- **Two-Style Typography Header:** A stunning, contrasting header combining `Playfair Display` (elegant serif) and `Inter` (bold sans-serif) for a high-end agency look.
- **Light/Dark Mode Toggle:** A persistent theme switcher that respects user preference and saves state using `localStorage`.
- **Client-Side Form Validation:** A clean contact form featuring built-in visual feedback for missing or invalid inputs (like email formatting) before simulated submission.
- **Lightweight & Zero Dependencies:** No heavy UI frameworks like React, Tailwind, or Bootstrap. It only uses [Phosphor Icons](https://phosphoricons.com/) via CDN and Google Fonts.

## Project Structure

```text
├── index.html   # Main HTML structure including the sidebar and content wrappers
├── style.css    # All styling including CSS variables, layout, and theming
├── script.js    # Logic for rendering data, toggling the sidebar/theme, and validating the form
└── README.md    # Project documentation
```

## Setup & Usage

Since this project uses basic web technologies without a build step, running it locally is extremely straightforward:

1. **Clone or Download** the project files to your local machine.
2. **Open `index.html`** directly in your modern web browser.
3. *Optional:* Use a local development server like VS Code's "Live Server" extension to serve the files and see live reloads as you edit.

## Customization

### Adding Team Members
Open `script.js` and locate the `teamMembers` array. You can easily add a new object to the array with the team member's details:

```javascript
{
    name: "New Member",
    role: "UX Designer",
    bio: "Passionate about creating intuitive user experiences.",
    avatar: "https://example.com/avatar.jpg",
    skills: ["Figma", "User Testing", "Wireframing"],
    links: [
        { label: "LinkedIn", url: "#", icon: "ph-linkedin-logo" }
    ]
}
```

### Changing Theme Colors
Open `style.css` and tweak the variables under `:root` (for the light theme) and `.dark-theme`. 

```css
.dark-theme {
    --bg-color: #000000;      /* Pitch black background */
    --card-bg: #0a0a0a;       /* Dark gray card background */
    --card-border: #1f1f1f;   /* Subtle border */
    /* ... */
}
```

## Technologies Used
- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6)
- Google Fonts (Inter, Playfair Display)
- Phosphor Icons
