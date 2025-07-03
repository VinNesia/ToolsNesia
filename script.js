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

// Load Saved Theme
window.onload = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateLanguage();
    generateCaptcha();
};

// Navigation
document.querySelectorAll('.nav-btn, .nav-subbtn, .tool-item').forEach(button => {
    button.addEventListener('click', () => {
        logUsage(button.dataset.tool);
        document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
        const target = document.getElementById(button.dataset.tool);
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
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

// Age Calculator with Validation
function calculateAge() {
    document.getElementById('loading').style.display = 'block';
    const birthdate = document.getElementById('birthdate').value;
    const ageError = document.getElementById('ageError');
    if (!birthdate) {
        ageError.innerText = 'Silakan pilih tanggal lahir!';
        document.getElementById('birthdate').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    ageError.innerText = '';
    document.getElementById('ageResult').innerText = `Usia Anda: ${age} tahun`;
    document.getElementById('loading').style.display = 'none';
}

// BMI Calculator with Validation
function calculateBMI() {
    document.getElementById('loading').style.display = 'block';
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const bmiError = document.getElementById('bmiError');
    if (!weight || !height || weight <= 0 || height <= 0) {
        bmiError.innerText = 'Masukkan berat dan tinggi yang valid (lebih dari 0)!';
        if (!weight) document.getElementById('weight').focus();
        else document.getElementById('height').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    const bmi = weight / ((height / 100) * (height / 100));
    bmiError.innerText = '';
    document.getElementById('bmiResult').innerText = `BMI Anda: ${bmi.toFixed(2)}`;
    document.getElementById('loading').style.display = 'none';
}

// QR Code Generator with Download
function generateQR() {
    document.getElementById('loading').style.display = 'block';
    const qrInput = document.getElementById('qrInput').value;
    const qrSpinner = document.getElementById('qrSpinner');
    const qrError = document.getElementById('qrError');
    const qrContainer = document.getElementById('qrCode');
    const qrSuccess = document.getElementById('qrSuccess');
    const downloadQR = document.getElementById('downloadQR');
    if (!qrInput) {
        qrError.innerText = 'Masukkan teks atau URL!';
        document.getElementById('qrInput').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    qrError.innerText = '';
    qrSpinner.style.display = 'inline-block';
    if (!qrContainer) {
        qrError.innerText = 'Elemen QRCode tidak ditemukan!';
        qrSpinner.style.display = 'none';
        document.getElementById('loading').style.display = 'none';
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
    document.getElementById('loading').style.display = 'none';
}

// Password Generator
function generatePassword() {
    document.getElementById('loading').style.display = 'block';
    const passSpinner = document.getElementById('passSpinner');
    passSpinner.style.display = 'inline-block';
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('passwordResult').innerText = `Password: ${password}`;
    passSpinner.style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

// Countdown Timer with Notification
let timerInterval;
function startTimer() {
    document.getElementById('loading').style.display = 'block';
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const timerError = document.getElementById('timerError');
    const timerSpinner = document.getElementById('timerSpinner');
    if (hours < 0 || minutes < 0 || seconds < 0 || hours > 99 || minutes > 59 || seconds > 59) {
        timerError.innerText = 'Masukkan nilai yang valid (0-99 jam, 0-59 menit/detik)!';
        if (hours < 0 || hours > 99) document.getElementById('hours').focus();
        else if (minutes < 0 || minutes > 59) document.getElementById('minutes').focus();
        else document.getElementById('seconds').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    timerError.innerText = '';
    timerSpinner.style.display = 'inline-block';
    clearInterval(timerInterval);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timerSpinner.style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "Selesai!";
            alert('Timer selesai!');
            return;
        }
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        document.getElementById('timerDisplay').innerText = `${h}:${m}:${s}`;
        totalSeconds--;
    }, 1000);
}

// Text Case Converter with Validation
function convertText(caseType) {
    document.getElementById('loading').style.display = 'block';
    const text = document.getElementById('textInput').value;
    const textError = document.getElementById('textError');
    const spinnerId = `text${caseType.charAt(0).toUpperCase() + caseType.slice(1)}Spinner`;
    const spinner = document.getElementById(spinnerId);
    if (!text) {
        textError.innerText = 'Masukkan teks terlebih dahulu!';
        document.getElementById('textInput').focus();
        document.getElementById('loading').style.display = 'none';
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
    spinner.style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

// Currency Converter with Static Rates
const exchangeRates = {
    USD: { IDR: 14500 },
    IDR: { USD: 1/14500 }
};

function convertCurrency() {
    document.getElementById('loading').style.display = 'block';
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const currencyError = document.getElementById('currencyError');
    const currencySpinner = document.getElementById('currencySpinner');
    if (amount < 0 || amount > 1000000) {
        currencyError.innerText = 'Masukkan jumlah yang valid (0-1,000,000)!';
        document.getElementById('amount').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    currencyError.innerText = '';
    currencySpinner.style.display = 'inline-block';
    const rate = exchangeRates[from][to] || 1;
    const result = amount * rate;
    document.getElementById('currencyResult').innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    currencySpinner.style.display = 'none';
    document.getElementById('loading').style.display = 'none';
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
    document.getElementById('loading').style.display = 'block';
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const captchaInput = parseInt(document.getElementById('captchaInput').value) || 0;
    if (!name || !email || !message) {
        alert('Semua field harus diisi!');
        document.getElementById('loading').style.display = 'none';
        return;
    }
    if (captchaInput !== captchaAnswer) {
        alert('CAPTCHA salah!');
        document.getElementById('captchaInput').focus();
        document.getElementById('loading').style.display = 'none';
        return;
    }
    console.log('Form data:', { name, email, message });
    alert('Pesan berhasil dikirim! (Simulasi, email tidak terkirim karena tanpa API)');
    form.reset();
    generateCaptcha();
    document.getElementById('loading').style.display = 'none';
});

// Settings
const translations = {
    id: {
        welcome: "Selamat Datang di Secz Tools!",
        calculate: "Hitung",
        qrcode: "QR Code Generator",
        password: "Password Generator",
        timer: "Countdown Timer",
        textcase: "Text Case Converter",
        currency: "Currency Converter",
        tips: "Tips & Trik",
        gallery: "Galeri",
        settings: "Pengaturan",
        faq: "Pertanyaan Umum (FAQ)",
        about: "Tentang Kami",
        terms: "Syarat & Ketentuan",
        privacy: "Kebijakan Privasi",
        help: "Bantuan",
        contact: "Hubungi Kami",
        footerAbout: "Tentang Kami",
        footerServices: "Layanan",
        footerContact: "Kontak"
    },
    en: {
        welcome: "Welcome to Secz Tools!",
        calculate: "Calculate",
        qrcode: "QR Code Generator",
        password: "Password Generator",
        timer: "Countdown Timer",
        textcase: "Text Case Converter",
        currency: "Currency Converter",
        tips: "Tips & Tricks",
        gallery: "Gallery",
        settings: "Settings",
        faq: "Frequently Asked Questions (FAQ)",
        about: "About Us",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        help: "Help",
        contact: "Contact Us",
        footerAbout: "About Us",
        footerServices: "Services",
        footerContact: "Contact"
    }
};

function updateLanguage() {
    const lang = localStorage.getItem('language') || 'id';
    document.getElementById('home-title').innerText = translations[lang].welcome;
    document.getElementById('age-bmi-title').innerText = translations[lang].calculate;
    document.getElementById('calc-age-btn').innerText = translations[lang].calculate;
    document.getElementById('calc-bmi-btn').innerText = translations[lang].calculate;
    document.getElementById('qrcode-title').innerText = translations[lang].qrcode;
    document.getElementById('gen-qr-btn').innerText = translations[lang].qrcode.split(' ')[0];
    document.getElementById('password-title').innerText = translations[lang].password;
    document.getElementById('gen-pass-btn').innerText = translations[lang].password.split(' ')[0];
    document.getElementById('timer-title').innerText = translations[lang].timer;
    document.getElementById('start-timer-btn').innerText = translations[lang].timer.split(' ')[0];
    document.getElementById('textcase-title').innerText = translations[lang].textcase;
    document.getElementById('upper-btn').innerText = translations[lang].textcase.split(' ')[0] + " Upper";
    document.getElementById('lower-btn').innerText = translations[lang].textcase.split(' ')[0] + " Lower";
    document.getElementById('capital-btn').innerText = translations[lang].textcase.split(' ')[0] + " Capital";
    document.getElementById('currency-title').innerText = translations[lang].currency;
    document.getElementById('convert-currency-btn').innerText = translations[lang].currency.split(' ')[0];
    document.getElementById('tips-title').innerText = translations[lang].tips;
    document.getElementById('gallery-title').innerText = translations[lang].gallery;
    document.getElementById('settings-title').innerText = translations[lang].settings;
    document.getElementById('save-settings-btn').innerText = translations[lang].settings.split(' ')[0];
    document.getElementById('faq-title').innerText = translations[lang].faq;
    document.getElementById('about-title').innerText = translations[lang].about;
    document.getElementById('terms-title').innerText = translations[lang].terms;
    document.getElementById('privacy-title').innerText = translations[lang].privacy;
    document.getElementById('help-title').innerText = translations[lang].help;
    document.getElementById('contact-title').innerText = translations[lang].contact;
    document.getElementById('footer-about').innerText = translations[lang].footerAbout;
    document.getElementById('footer-services').innerText = translations[lang].footerServices;
    document.getElementById('footer-contact').innerText = translations[lang].footerContact;
}

function saveSettings() {
    const darkModePref = document.getElementById('darkModePref').checked;
    const language = document.getElementById('language').value;
    document.body.classList.toggle('dark-mode', darkModePref);
    localStorage.setItem('darkMode', darkModePref);
    localStorage.setItem('language', language);
    updateLanguage();
    document.getElementById('settingsResult').innerText = 'Pengaturan disimpan!';
}

// Share Button (Browser Support)
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Fitur share tidak didukung di browser ini.');
    }
}
