// Theme Toggle and Persistence
document.getElementById('themeToggle').addEventListener('click', () => {
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

// Load Saved Theme and Initialize
window.onload = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateLanguage();
    generateCaptcha();
    updateGallery();
    updateHistory();
    updateTips();
    showBookmarks();
};

// Navigation with Keyboard Support
document.querySelectorAll('.nav-btn, .nav-subbtn, .tool-item').forEach(button => {
    button.addEventListener('click', () => {
        logUsage(button.dataset.tool);
        document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
        const target = document.getElementById(button.dataset.tool);
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
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

// Contact Icon
document.querySelector('.contact-icon').addEventListener('click', (e) => {
    e.preventDefault();
    logUsage('contact');
    document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
    const target = document.getElementById('contact');
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 10);
});

// Back to Default
function goToDefault() {
    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    document.getElementById('home').style.display = 'block';
    setTimeout(() => document.getElementById('home').classList.add('active'), 10);
}

// Usage Logging
function logUsage(tool) {
    const usage = JSON.parse(localStorage.getItem('usage') || '{}');
    usage[tool] = (usage[tool] || 0) + 1;
    localStorage.setItem('usage', JSON.stringify(usage));
    console.log(`Tool ${tool} digunakan ${usage[tool]} kali.`);
}

// Age Calculator with Detailed Validation and History
function calculateAge() {
    showLoading();
    const birthdate = document.getElementById('birthdate').value;
    const ageError = document.getElementById('ageError');
    if (!birthdate) {
        ageError.innerText = 'Silakan pilih tanggal lahir!';
        document.getElementById('birthdate').focus();
        hideLoading();
        return;
    }
    const today = new Date();
    const birth = new Date(birthdate);
    if (birth > today) {
        ageError.innerText = 'Tanggal lahir tidak boleh di masa depan!';
        document.getElementById('birthdate').focus();
        hideLoading();
        return;
    }
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 0) {
        ageError.innerText = 'Tanggal lahir tidak valid!';
        document.getElementById('birthdate').focus();
        hideLoading();
        return;
    }
    ageError.innerText = '';
    document.getElementById('ageResult').innerText = `Usia Anda: ${age} tahun`;
    saveHistory('age-bmi', `Usia: ${age} tahun`);
    hideLoading();
}

// BMI Calculator with Detailed Validation and History
function calculateBMI() {
    showLoading();
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const bmiError = document.getElementById('bmiError');
    if (isNaN(weight) || isNaN(height)) {
        bmiError.innerText = 'Masukkan angka yang valid untuk berat dan tinggi!';
        if (isNaN(weight)) document.getElementById('weight').focus();
        else document.getElementById('height').focus();
        hideLoading();
        return;
    }
    if (weight < 1 || weight > 500) {
        bmiError.innerText = 'Berat harus antara 1-500 kg!';
        document.getElementById('weight').focus();
        hideLoading();
        return;
    }
    if (height < 10 || height > 300) {
        bmiError.innerText = 'Tinggi harus antara 10-300 cm!';
        document.getElementById('height').focus();
        hideLoading();
        return;
    }
    const bmi = weight / ((height / 100) * (height / 100));
    bmiError.innerText = '';
    document.getElementById('bmiResult').innerText = `BMI Anda: ${bmi.toFixed(2)}`;
    saveHistory('age-bmi', `BMI: ${bmi.toFixed(2)}`);
    hideLoading();
}

// QR Code Generator with Detailed Validation, Download, and Gallery
function generateQR() {
    showLoading();
    const qrInput = document.getElementById('qrInput').value.trim();
    const qrSpinner = document.getElementById('qrSpinner');
    const qrError = document.getElementById('qrError');
    const qrContainer = document.getElementById('qrCode');
    const qrSuccess = document.getElementById('qrSuccess');
    const downloadQR = document.getElementById('downloadQR');
    const saveQRBtn = document.getElementById('saveQRBtn');
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    const invalidChars = /[<>{}]/;
    if (!qrInput) {
        qrError.innerText = 'Masukkan URL atau teks!';
        document.getElementById('qrInput').focus();
        hideLoading();
        return;
    }
    if (qrInput.length < 1) {
        qrError.innerText = 'Teks minimal 1 karakter!';
        document.getElementById('qrInput').focus();
        hideLoading();
        return;
    }
    if (invalidChars.test(qrInput)) {
        qrError.innerText = 'Teks mengandung karakter tidak valid (<, >, {, })!';
        document.getElementById('qrInput').focus();
        hideLoading();
        return;
    }
    qrError.innerText = '';
    qrSpinner.style.display = 'inline-block';
    if (!qrContainer) {
        qrError.innerText = 'Elemen QRCode tidak ditemukan!';
        qrSpinner.style.display = 'none';
        hideLoading();
        return;
    }
    qrContainer.innerHTML = '';
    console.log('Generating QR for:', qrInput);
    try {
        new QRCode(qrContainer, {
            text: qrInput,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff'
        });
        qrSpinner.style.display = 'none';
        qrSuccess.innerText = 'QR berhasil dibuat!';
        downloadQR.style.display = 'block';
        saveQRBtn.style.display = 'block';
        downloadQR.onclick = () => {
            const qrImg = qrContainer.getElementsByTagName('img')[0];
            const link = document.createElement('a');
            link.href = qrImg.src;
            link.download = 'qrcode.png';
            link.click();
        };
        console.log('QR Generated');
    } catch (error) {
        qrError.innerText = 'Error generating QR: ' + error.message;
        qrSpinner.style.display = 'none';
        console.error(error);
    }
    hideLoading();
}

// Password Generator with Detailed Validation and Gallery
function generatePassword() {
    showLoading();
    const passSpinner = document.getElementById('passSpinner');
    const passLength = parseInt(document.getElementById('passLength').value) || 12;
    const savePassBtn = document.getElementById('savePassBtn');
    if (isNaN(passLength)) {
        document.getElementById('passwordResult').innerText = 'Panjang harus angka!';
        document.getElementById('passLength').focus();
        hideLoading();
        return;
    }
    if (passLength < 8 || passLength > 20) {
        document.getElementById('passwordResult').innerText = 'Panjang harus antara 8-20 karakter!';
        document.getElementById('passLength').focus();
        hideLoading();
        return;
    }
    passSpinner.style.display = 'inline-block';
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < passLength; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('passwordResult').innerText = `Password: ${password}`;
    savePassBtn.style.display = 'block';
    passSpinner.style.display = 'none';
    hideLoading();
}

// Countdown Timer with Detailed Validation, Notification, Gallery, and Progress
let timerInterval;
function startTimer() {
    showLoading();
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const timerError = document.getElementById('timerError');
    const timerSpinner = document.getElementById('timerSpinner');
    const saveTimerBtn = document.getElementById('saveTimerBtn');
    const progressBar = document.getElementById('timerProgress');
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        timerError.innerText = 'Masukkan angka yang valid untuk waktu!';
        if (isNaN(hours)) document.getElementById('hours').focus();
        else if (isNaN(minutes)) document.getElementById('minutes').focus();
        else document.getElementById('seconds').focus();
        hideLoading();
        return;
    }
    if (hours < 0 || hours > 99 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        timerError.innerText = 'Jam (0-99), Menit/Detik (0-59) tidak valid!';
        if (hours < 0 || hours > 99) document.getElementById('hours').focus();
        else if (minutes < 0 || minutes > 59) document.getElementById('minutes').focus();
        else document.getElementById('seconds').focus();
        hideLoading();
        return;
    }
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 359999) { // 99:59:59
        timerError.innerText = 'Total waktu maksimal 99:59:59!';
        document.getElementById('hours').focus();
        hideLoading();
        return;
    }
    timerError.innerText = '';
    timerSpinner.style.display = 'inline-block';
    clearInterval(timerInterval);
    let remaining = totalSeconds;
    let progress = 100;
    progressBar.style.transition = 'width 1s linear';
    timerSpinner.style.display = 'none';
    hideLoading();
    timerInterval = setInterval(() => {
        if (remaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "Selesai!";
            alert('Timer selesai!');
            progressBar.style.width = '0%';
            saveTimerBtn.style.display = 'block';
            return;
        }
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        document.getElementById('timerDisplay').innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        progressBar.style.width = `${progress}%`;
        progress -= 100 / totalSeconds;
        remaining--;
    }, 1000);
}

// Text Case Converter with Detailed Validation and Gallery
function convertText(caseType) {
    showLoading();
    const text = document.getElementById('textInput').value.trim();
    const textError = document.getElementById('textError');
    const spinnerId = `text${caseType.charAt(0).toUpperCase() + caseType.slice(1)}Spinner`;
    const spinner = document.getElementById(spinnerId);
    const saveTextBtn = document.getElementById('saveTextBtn');
    if (!text) {
        textError.innerText = 'Masukkan teks terlebih dahulu!';
        document.getElementById('textInput').focus();
        hideLoading();
        return;
    }
    if (/^\s+$/.test(text)) {
        textError.innerText = 'Teks tidak boleh hanya spasi!';
        document.getElementById('textInput').focus();
        hideLoading();
        return;
    }
    textError.innerText = '';
    spinner.style.display = 'inline-block';
    let result = '';
    switch (caseType) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'capitalize':
            result = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            break;
    }
    document.getElementById('textResult').innerText = result;
    saveTextBtn.style.display = 'block';
    spinner.style.display = 'none';
    hideLoading();
}

