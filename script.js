// Pastikan DOM dimuat sepenuhnya
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle and Persistence
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.background = document.body.classList.contains('dark-mode') ? '#333' : '#ffffff';
                input.style.color = document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#000000';
                input.style.borderColor = document.body.classList.contains('dark-mode') ? '#555' : '#ccc';
            });
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                label.style.color = document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#333';
            });
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    // Load Saved Theme and Initialize
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateLanguage();
    generateCaptcha();
    updateGallery();
    updateHistory();
    updateTips();
    showBookmarks();

    // Navigation with Keyboard Support
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.dataset.tool;
            if (tool) {
                logUsage(tool);
                document.querySelectorAll('.tool-content').forEach(content => {
                    content.style.display = 'none';
                    content.classList.remove('active');
                });
                const target = document.getElementById(tool);
                if (target) {
                    target.style.display = 'block';
                    setTimeout(() => target.classList.add('active'), 10);
                } else {
                    console.error(`Target ${tool} tidak ditemukan!`);
                }
            }
        });
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const tool = button.dataset.tool;
            if (tool && !['home', 'bookmarks'].includes(tool)) {
                toggleBookmark(tool);
            }
        });
    });

    // Contact Icon (di-handle di navigasi biasa)
    const contactBtn = document.querySelector('.contact-icon');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logUsage('contact');
            showContent('contact');
        });
    }

    // Back to Default
    function goToDefault() {
        document.querySelectorAll('.tool-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        const home = document.getElementById('home');
        if (home) {
            home.style.display = 'block';
            setTimeout(() => home.classList.add('active'), 10);
        }
    }

    // Show Specific Content in Settings
    function showContent(section) {
        logUsage(section);
        document.querySelectorAll('.tool-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        const target = document.getElementById(section);
        if (target) {
            target.style.display = 'block';
            setTimeout(() => target.classList.add('active'), 10);
        } else {
            console.error(`Section ${section} tidak ditemukan!`);
        }
    }

    // Usage Logging
    function logUsage(tool) {
        const usage = JSON.parse(localStorage.getItem('usage') || '{}');
        usage[tool] = (usage[tool] || 0) + 1;
        localStorage.setItem('usage', JSON.stringify(usage));
        console.log(`Tool ${tool} digunakan ${usage[tool]} kali.`);
    }

    // Fungsi-fungsi lain (calculateAge, calculateBMI, dll.) tetap sama seperti sebelumnya
    // Hanya tambahkan penanganan error sederhana di setiap fungsi
    function calculateAge() {
        showLoading();
        const birthdate = document.getElementById('birthdate')?.value;
        const ageError = document.getElementById('ageError');
        if (!birthdate) {
            if (ageError) ageError.innerText = 'Silakan pilih tanggal lahir!';
            if (document.getElementById('birthdate')) document.getElementById('birthdate').focus();
            hideLoading();
            return;
        }
        // ... (logika lain tetap sama)
    }

    function calculateBMI() {
        showLoading();
        const weight = parseFloat(document.getElementById('weight')?.value) || 0;
        const height = parseFloat(document.getElementById('height')?.value) || 0;
        const bmiError = document.getElementById('bmiError');
        if (isNaN(weight) || isNaN(height)) {
            if (bmiError) bmiError.innerText = 'Masukkan angka yang valid!';
            if (isNaN(weight) && document.getElementById('weight')) document.getElementById('weight').focus();
            else if (document.getElementById('height')) document.getElementById('height').focus();
            hideLoading();
            return;
        }
        // ... (logika lain tetap sama)
    }

    // ... (fungsi lain seperti generateQR, generatePassword, dll. tambahkan penanganan serupa)

    // Logout Function
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Yakin logout?')) {
                localStorage.clear();
                alert('Logout berhasil!');
                goToDefault();
            }
        });
    }

    // Loading Functions
    function showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('active');
    }

    function hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('active');
    }
});

// Fungsi lain (updateLanguage, saveSettings, dll.) tetap sama seperti sebelumnya
