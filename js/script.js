const teamMembers = [
    {
        name: "Aryan Shrivastava",
        role: "Frontend Engineer",
        bio: "1st Year BTech CSE Student. Starting MachineLearning. Hungry for more.",
        avatar: "./assets/images/aryan.jpeg",
        skills: ["JavaScript", "Node.js", "C", "Java", "Python"],
        links: [
            { label: "GitHub", url: "https://github.com/Master-Gamer-glitch", icon: "ph-github-logo" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/aryan-shrivastava-1b3462202/", icon: "ph-linkedin-logo" }
        ]
    },
    {
        name: "Krishna Gupta",
        role: "Frontend Engineer",
        bio: "CSE Undergrad ’29 @ PWIOI × MSU | DSA • Full Stack • Core CS | Exploring AI/ML | Aspiring Software Engineer",
        avatar: "./assets/images/krishna.png",
        skills: ["JavaScript", "Performance", "Accessibility", "Web UI", "Architecture"],
        links: [
            { label: "GitHub", url: "https://github.com/Krishna-gupta-code", icon: "ph-github-logo" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/krishna-gupta-688066381/", icon: "ph-linkedin-logo" }
        ]
    },
    {
        name: "Md Sabir Ahamed",
        role: "Frontend Engineer",
        bio: "First Year Computer Science Student | Learning DSA with C/C++, OOP JAVA | HTML, CSS & JavaScript | Problem Solving Enthusiast",
        avatar: "./assets/images/sabir.jpeg",
        skills: ["C/C++","JavaScript", "JAVA", "Web UI", "Python"],
        links: [
            { label: "GitHub", url: "https://github.com/Sabir9-8", icon: "ph-github-logo" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/md-sabir-ahamed-0b7683249/", icon: "ph-linkedin-logo" }
        ]
    },
    {
        name: "Darpan",
        role: "Frontend Engineer",
        bio: "Loves performant interfaces: efficient rendering, robust state management, and micro-interactions that feel premium.",
        avatar: "./assets/images/darpan.jpeg",
        skills: ["JavaScript", "Performance", "Accessibility", "Web UI", "Architecture"],
        links: [
            { label: "GitHub", url: "https://github.com/darpansg3-ux", icon: "ph-github-logo" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/darpansg11whya11/", icon: "ph-linkedin-logo" }
        ]
    },
    {
        name: "Nikhil",
        role: "Frontend Engineer",
        bio: "Student Of PW IOI X MSU. || Aspiring to become a  Tech Entrepreneur ||Building AI-powered product",
        avatar: "./assets/images/nikhil.png",
        skills: ["JavaScript", "Performance", "Accessibility", "Web UI", "Architecture"],
        links: [
            { label: "GitHub", url: "https://github.com/nikhiljeeva0-ui", icon: "ph-github-logo" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/nikhil-jeeva-727105381/", icon: "ph-linkedin-logo" }
        ]
    }
];

// Initialize Data
function renderTeam() {
    const grid = document.getElementById('team-grid');
    grid.innerHTML = teamMembers.map(member => `
        <article class="team-card">
            <div class="card-header">
                <img src="${member.avatar}" alt="${member.name}" class="avatar" loading="lazy">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                </div>
            </div>
            <p class="member-bio">${member.bio}</p>
            <div class="skills-container">
                ${member.skills.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
            </div>
            <div class="links-container">
                ${member.links.map(link => `
                    <a href="${link.url}" class="link-btn" target="_blank" rel="noopener noreferrer">
                        <i class="ph ${link.icon}"></i>
                        ${link.label}
                    </a>
                `).join('')}
            </div>
        </article>
    `).join('');
}

// Theme Toggle Logic
function setupTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme');
    
    // Default to dark as requested
    const isDark = savedTheme === 'dark' || (savedTheme === null);
    
    if (isDark) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
    
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

// Form Validation
function setupForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Reset errors
        [name, email, message].forEach(el => el.parentElement.classList.remove('error'));
        successMsg.classList.add('hidden');
        
        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            message.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                successMsg.classList.remove('hidden');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        }
    });
}

// Sidebar Toggle
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-toggle-open');
    const closeBtn = document.getElementById('sidebar-toggle-close');

    if (!sidebar || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        sidebar.setAttribute('aria-expanded', 'true');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.setAttribute('aria-expanded', 'false');
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
    setupTheme();
    setupForm();
    setupSidebar();
});
