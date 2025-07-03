// Dark/Light Mode Toggle
document.getElementById('modeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelector('nav').classList.toggle('light-mode');
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.toggle('light-mode'));
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
        document.getElementById(button.dataset.tool).style.display = 'block';
    });
});

// Age Calculator
function calculateAge() {
    const birthdate = new Date(document.getElementById('birthdate').value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) age--;
    document.getElementById('ageResult').innerText = `Usia Anda: ${age} tahun`;
}

// BMI Calculator
function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value / 100; // Convert cm to m
    if (weight && height) {
        const bmi = weight / (height * height);
        document.getElementById('bmiResult').innerText = `BMI Anda: ${bmi.toFixed(2)}`;
    }
}

// QR Code Generator
function generateQR() {
    const qrInput = document.getElementById('qrInput').value;
    if (qrInput) {
        new QRCode(document.getElementById('qrCode'), qrInput);
    }
}

// Password Generator
function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('passwordResult').innerText = `Password: ${password}`;
}

// Countdown Timer
let timerInterval;
function startTimer() {
    clearInterval(timerInterval);
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

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

// Text Case Converter
function convertText(caseType) {
    const text = document.getElementById('textInput').value;
    let result = '';
    switch (caseType) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'capitalize':
            result = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            break;
    }
    document.getElementById('textResult').innerText = result;
}

// Currency Converter (Sederhana, static rate)
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    let rate = (from === 'USD' && to === 'IDR') ? 14500 : (from === 'IDR' && to === 'USD') ? 1/14500 : 1;
    const result = amount * rate;
    document.getElementById('currencyResult').innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
}
