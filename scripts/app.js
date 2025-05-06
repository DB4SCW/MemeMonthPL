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
            tabs.forEach(t => t.setAttribute('aria-selected', 'false'));

            // Hide all tab panels
            tabPanels.forEach(panel => (panel.hidden = true));

            // Select the clicked tab
            this.setAttribute('aria-selected', 'true');

            // Show the corresponding tab panel
            const targetPanel = document.getElementById(this.getAttribute('aria-controls'));
            targetPanel.hidden = false;

            // Fetch data for TAB-B when it is clicked
            if (this.getAttribute('aria-controls') === 'tab-B') {
                fetchCallsignData();
            }
        });
    });

    // Optionally, activate the first tab by default
    if (tabs.length > 0) {
        tabs[0].click();
    }

    // Function to fetch data from the API and populate the table in TAB-B
    function fetchCallsignData() {
        const tableContainer = document.querySelector('#callsignTable').parentElement;

        // Clear only the dynamic content (tables), not the static text
        const existingTables = tableContainer.querySelectorAll('table, h4');
        existingTables.forEach(element => element.remove());

        // Fetch texts.json for localized messages
        fetch('texts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(texts => {
                const noDataMessage = texts.tabs['tab-B'].no_data_message;

                // Define regions to fetch data from
                const regions = [1, 2, 3];

                regions.forEach(region => {
                    // Add a heading for the region
                    const regionHeading = document.createElement('h4');
                    regionHeading.textContent = `IARU Region ${region}`;
                    tableContainer.appendChild(regionHeading);

                    // Create a table for the region
                    const table = document.createElement('table');
                    table.innerHTML = `
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
                    tableContainer.appendChild(table);

                    const tbody = table.querySelector('tbody');

                    fetch(`https://mememonth.org/api.php?year=2025&region=${region}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.length === 0) {
                                // If no data is returned, add a message row
                                const emptyRow = document.createElement('tr');
                                emptyRow.innerHTML = `<td colspan="2" style="text-align: center;">${noDataMessage}</td>`;
                                tbody.appendChild(emptyRow);
                            } else {
                                // Populate the table with data, one entry per row
                                data.forEach(entry => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td style="text-align: center;">
                                            ${entry ? `• <a href="https://qrz.com/db/${entry.callsign}" target="_blank">${entry.callsign}</a>` : ''}

                                            ${entry ? `<img src="https://flagcdn.com/24x18/${entry.flag}.png" alt="${entry.flag}" title="${entry.flag}" style="margin-left: 10px;">` : ''}
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center;">Error loading data</td></tr>`;
                        });
                });
            })
            .catch(error => {
                console.error('Error loading texts.json:', error);
            });
    }

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
    <video id="easter-egg-video" controls autoplay style="max-width: 100%; margin-bottom: 10px;">
      <source src="video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</div>
