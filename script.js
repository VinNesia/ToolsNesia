// Theme Toggle
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
};

// Navigation
document.querySelectorAll('.nav-btn, .nav-subbtn, .tool-item').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
        const target = document.getElementById(button.dataset.tool);
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    });
});

// Contact Icon
document.querySelector('.contact-icon').addEventListener('click', (e) => {
    e.preventDefault();
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

// Age Calculator with Validation
function calculateAge() {
    const birthdate = document.getElementById('birthdate').value;
    const ageError = document.getElementById('ageError');
    if (!birthdate) {
        ageError.innerText = 'Silakan pilih tanggal lahir!';
        document.getElementById('birthdate').focus();
        return;
    }
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    ageError.innerText = '';
    document.getElementById('ageResult').innerText = `Usia Anda: ${age} tahun`;
}

// BMI Calculator with Validation
function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const bmiError = document.getElementById('bmiError');
    if (!weight || !height || weight <= 0 || height <= 0) {
        bmiError.innerText = 'Masukkan berat dan tinggi yang valid (lebih dari 0)!';
        if (!weight) document.getElementById('weight').focus();
        else document.getElementById('height').focus();
        return;
    }
    const bmi = weight / ((height / 100) * (height / 100));
    bmiError.innerText = '';
    document.getElementById('bmiResult').innerText = `BMI Anda: ${bmi.toFixed(2)}`;
}

// QR Code Generator with Download
function generateQR() {
    const qrInput = document.getElementById('qrInput').value;
    const qrSpinner = document.getElementById('qrSpinner');
    const qrError = document.getElementById('qrError');
    const qrContainer = document.getElementById('qrCode');
    const qrSuccess = document.getElementById('qrSuccess');
    const downloadQR = document.getElementById('downloadQR');
    if (!qrInput) {
        qrError.innerText = 'Masukkan teks atau URL!';
        document.getElementById('qrInput').focus();
        return;
    }
    qrError.innerText = '';
    qrSpinner.style.display = 'inline-block';
    if (!qrContainer) {
        qrError.innerText = 'Elemen QRCode tidak ditemukan!';
        qrSpinner.style.display = 'none';
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
}

// Password Generator
function generatePassword() {
    const passSpinner = document.getElementById('passSpinner');
    passSpinner.style.display = 'inline-block';
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('passwordResult').innerText = `Password: ${password}`;
    passSpinner.style.display = 'none';
}

// Countdown Timer with Validation
let timerInterval;
function startTimer() {
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
        return;
    }
    timerError.innerText = '';
    timerSpinner.style.display = 'inline-block';
    clearInterval(timerInterval);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timerSpinner.style.display = 'none';
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "Selesai!";
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
    const text = document.getElementById('textInput').value;
    const textError = document.getElementById('textError');
    const spinnerId = `text${caseType.charAt(0).toUpperCase() + caseType.slice(1)}Spinner`;
    const spinner = document.getElementById(spinnerId);
    if (!text) {
        textError.innerText = 'Masukkan teks terlebih dahulu!';
        document.getElementById('textInput').focus();
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
}

// Currency Converter with Validation
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const currencyError = document.getElementById('currencyError');
    const currencySpinner = document.getElementById('currencySpinner');
    if (amount < 0 || amount > 1000000) {
        currencyError.innerText = 'Masukkan jumlah yang valid (0-1,000,000)!';
        document.getElementById('amount').focus();
        return;
    }
    currencyError.innerText = '';
    currencySpinner.style.display = 'inline-block';
    let rate = (from === 'USD' && to === 'IDR') ? 14500 : (from === 'IDR' && to === 'USD') ? 1/14500 : 1;
    const result = amount * rate;
    document.getElementById('currencyResult').innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    currencySpinner.style.display = 'none';
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
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Silakan cek halaman <a href="#" data-tool="help">Bantuan</a> untuk panduan lengkap!</p>`;
        } else if (message === 'kontak') {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Hubungi kami di <a href="mailto:vin.nesia.id@gmail.com">email</a> atau <a href="https://wa.me/62895354511777" target="_blank">WhatsApp</a>.</p>`;
        } else if (message.includes('penting')) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Ini penting! Hubungi <a href="https://wa.me/62895354511777" target="_blank">WhatsApp</a> atau <a href="mailto:vin.nesia.id@gmail.com">email</a>.</p>`;
        } else {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Maaf, saya tidak mengerti. Ketik 'bantuan' atau 'kontak'.</p>`;
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

// Contact Form with EmailJS and CAPTCHA
document.querySelector('#contact form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const captcha = parseInt(form.captcha.value) || 0;
    if (!name || !email || !message) {
        alert('Semua field harus diisi!');
        return;
    }
    if (captcha !== 4) { // 2 + 2 = 4
        alert('CAPTCHA salah! 2 + 2 = ?');
        form.captcha.focus();
        return;
    }
    console.log('Form data:', { name, email, message });
    emailjs.sendForm('service_zrumu1h', 'template_b3ayww4', form)
        .then((result) => {
            console.log('Email sent:', result);
            alert('Pesan berhasil dikirim!');
            form.reset();
        }, (error) => {
            console.error('Email error:', error);
            alert('Gagal mengirim pesan: ' + (error.text || 'Periksa konsol untuk detail'));
        });
});

// Settings
function saveSettings() {
    const darkModePref = document.getElementById('darkModePref').checked;
    const language = document.getElementById('language').value;
    document.body.classList.toggle('dark-mode', darkModePref);
    localStorage.setItem('darkMode', darkModePref);
    localStorage.setItem('language', language);
    document.getElementById('settingsResult').innerText = 'Pengaturan disimpan!';
}