// Currency Converter with Detailed Validation, Static Rates, and Gallery
const exchangeRates = {
    USD: { IDR: 14500 },
    IDR: { USD: 1/14500 }
};

function convertCurrency() {
    showLoading();
    const amountInput = document.getElementById('amount').value.trim();
    const amount = parseFloat(amountInput) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const currencyError = document.getElementById('currencyError');
    const currencySpinner = document.getElementById('currencySpinner');
    const saveCurrencyBtn = document.getElementById('saveCurrencyBtn');
    if (isNaN(amount)) {
        currencyError.innerText = 'Masukkan angka yang valid!';
        document.getElementById('amount').focus();
        hideLoading();
        return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(amountInput) || amount < 0 || amount > 1000000) {
        currencyError.innerText = 'Jumlah harus 0-1,000,000 dengan maksimal 2 desimal!';
        document.getElementById('amount').focus();
        hideLoading();
        return;
    }
    currencyError.innerText = '';
    currencySpinner.style.display = 'inline-block';
    const rate = exchangeRates[from][to] || 1;
    const result = amount * rate;
    document.getElementById('currencyResult').innerText = `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
    saveCurrencyBtn.style.display = 'block';
    currencySpinner.style.display = 'none';
    hideLoading();
}

// Chat Box
document.querySelector('.chat-toggle').addEventListener('click', () => {
    document.querySelector('.chat-box').classList.toggle('active');
});

document.querySelector('.chat-send').addEventListener('click', () => {
    const input = document.querySelector('.chat-input');
    const message = input.value.toLowerCase().trim();
    const chatMessages = document.querySelector('.chat-messages');
    if (message) {
        chatMessages.innerHTML += `<p><strong>Kamu:</strong> ${message}</p>`;
        if (message === 'bantuan') {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Cek <a href="#" data-tool="help">Bantuan</a> untuk panduan!</p>`;
        } else if (message === 'kontak') {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Hubungi <a href="mailto:vin.nesia.id@gmail.com">email</a> atau <a href="https://wa.me/62895354511777">WhatsApp</a>.</p>`;
        } else if (message.includes('penting')) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Ini penting! Hubungi <a href="https://wa.me/62895354511777">WhatsApp</a> atau <a href="mailto:vin.nesia.id@gmail.com">email</a>.</p>`;
        } else {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Maaf, tidak mengerti. Ketik 'bantuan' atau 'kontak'.</p>`;
        }
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

document.querySelector('.chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.querySelector('.chat-send').click();
    }
});

// Contact Form with Local CAPTCHA
let captchaAnswer;
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captchaQuestion').innerText = `${num1} + ${num2}`;
}

document.querySelector('#contact form').addEventListener('submit', (e) => {
    showLoading();
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const captchaInput = parseInt(document.getElementById('captchaInput').value) || 0;
    if (!name || !email || !message) {
        alert('Semua field harus diisi!');
        hideLoading();
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Email tidak valid!');
        form.email.focus();
        hideLoading();
        return;
    }
    if (captchaInput !== captchaAnswer) {
        alert('CAPTCHA salah!');
        document.getElementById('captchaInput').focus();
        hideLoading();
        return;
    }
    console.log('Form data:', { name, email, message });
    alert('Pesan berhasil dikirim! (Simulasi, email tidak terkirim karena tanpa API)');
    form.reset();
    generateCaptcha();
    hideLoading();
});

// Settings and Language
const translations = {
    id: {
        welcome: "Selamat Datang di Secz Tools!",
        calculate: "Kalkulator Umur & BMI",
        qrcode: "QR Code Generator",
        password: "Password Generator",
        timer: "Countdown Timer",
        textcase: "Text Case Converter",
        currency: "Currency Converter",
        tips: "Tips & Trik",
        gallery: "Galeri",
        settings: "Pengaturan",
        history: "Riwayat Terakhir",
        bookmarks: "Favorit",
        faq: "Pertanyaan Umum (FAQ)",
        about: "Tentang Kami",
        terms: "Syarat & Ketentuan",
        privacy: "Kebijakan Privasi",
        help: "Bantuan",
        contact: "Hubungi Kami"
    },
    en: {
        welcome: "Welcome to Secz Tools!",
        calculate: "Age & BMI Calculator",
        qrcode: "QR Code Generator",
        password: "Password Generator",
        timer: "Countdown Timer",
        textcase: "Text Case Converter",
        currency: "Currency Converter",
        tips: "Tips & Tricks",
        gallery: "Gallery",
        settings: "Settings",
        history: "Recent History",
        bookmarks: "Bookmarks",
        faq: "Frequently Asked Questions (FAQ)",
        about: "About Us",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        help: "Help",
        contact: "Contact Us"
    }
};

function updateLanguage() {
    const lang = localStorage.getItem('language') || 'id';
    document.getElementById('language').value = lang;
    document.querySelectorAll('[id$=-title]').forEach(el => {
        const key = el.id.replace('-title', '');
        el.innerText = translations[lang][key] || el.innerText;
    });
    document.getElementById('home-title').innerText = translations[lang].welcome;
    document.getElementById('footer-about').innerText = translations[lang].about;
    document.getElementById('footer-services').innerText = translations[lang].terms;
    document.getElementById('footer-contact').innerText = translations[lang].contact;
    document.querySelectorAll('.tool-item, .nav-subbtn').forEach(btn => {
        const tool = btn.dataset.tool;
        btn.innerText = translations[lang][tool] || btn.innerText;
        if (btn.firstChild && btn.firstChild.tagName === 'I') {
            btn.innerText = btn.innerText.replace(btn.firstChild.outerHTML, '');
            btn.prepend(btn.firstChild);
        }
    });
}

function saveSettings() {
    const darkMode = document.getElementById('darkModePref').checked;
    const language = document.getElementById('language').value;
    const themeColor = document.getElementById('themeColor').value;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('language', language);
    document.documentElement.style.setProperty('--theme-color', themeColor);
    localStorage.setItem('themeColor', themeColor);
    updateLanguage();
    document.getElementById('settingsResult').innerText = 'Pengaturan disimpan!';
}

function resetSettings() {
    localStorage.clear();
    document.body.classList.remove('dark-mode');
    document.getElementById('darkModePref').checked = false;
    document.getElementById('themeColor').value = '#007bff';
    document.documentElement.style.setProperty('--theme-color', '#007bff');
    localStorage.setItem('language', 'id');
    document.getElementById('language').value = 'id';
    updateLanguage();
    updateGallery();
    updateHistory();
    document.getElementById('settingsResult').innerText = 'Pengaturan direset!';
}

// Gallery and History
let galleryItems = JSON.parse(localStorage.getItem('gallery') || '[]');
let history = JSON.parse(localStorage.getItem('history') || '{}');

function saveToGallery(type, content) {
    const item = { type, content, timestamp: new Date().toLocaleString() };
    galleryItems.push(item);
    localStorage.setItem('gallery', JSON.stringify(galleryItems));
    updateGallery();
    alert('Item disimpan ke galeri!');
}

function updateGallery() {
    const galleryContent = document.querySelector('#gallery .gallery-content');
    galleryContent.innerHTML = '';
    galleryItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="https://via.placeholder.com/200?text=${encodeURIComponent(item.content)}" alt="${item.type} ${item.timestamp}"><p>${item.content} (${item.timestamp})</p><button onclick="editGallery(${index})">Edit</button><button onclick="deleteGallery(${index})">Hapus</button>`;
        galleryContent.appendChild(div);
    });
}

