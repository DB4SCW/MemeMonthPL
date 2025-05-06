document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    const langButtons = document.querySelectorAll('.lang-btn');
    const countdownElement = document.getElementById('countdown-timer');
    const closeButton = document.getElementById('close-button');

    // Set the target date and time (e.g., June 15, 2025, 00:00:00)
    const targetDate = new Date('2025-06-15T00:00:00').getTime();

    // Update the countdown every second
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownElement.textContent = 'Wydarzenie już się rozpoczęło!';
            return;
        }

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Display the countdown
        countdownElement.textContent = `Start za: ${days} dni, ${hours}:${minutes}:${seconds} `;
        countdownElement.textContent = `Start za: ${days} dni,`;
    }, 1000);

    // Tab switching logic
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Deselect all tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
            });

            // Hide all tab panels
            tabPanels.forEach(panel => {
                panel.hidden = true;
            });

            // Select the clicked tab
            this.setAttribute('aria-selected', 'true');

            // Show the corresponding tab panel
            const targetPanel = document.getElementById(this.getAttribute('aria-controls'));
            targetPanel.hidden = false;
        });
    });

    // Language switching logic
    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-lang');

            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update content based on selected language
            Object.keys(translations[selectedLang]).forEach(tabId => {
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.querySelector('h3, h2').textContent =
                        translations[selectedLang][tabId].title;
                    tabContent.querySelector('p').textContent =
                        translations[selectedLang][tabId].content;
                }
            });
        });
    });

    // Optionally, activate the first tab by default
    if (tabs.length > 0) {
        tabs[0].click();
    }

    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out'); // Add fade-out class
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Hide after fade-out
        }, 1000); // Match the duration of the CSS transition (1s)
    }, 2500); // Wait 3 seconds before starting fade-out

    closeButton.addEventListener('click', function () {
        // Hide the current window
        const mainWindow = document.querySelector('.window');
        mainWindow.style.display = 'none';

        // Create a new window (Easter egg)
        const easterEggWindow = document.createElement('div');
        easterEggWindow.classList.add('easter-egg-window');
        easterEggWindow.innerHTML = `
<link rel="stylesheet" href="https://unpkg.com/xp.css"> 
        
<div class="window">
  <div class="title-bar">
    <div class="title-bar-text">A co my tu mamy</div>
    <div class="title-bar-controls">
      <button aria-label="Close" onclick="location.reload()"></button>
    </div>
  </div>
  <div class="window-body" style="display: flex; flex-direction: column; align-items: center;">
    <p>Easter Egg!</p>
    <video controls autoplay style="max-width: 100%; margin-bottom: 10px;">
      <source src="video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <button>OK</button>
  </div>
</div>
    `;
        document.body.appendChild(easterEggWindow);

        // Style the new window
        easterEggWindow.style.position = 'fixed';
        easterEggWindow.style.top = '20%';
        easterEggWindow.style.left = '50%';
        easterEggWindow.style.transform = 'translate(-50%, -50%)';
        easterEggWindow.style.width = '400px';
        easterEggWindow.style.background = '#E4E4E4';
        easterEggWindow.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
        easterEggWindow.style.borderRadius = '8px';
        easterEggWindow.style.textAlign = 'center';
    });
});