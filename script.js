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
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
        const target = document.getElementById(button.dataset.tool);
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10); // Delay untuk animasi
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
    document.getElementById('default').style.display = 'block';
    setTimeout(() => document.getElementById('default').classList.add('active'), 10);
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

// QR Code Generator with Loading and Reset
function generateQR() {
    const qrInput = document.getElementById('qrInput').value;
    const qrSpinner = document.getElementById('qrSpinner');
    const qrError = document.getElementById('qrError');
    if (!qrInput) {
        qrError.innerText = 'Masukkan teks atau URL!';
        document.getElementById('qrInput').focus();
        return;
    }
    qrError.innerText = '';
    qrSpinner.style.display = 'inline-block';
    document.getElementById('qrCode').innerHTML = '';
    setTimeout(() => {
        new QRCode(document.getElementById('qrCode'), qrInput);
        qrSpinner.style.display = 'none';
    }, 500); // Simulasi delay
}

// Password Generator with Loading
function generatePassword() {
    const passSpinner = document.getElementById('passSpinner');
    passSpinner.style.display = 'inline-block';
    setTimeout(() => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById('passwordResult').innerText = `Password: ${password}`;
        passSpinner.style.display = 'none';
    }, 500); // Simulasi delay
}

// Countdown Timer with Validation
let timerInterval;
function startTimer() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const timerError = document.getElementById('timerError');
    const timerSpinner = document.getElementById('timerSpinner');
    if (hours < 0 || minutes < 0 || seconds < 0) {
        timerError.innerText = 'Masukkan nilai yang valid (tidak negatif)!';
        if (hours < 0) document.getElementById('hours').focus();
        else if (minutes < 0) document.getElementById('minutes').focus();
        else document.getElementById('seconds').focus();
        return;
    }
    timerError.innerText = '';
    timerSpinner.style.display = 'inline-block';
    clearInterval(timerInterval);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimeout(() => {
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
    }, 500); // Simulasi delay
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
    setTimeout(() => {
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
    }, 500); // Simulasi delay
}

// Currency Converter with Validation
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const currencyError = document.getElementById('currencyError');
    const currencySpinner = document.getElementById('currencySpinner');
    if (amount < 0) {
        currencyError.innerText = 'Masukkan jumlah yang valid (tidak negatif)!';
        document.getElementById('amount').focus();
        return;
    }
    currencyError.innerText = '';
    currencySpinner.style.display = 'inline-block';
    setTimeout(() => {
        let rate = (from === 'USD' && to === 'IDR') ? 14500 : (from === 'IDR' && to === 'USD') ? 1/14500 : 1;
        const result = amount * rate;
        document.getElementById('currencyResult').innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
        currencySpinner.style.display = 'none';
    }, 500); // Simulasi delay
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
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Hubungi kami di <a href="mailto:vin.nesia.id@gmail.com">email</a> atau <a href="https://wa.me/62895354511777" target="_blank">WhatsApp</a> untuk bantuan lebih lanjut.</p>`;
        } else if (message.includes('penting')) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Ini tampaknya penting! Silakan hubungi kami di <a href="https://wa.me/62895354511777" target="_blank">WhatsApp</a> atau <a href="mailto:vin.nesia.id@gmail.com">email</a>.</p>`;
        } else {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Maaf, saya tidak mengerti. Ketik "bantuan" atau "kontak" untuk opsi lebih lanjut.</p>`;
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

// Formulir Kontak dengan EmailJS
document.querySelector('#contact form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    emailjs.sendForm('service_zrumu1h', 'template_b3ayww4', form)
        .then((result) => {
            alert('Pesan berhasil dikirim!');
            form.reset();
        }, (error) => {
            alert('Gagal mengirim pesan: ' + error.text);
        });
});