function editGallery(index) {
    const newContent = prompt('Edit konten:', galleryItems[index].content);
    if (newContent) {
        galleryItems[index].content = newContent;
        localStorage.setItem('gallery', JSON.stringify(galleryItems));
        updateGallery();
    }
}

function deleteGallery(index) {
    if (confirm('Yakin hapus item ini?')) {
        galleryItems.splice(index, 1);
        localStorage.setItem('gallery', JSON.stringify(galleryItems));
        updateGallery();
    }
}

function saveHistory(tool, result) {
    history[tool] = { result, timestamp: new Date().toLocaleString() };
    localStorage.setItem('history', JSON.stringify(history));
    updateHistory();
}

function updateHistory() {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = '';
    const lang = localStorage.getItem('language') || 'id';
    for (let tool in history) {
        const div = document.createElement('div');
        div.innerHTML = `<p><strong>${translations[lang][tool] || tool}:</strong> ${history[tool].result} (${history[tool].timestamp})</p><button onclick="deleteHistory('${tool}')">Hapus</button>`;
        historyContent.appendChild(div);
    }
}

function deleteHistory(tool) {
    if (confirm('Yakin hapus riwayat ini?')) {
        delete history[tool];
        localStorage.setItem('history', JSON.stringify(history));
        updateHistory();
    }
}

