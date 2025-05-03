// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Function to apply the selected theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.textContent = '☀️ লাইট মোড'; // Sun icon text
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.textContent = '🌙 ডার্ক মোড'; // Moon icon text
            }
            localStorage.setItem('theme', 'light');
        }
        // Optional: Re-highlight code after theme change if Prism styles depend on body class
        // Needed if Prism CSS uses .dark-mode selectors significantly
        // if (typeof Prism !== 'undefined') {
        //     Prism.highlightAll();
        // }
    }

    // Set initial theme based on localStorage or system preference
    let preferredTheme = 'light'; // Default to light mode
    if (currentTheme) {
        preferredTheme = currentTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Uncomment below line to default to system preference initially
        // preferredTheme = 'dark';
    }
    applyTheme(preferredTheme); // Apply the initial theme

    // Add event listener to the theme toggle button (if it exists)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // --- Comment Toggle Functionality ---
    const codeContainers = document.querySelectorAll('.code-container');

    codeContainers.forEach(container => {
        const button = container.querySelector('.toggle-comments-btn');
        const codeElement = container.querySelector('.code-content');

        if (button && codeElement) {
            // Store the original code content
            const originalCode = codeElement.textContent;
            let commentsVisible = true; // Initial state: comments are visible
            let noCommentsCode = null; // Store comment-free code lazily

            // Function to generate code without comments
            function getCodeWithoutComments(code) {
                 // Remove multi-line comments /* ... */ safely
                 let noMultiLine = code.replace(/\/\*[\s\S]*?\*\//g, '');
                 // Remove single line comments // safely (handles URLs etc. better)
                 let noSingleLine = noMultiLine.replace(/(\/\/.*)/g, (match, p1, offset, string) => {
                     // Check if the // is inside a string literal
                     const stringCheck = string.substring(0, offset);
                     const inString = (stringCheck.match(/"/g) || []).length % 2 !== 0 || (stringCheck.match(/'/g) || []).length % 2 !== 0;
                     return inString ? match : ''; // Keep if in string, otherwise remove
                 });
                 // Remove lines that become empty after comment removal
                return noSingleLine.replace(/^\s*[\r\n]/gm, '').trim();
            }

            // Add click event listener to the toggle button
            button.addEventListener('click', () => {
                if (commentsVisible) {
                    // Remove comments
                    if (noCommentsCode === null) { // Generate only once if needed
                        noCommentsCode = getCodeWithoutComments(originalCode);
                    }
                    codeElement.textContent = noCommentsCode;
                    button.textContent = 'কমেন্ট দেখান';
                    commentsVisible = false;
                } else {
                    // Show original code with comments
                    codeElement.textContent = originalCode;
                    button.textContent = 'কমেন্ট লুকান';
                    commentsVisible = true;
                }

                // Re-highlight the code block using Prism.js after modification
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeElement);
                }
            });

             // Initial highlight after page load (if Prism is loaded)
             // Moved outside the loop to highlight all at once later
        }
    });

    // --- Initial Prism Highlighting ---
    // Highlight all code blocks on the page after setting up everything
    if (typeof Prism !== 'undefined') {
        // Optionally prevent automatic highlighting if using manual calls
        // Prism.manual = true;
        Prism.highlightAll(); // Highlights all elements matching the convention
    }

}); // End of DOMContentLoaded listener