function navigateTo(url) {
    const currentPath = window.location.pathname;
    const currentQueryString = window.location.search;
    
    // Preserve query string
    const newUrl = (url === '/' || url === '/help' || url === '/file-requirements' || url === '/license' || url === '/browser-compatibility') ? url : url + currentQueryString;

    if (currentPath !== url || currentQueryString !== (newUrl.includes('?') ? newUrl.substring(newUrl.indexOf('?')) : '')) {
        // Update the browser's history stack
        history.pushState(null, null, newUrl);
        router();
    }
}

function router() {
    // Get the current path and query string
    const path = window.location.pathname;
    const queryString = window.location.search;

    const homePage = document.getElementById('home-page');
    const helpPage = document.getElementById('help-page');
    const mainContent = document.getElementById('main-content');
    const fileRequirementPage = document.getElementById('file-requirements-page');
    const licensePage = document.getElementById('license-page');
    const compatibilityPage = document.getElementById('compatible-browsers-page');

    mainContent.style.position = 'absolute'; // Move it out of view
    mainContent.style.top = '-9999px';

    // Hide all pages initially
    homePage.style.display = 'none';
    helpPage.style.display = 'none';
    mainContent.style.visibility = 'hidden';
    fileRequirementPage.style.display = 'none';
    licensePage.style.display = 'none';
    compatibilityPage.style.display = 'none';

    if (path === '/help') {
        helpPage.style.display = 'block';
    } else if (path === '/' && queryString) {
        mainContent.style.visibility = 'visible';
        mainContent.style.position = 'relative'; // Back to normal position
        mainContent.style.top = '0';
        const params = new URLSearchParams(queryString);
        const alignmentUrl = params.get('alignment-url');
        const indexUrl = params.get('index-url');
        const broker = document.querySelector('iobio-data-broker');
        if (broker) {
            broker.alignmentUrl = alignmentUrl;
            broker.indexUrl = indexUrl;
        }
    } else if (path === '/file-requirements') {
        fileRequirementPage.style.display = 'block';
    } else if (path === '/license') {
        licensePage.style.display = 'block';
    } else if (path === '/browser-compatibility') {
        compatibilityPage.style.display = 'block';
    }
    else {
        // Default case: show home page
        homePage.style.display = 'block';
    }
}

function initRouter() {
    // Event listener for clicks on navigation links
    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-link]')) {
            event.preventDefault();
            const url = event.target.getAttribute('data-link');
            navigateTo(url);
        }
    });

    // Listen for popstate event to handle browser back and forward buttons
    window.addEventListener('popstate', router);

    // Set up the initial page
    router();
}

export { initRouter, navigateTo };