// Bookmarks
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

function toggleBookmark(tool) {
    if (!bookmarks.includes(tool)) {
        bookmarks.push(tool);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert('Tool ditambahkan ke favorit!');
    } else {
        bookmarks = bookmarks.filter(b => b !== tool);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert('Tool dihapus dari favorit!');
    }
    showBookmarks();
}

function showBookmarks() {
    const homeContent = document.getElementById('home');
    homeContent.innerHTML = `<h2 id="home-title">${translations[localStorage.getItem('language') || 'id'].welcome}</h2><div class="tool-grid">`;
    bookmarks.forEach(tool => {
        const div = document.createElement('div');
        div.className = 'tool-item';
        div.dataset.tool = tool;
        div.innerHTML = `<i class="fas fa-star"></i> ${translations[localStorage.getItem('language') || 'id'][tool] || tool}`;
        div.addEventListener('click', () => {
            document.getElementById(tool).style.display = 'block';
            setTimeout(() => document.getElementById(tool).classList.add('active'), 10);
        });
        homeContent.querySelector('.tool-grid').appendChild(div);
    });
    homeContent.innerHTML += '<button class="back-btn" onclick="goToDefault()">Lihat Semua Tools</button>';
}

// Tips
let tips = JSON.parse(localStorage.getItem('tips') || '[]');