`;
        document.body.appendChild(easterEggWindow);

        // Ensure the video is not muted
        const video = document.getElementById('easter-egg-video');
        video.muted = false;
        video.play();

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

    fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            // Populate text content
            document.getElementById('title').textContent = translations.title;
            document.getElementById('loading_screen_top').textContent = translations.loading_screen_top;
            document.getElementById('loading_screen_mid').innerHTML = translations.loading_screen_mid;
            document.getElementById('loading_screen_bottom').textContent = translations.loading_screen_bottom;

            document.getElementById('tab_about').textContent = translations.tab_about;
            document.getElementById('tab_who').textContent = translations.tab_who;
            document.getElementById('tab_when').textContent = translations.tab_when;
            document.getElementById('tab_where').textContent = translations.tab_where;
            document.getElementById('tab_why').textContent = translations.tab_why;
            document.getElementById('tab_qsl').textContent = translations.tab_qsl;
            document.getElementById('tab_2024').textContent = translations.tab_2024;
            document.getElementById('tab_2023').textContent = translations.tab_2023;
            document.getElementById('tab_2022').textContent = translations.tab_2022;
            document.getElementById('tab_legal').textContent = translations.tab_legal;

            document.getElementById('about_heading').textContent = translations.about_heading;
            document.getElementById('about_paragraph_1').textContent = translations.about_paragraph_1;
            document.getElementById('about_paragraph_2').textContent = translations.about_paragraph_2;
            document.getElementById('certificate-info').textContent = translations.certificate_info;
            document.getElementById('certificate-button').textContent = translations.certificate_button;
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate tab-A content
            const tabATitle = document.getElementById('tab-A-title');
            const tabASections = document.getElementById('tab-A-sections');

            const tabAData = texts.tabs['tab-A'];

            // Set the title, ensuring it exists
            tabATitle.textContent = tabAData.title || 'Default Title';

            // Clear existing content
            tabASections.innerHTML = '';

            // Generate subsections
            if (Array.isArray(tabAData.subsections)) {
                tabAData.subsections.forEach(subsection => {
                    const section = document.createElement('div');

                    // Add subtitle if it exists
                    if (subsection.subtitle) {
                        const subtitle = document.createElement('h4');
                        subtitle.textContent = subsection.subtitle;
                        section.appendChild(subtitle);
                    }

                    // Add content if it exists
                    if (Array.isArray(subsection.content)) {
                        subsection.content.forEach(line => {
                            const paragraph = document.createElement('p');
                            paragraph.textContent = line || ''; // Avoid undefined
                            section.appendChild(paragraph);
                        });
                    } else if (subsection.content) {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = subsection.content || ''; // Avoid undefined
                        section.appendChild(paragraph);
                    }

                    tabASections.appendChild(section);
                });
            }
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            const certificateInfo = document.getElementById('certificate-info');
            const certificateButton = document.getElementById('certificate-button');

            const eventStartDate = new Date('2025-06-15');
            const today = new Date();

            if (today >= eventStartDate) {
                // After the event start date
                certificateInfo.textContent = texts.certificate.info_after;
                certificateButton.textContent = texts.certificate.button_text;
                certificateButton.style.display = 'inline-block';
                certificateButton.onclick = () => {
                    window.location.href = texts.certificate.button_url;
                };
            } else {
                // Before the event start date
                certificateInfo.textContent = texts.certificate.info_before;
                certificateButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading texts:', error);
        });

    function loadTabBContent() {
        // Fetch the JSON file
        fetch('texts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Get the content for Tab-B
                const tabBContent = data.tabs['tab-B'];

                // Update the title
                const tabBTitle = document.getElementById('tab-B-title');
                tabBTitle.textContent = tabBContent.title;

                // Update the paragraph content
                const tabBParagraph = document.querySelector('#tab-B p');
                tabBParagraph.textContent = tabBContent.content[0];

                // Optionally, you can dynamically add more content if needed
            })
            .catch(error => {
                console.error('Error loading Tab-B content:', error);
            });
    }

    // Call this function when Tab-B is activated
    document.querySelector('[aria-controls="tab-B"]').addEventListener('click', loadTabBContent);

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-C
            const tabCTitle = document.getElementById('tab-C-title');
            const tabCContent = document.getElementById('tab-C-content');
            tabCTitle.textContent = texts.tabs['tab-C'].title;
            tabCContent.textContent = texts.tabs['tab-C'].content;

            // Populate Tab-D
            const tabDTitle = document.getElementById('tab-D-title');
            const tabDContent = document.getElementById('tab-D-content');
            tabDTitle.textContent = texts.tabs['tab-D'].title;
            tabDContent.textContent = texts.tabs['tab-D'].content;
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-E
            const tabETitle = document.getElementById('tab-E-title');
            const tabEContent = document.getElementById('tab-E-content');
            tabETitle.textContent = texts.tabs['tab-E'].title;
            tabEContent.textContent = texts.tabs['tab-E'].content;

            // Populate Tab-F
            const tabFTitle = document.getElementById('tab-F-title');
            const tabFContent = document.getElementById('tab-F-content');
            tabFTitle.textContent = texts.tabs['tab-F'].title;
            tabFContent.textContent = texts.tabs['tab-F'].content;

            // Populate Tab-G
            const tabGTitle = document.getElementById('tab-G-title');
            const tabGContent = document.getElementById('tab-G-content');
            tabGTitle.textContent = texts.tabs['tab-G'].title;
            tabGContent.textContent = texts.tabs['tab-G'].content;
            // Populate Tab-H
            const tabHTitle = document.getElementById('tab-H-title');
            const tabHContent = document.getElementById('tab-H-content');
            tabHTitle.textContent = texts.tabs['tab-H'].title;
            tabHContent.textContent = texts.tabs['tab-H'].content;
            // Populate Tab-I
            const tabITitle = document.getElementById('tab-I-title');
            const tabIContent = document.getElementById('tab-I-content');
            tabITitle.textContent = texts.tabs['tab-I'].title;
            tabIContent.textContent = texts.tabs['tab-I'].content;

            
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    // Modify the fetchTabDataForYear function to group two entries per row
    function fetchTabDataForYear(tabId, year) {
        const tableContainer = document.querySelector(`#${tabId}-table`).parentElement;

        // Clear only the dynamic content (tables), not the static text
        const existingTables = tableContainer.querySelectorAll('table, h4');
        existingTables.forEach(element => element.remove());

        // Fetch texts.json for localized messages
        fetch('texts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(texts => {
                const noDataMessage = texts.tabs[tabId]?.no_data_message || "Brak danych";

                // Define regions to fetch data from
                const regions = [1, 2, 3];

                regions.forEach(region => {
                    // Add a heading for the region
                    const regionHeading = document.createElement('h4');
                    regionHeading.textContent = `IARU Region ${region}`;
                    tableContainer.appendChild(regionHeading);

                    // Create a table for the region
                    const table = document.createElement('table');
                    table.innerHTML = `
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
                    tableContainer.appendChild(table);

                    const tbody = table.querySelector('tbody');

                    fetch(`https://mememonth.org/api.php?year=${year}&region=${region}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.length === 0) {
                                // If no data is returned, add a message row
                                const emptyRow = document.createElement('tr');
                                emptyRow.innerHTML = `<td colspan="2" style="text-align: center;">${noDataMessage}</td>`;
                                tbody.appendChild(emptyRow);
                            } else {
                                // Populate the table with data, two entries per row
                                for (let i = 0; i < data.length; i += 2) {
                                    const row = document.createElement('tr');
                                    const entry1 = data[i];
                                    const entry2 = data[i + 1];

                                    if (entry2) {
                                        // If there are two entries, create a normal row
                                        row.innerHTML = `
                                            <td style="text-align: center;">
                                                ${entry1 ? `• <a href="https://qrz.com/db/${entry1.callsign}" target="_blank">${entry1.callsign}</a>` : ''}
                                                ${entry1 ? `<img src="https://flagcdn.com/24x18/${entry1.flag}.png" alt="${entry1.flag}" title="${entry1.flag}" style="margin-left: 10px;">` : ''}
                                            </td>
                                            <td style="text-align: center;">
                                                ${entry2 ? `• <a href="https://qrz.com/db/${entry2.callsign}" target="_blank">${entry2.callsign}</a>` : ''}
                                                ${entry2 ? `<img src="https://flagcdn.com/24x18/${entry2.flag}.png" alt="${entry2.flag}" title="${entry2.flag}" style="margin-left: 10px;">` : ''}
                                            </td>
                                        `;
                                    } else {
                                        // If there is only one entry, span it across all columns
                                        row.innerHTML = `
                                            <td colspan="2" style="text-align: center;">
                                                ${entry1 ? `• <a href="https://qrz.com/db/${entry1.callsign}" target="_blank">${entry1.callsign}</a>` : ''}
                                                ${entry1 ? `<img src="https://flagcdn.com/24x18/${entry1.flag}.png" alt="${entry1.flag}" title="${entry1.flag}" style="margin-left: 10px;">` : ''}
                                            </td>
                                        `;
                                    }
                                    tbody.appendChild(row);
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center;">Error loading data</td></tr>`;
                        });
                });
            })
            .catch(error => {
                console.error('Error loading texts.json:', error);
            });
    }

    // Add event listeners for Tabs G, H, and I
    document.querySelector('[aria-controls="tab-G"]').addEventListener('click', () => {
        fetchTabDataForYear('tab-G', 2024);
    });

    document.querySelector('[aria-controls="tab-H"]').addEventListener('click', () => {
        fetchTabDataForYear('tab-H', 2023);
    });

    document.querySelector('[aria-controls="tab-I"]').addEventListener('click', () => {
        fetchTabDataForYear('tab-I', 2022);
    });

    function loadTabFContent() {
        fetch('texts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(texts => {
                const tabFData = texts.tabs['tab-F'];
                const tabFTitle = document.getElementById('tab-F-title');
                const tabFContent = document.getElementById('tab-F-content');

                // Set the title
                tabFTitle.textContent = tabFData.title;

                // Populate the subsections
                tabFContent.innerHTML = ''; // Clear existing content
                tabFData.subsections.forEach(subsection => {
                    const section = document.createElement('div');
                    section.innerHTML = `<h4>${subsection.subtitle}</h4>`;

                    // Add content
                    subsection.content.forEach(line => {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = line;
                        section.appendChild(paragraph);
                    });

                    tabFContent.appendChild(section);
                });
            })
            .catch(error => {
                console.error('Error loading Tab-F content:', error);
            });
    }

    // Add event listener for Tab-F
    document.querySelector('[aria-controls="tab-F"]').addEventListener('click', loadTabFContent);

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-J
            const tabJTitle = document.getElementById('tab-J-title');
            const tabJContent = document.getElementById('tab-J-content');
            tabJTitle.textContent = texts.tabs['tab-J'].title;
            tabJContent.textContent = texts.tabs['tab-J'].content;
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-J
            const tabJTitle = document.getElementById('tab-J-title');
            const tabJContent = document.getElementById('tab-J-content');
            const tabJData = texts.tabs['tab-J'];

            // Set the title
            tabJTitle.textContent = tabJData.title;

            // Populate subsections
            tabJData.subsections.forEach(subsection => {
                const section = document.createElement('div');
                section.innerHTML = `<h4>${subsection.subtitle}</h4>`;
                subsection.content.forEach(line => {
                    const paragraph = document.createElement('p');
                    paragraph.innerHTML = line; // Use innerHTML to allow links and spans
                    section.appendChild(paragraph);
                });
                tabJContent.appendChild(section);
            });
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate status bar
            document.getElementById('status-version').textContent = texts.status_bar.version;
            document.getElementById('status-ptt-message').textContent = texts.status_bar.ptt_message;
            document.getElementById('status-transmission-message').textContent = texts.status_bar.transmission_message;

            // Update CPU usage dynamically
            const cpuUsageElement = document.getElementById('status-cpu-usage');
            setInterval(() => {
                const randomCpuUsage = Math.floor(Math.random() * 100) + 1; // Random value between 1 and 100
                cpuUsageElement.textContent = `${texts.status_bar.cpu_usage}${randomCpuUsage}%`;
            }, 2000); // Update every 2 seconds
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-D
            const tabDTitle = document.getElementById('tab-D-title');
            const tabDContent = document.getElementById('tab-D-content');

            const tabDData = texts.tabs['tab-D'];
            tabDTitle.textContent = tabDData.title;

            // Add main content
            tabDContent.innerHTML = ''; // Clear existing content
            if (Array.isArray(tabDData.content)) {
                tabDData.content.forEach(line => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = line;
                    tabDContent.appendChild(paragraph);
                });
            } else {
                const paragraph = document.createElement('p');
                paragraph.textContent = tabDData.content;
                tabDContent.appendChild(paragraph);
            }

            // Add content2 if it exists
            if (Array.isArray(tabDData.content2)) {
                const subtitle = document.createElement('h4');
                subtitle.textContent = tabDData.subtitle || 'Additional Information';
                tabDContent.appendChild(subtitle);

                tabDData.content2.forEach(line => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = line;
                    tabDContent.appendChild(paragraph);
                });
            }
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-H (Wydarzenie 2023)
            const tabHTitle = document.getElementById('tab-H-title');
            const tabHContent = document.getElementById('tab-H-content');

            const tabHData = texts.tabs['tab-H'];
            tabHTitle.textContent = tabHData.title || 'Default Title'; // Fallback if title is missing
            tabHContent.textContent = tabHData.content || 'Brak danych'; // Fallback if content is missing

            // Populate Tab-I (Wydarzenie 2022)
            const tabITitle = document.getElementById('tab-I-title');
            const tabIContent = document.getElementById('tab-I-content');

            const tabIData = texts.tabs['tab-I'];
            tabITitle.textContent = tabIData.title || 'Default Title'; // Fallback if title is missing
            tabIContent.textContent = tabIData.content || 'Brak danych'; // Fallback if content is missing
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-I (Wydarzenie 2022)
            const tabITitle = document.getElementById('tab-I-title');
            const tabIData = texts.tabs['tab-I'];

            // Set the title
            tabITitle.textContent = tabIData.title || 'Brak tytułu'; // Fallback if title is missing
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    fetch('texts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(texts => {
            // Populate Tab-G (2024)
            const tabGTitle = document.getElementById('tab-G-title');
            const tabGContent = document.getElementById('tab-G-content');

            const tabGData = texts.tabs['tab-G'];
            tabGTitle.textContent = tabGData.title || 'Default Title'; // Fallback if title is missing

            // Create and append the table first
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Callsign</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>VC4FUN</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>VC4LOL</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>VC4MEME</td>
                    </tr>
                </tbody>
            `;
            tabGContent.appendChild(table);

            // Add Award Check for 2024 after the table
            const awardCheck2024Heading = document.createElement('h3');
            awardCheck2024Heading.textContent = 'Award check:';
            tabGContent.appendChild(awardCheck2024Heading);

            const awardCheck2024Link = document.createElement('a');
            awardCheck2024Link.href = 'https://hamawardz.app/logcheck/meme-appreciation-award-2024';
            awardCheck2024Link.innerHTML = '<button>Awardcheck (2024)</button>';
            tabGContent.appendChild(awardCheck2024Link);

            // Populate Tab-H (2023)
            const tabHTitle = document.getElementById('tab-H-title');
            const tabHContent = document.getElementById('tab-H-content');

            const tabHData = texts.tabs['tab-H'];
            tabHTitle.textContent = tabHData.title || 'Default Title'; // Fallback if title is missing

            // Create and append the table first
            const tableH = document.createElement('table');
            tableH.innerHTML = `
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Callsign</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>VC3YEET</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>VC3CAT</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>VC3WOW</td>
                    </tr>
                </tbody>
            `;
            tabHContent.appendChild(tableH);

            // Add Award Check for 2023 after the table
            const awardCheck2023Heading = document.createElement('h3');
            awardCheck2023Heading.textContent = 'Award check:';
            tabHContent.appendChild(awardCheck2023Heading);

            const awardCheck2023Link = document.createElement('a');
            awardCheck2023Link.href = 'https://hamawardz.app/logcheck/meme-appreciation-award-2023';
            awardCheck2023Link.innerHTML = '<button>Awardcheck (2023)</button>';
            tabHContent.appendChild(awardCheck2023Link);
        })
        .catch(error => {
            console.error('Error loading texts.json:', error);
        });

    function updateEventProgress() {
        const progressBar = document.getElementById('eventProgress');

        // Daty rozpoczęcia i zakończenia wydarzenia
        const startDate = new Date('2025-06-15T00:00:00').getTime();
        const endDate = new Date('2025-08-15T23:59:59').getTime();
        const currentDate = new Date().getTime();

        // Oblicz całkowity czas trwania wydarzenia i czas, który już minął
        const totalDuration = endDate - startDate;
        const elapsedTime = currentDate - startDate;

        // Oblicz procentowy postęp
        let progress = (elapsedTime / totalDuration) * 100;

        // Upewnij się, że wartość mieści się w zakresie 0-100
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;

        // Ustaw wartość paska postępu
        progressBar.value = progress;
    }

    // Wywołaj funkcję po załadowaniu strony i ustaw interwał, aby aktualizować pasek co minutę
    updateEventProgress();
    setInterval(updateEventProgress, 60000); // Aktualizacja co 60 sekund
});