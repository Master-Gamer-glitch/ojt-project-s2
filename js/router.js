document.addEventListener('DOMContentLoaded', () => {
    // Initial routing
    handleRouteChange();

    // Listen to hash changes
    window.addEventListener('hashchange', handleRouteChange);
});

function handleRouteChange() {
    let hash = window.location.hash;
    if (!hash) {
        hash = '#portfolio';
    }

    const viewName = hash.replace('#', '');
    
    // Get all view containers
    const viewContainers = document.querySelectorAll('.view-container');
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');

    let viewFound = false;

    viewContainers.forEach(container => {
        if (container.id === `view-${viewName}`) {
            container.style.display = ''; // Remove inline display:none
            container.classList.add('active');
            viewFound = true;
        } else {
            container.style.display = 'none';
            container.classList.remove('active');
        }
    });

    // If the hash didn't match any view, fallback to portfolio
    if (!viewFound) {
        window.location.hash = '#portfolio';
        return; // handleRouteChange will be called again by the event listener
    }

    // Update sidebar links
    sidebarLinks.forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Toggle global header title
    const globalHeaderTitle = document.getElementById('global-header-title');
    if (globalHeaderTitle) {
        if (viewName === 'portfolio') {
            globalHeaderTitle.style.display = '';
        } else {
            globalHeaderTitle.style.display = 'none';
        }
    }

    // On mobile, close sidebar when a link is clicked
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.setAttribute('aria-expanded', 'false');
    }
}