function addTip() {
    const newTip = document.getElementById('newTip').value.trim();
    if (newTip) {
        tips.push({ text: newTip, timestamp: new Date().toLocaleString() });
        localStorage.setItem('tips', JSON.stringify(tips));
        document.getElementById('newTip').value = '';
        updateTips();
    }
}

function updateTips() {
    const tipsContent = document.querySelector('#tips .tips-content');
    tipsContent.innerHTML = '<h3>Artikel Terbaru</h3>';
    tips.forEach(tip => {
        tipsContent.innerHTML += `<div class="tip-item"><h4>Tips Baru</h4><p>${tip.text} (${tip.timestamp})</p></div>`;
    });
    tipsContent.innerHTML += '<div class="tip-input"><input type="text" id="newTip" placeholder="Tambah Tips"><button onclick="addTip()">Tambah</button></div>';
}

// Like System
let likes = JSON.parse(localStorage.getItem('likes') || '{}');

function toggleLike(tool) {
    likes[tool] = !likes[tool];
    localStorage.setItem('likes', JSON.stringify(likes));
    document.getElementById(`like-${tool}`).innerText = `Like ${likes[tool] ? '✓' : ''} (${Object.values(likes).filter(l => l).length})`;
}

// Loading Functions
function showLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('active');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.remove('active');
}
