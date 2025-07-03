document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    document.querySelectorAll('.tool-item, .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.dataset.tool;
            if (tool) {
                document.querySelectorAll('.tool-content').forEach(content => {
                    content.style.display = 'none';
                    content.classList.remove('active');
                });
                const target = document.getElementById(tool);
                if (target) {
                    target.style.display = 'block';
                    setTimeout(() => target.classList.add('active'), 10);
                }
            }
        });
    });

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Yakin logout?')) {
                localStorage.clear();
                alert('Logout berhasil!');
                document.querySelectorAll('.tool-content').forEach(content => {
                    content.style.display = 'none';
                    content.classList.remove('active');
                });
                document.getElementById('home').style.display = 'block';
                setTimeout(() => document.getElementById('home').classList.add('active'), 10);
            }
        });
    }

    function showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('active');
    }

    function hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('active');
    }

    function generateQR() {
        showLoading();
        const qrInput = document.getElementById('qrInput')?.value.trim();
        const qrError = document.getElementById('qrError');
        const qrCode = document.getElementById('qrCode');
        const downloadQR = document.getElementById('downloadQR');
        if (!qrInput) {
            if (qrError) qrError.innerText = 'Masukkan URL atau teks!';
            hideLoading();
            return;
        }
        if (qrError) qrError.innerText = '';
        if (qrCode) qrCode.innerHTML = '';
        new QRCode(qrCode, {
            text: qrInput,
            width: 200,
            height: 200
        });
        if (downloadQR) {
            downloadQR.style.display = 'block';
            downloadQR.onclick = () => {
                const img = qrCode.getElementsByTagName('img')[0];
                const link = document.createElement('a');
                link.href = img.src;
                link.download = 'qrcode.png';
                link.click();
            };
        }
        hideLoading();
    }

    function generatePassword() {
        showLoading();
        const passLength = parseInt(document.getElementById('passLength')?.value) || 12;
        const passwordResult = document.getElementById('passwordResult');
        if (passLength < 8 || passLength > 20) {
            if (passwordResult) passwordResult.innerText = 'Panjang harus 8-20!';
            hideLoading();
            return;
        }
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < passLength; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (passwordResult) passwordResult.innerText = `Password: ${password}`;
        hideLoading();
    }

    let timerInterval;
    function startTimer() {
        showLoading();
        const hours = parseInt(document.getElementById('hours')?.value) || 0;
        const minutes = parseInt(document.getElementById('minutes')?.value) || 0;
        const seconds = parseInt(document.getElementById('seconds')?.value) || 0;
        const timerError = document.getElementById('timerError');
        const timerDisplay = document.getElementById('timerDisplay');
        if (hours < 0 || minutes > 59 || seconds > 59) {
            if (timerError) timerError.innerText = 'Input tidak valid!';
            hideLoading();
            return;
        }
        if (timerError) timerError.innerText = '';
        clearInterval(timerInterval);
        let remaining = hours * 3600 + minutes * 60 + seconds;
        timerInterval = setInterval(() => {
            if (remaining <= 0) {
                clearInterval(timerInterval);
                if (timerDisplay) timerDisplay.innerText = "Selesai!";
                alert('Timer selesai!');
                return;
            }
            const h = Math.floor(remaining / 3600);
            const m = Math.floor((remaining % 3600) / 60);
            const s = remaining % 60;
            if (timerDisplay) timerDisplay.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            remaining--;
        }, 1000);
        hideLoading();
    }

    function convertText(caseType) {
        showLoading();
        const textInput = document.getElementById('textInput')?.value.trim();
        const textError = document.getElementById('textError');
        const textResult = document.getElementById('textResult');
        if (!textInput) {
            if (textError) textError.innerText = 'Masukkan teks!';
            hideLoading();
            return;
        }
        if (textError) textError.innerText = '';
        let result = '';
        switch (caseType) {
            case 'upper': result = textInput.toUpperCase(); break;
            case 'lower': result = textInput.toLowerCase(); break;
            case 'capitalize':
                result = textInput.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                break;
        }
        if (textResult) textResult.innerText = result;
        hideLoading();
    }

    const exchangeRates = { USD: { IDR: 14500 }, IDR: { USD: 1/14500 } };
    function convertCurrency() {
        showLoading();
        const amount = parseFloat(document.getElementById('amount')?.value) || 0;
        const from = document.getElementById('fromCurrency')?.value;
        const to = document.getElementById('toCurrency')?.value;
        const currencyError = document.getElementById('currencyError');
        const currencyResult = document.getElementById('currencyResult');
        if (amount < 0) {
            if (currencyError) currencyError.innerText = 'Jumlah tidak valid!';
            hideLoading();
            return;
        }
        if (currencyError) currencyError.innerText = '';
        const rate = exchangeRates[from][to] || 1;
        if (currencyResult) currencyResult.innerText = `${amount.toFixed(2)} ${from} = ${(amount * rate).toFixed(2)} ${to}`;
        hideLoading();
    }

    function calculateAge() {
        showLoading();
        const birthdate = document.getElementById('birthdate')?.value;
        const ageError = document.getElementById('ageError');
        const ageResult = document.getElementById('ageResult');
        if (!birthdate) {
            if (ageError) ageError.innerText = 'Pilih tanggal lahir!';
            hideLoading();
            return;
        }
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
        if (ageError) ageError.innerText = '';
        if (ageResult) ageResult.innerText = `Usia: ${age} tahun`;
        hideLoading();
    }

    function calculateBMI() {
        showLoading();
        const weight = parseFloat(document.getElementById('weight')?.value) || 0;
        const height = parseFloat(document.getElementById('height')?.value) || 0;
        const bmiError = document.getElementById('bmiError');
        const bmiResult = document.getElementById('bmiResult');
        if (weight < 1 || height < 10) {
            if (bmiError) bmiError.innerText = 'Input tidak valid!';
            hideLoading();
            return;
        }
        const bmi = weight / ((height / 100) * (height / 100));
        if (bmiError) bmiError.innerText = '';
        if (bmiResult) bmiResult.innerText = `BMI: ${bmi.toFixed(2)}`;
        hideLoading();
    }

    let galleryItems = JSON.parse(localStorage.getItem('gallery') || '[]');
    function saveToGallery(type, content) {
        const item = { type, content, timestamp: new Date().toLocaleString() };
        galleryItems.push(item);
        localStorage.setItem('gallery', JSON.stringify(galleryItems));
        updateGallery();
        alert('Item disimpan ke galeri!');
    }

    function updateGallery() {
        const galleryContent = document.querySelector('#gallery .gallery-content');
        if (galleryContent) {
            galleryContent.innerHTML = '';
            galleryItems.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<p>${item.content} (${item.timestamp})</p><button onclick="deleteGallery(${index})">Hapus</button>`;
                galleryContent.appendChild(div);
            });
        }
    }

    function deleteGallery(index) {
        if (confirm('Yakin hapus item ini?')) {
            galleryItems.splice(index, 1);
            localStorage.setItem('gallery', JSON.stringify(galleryItems));
            updateGallery();
        }
    }

    let history = JSON.parse(localStorage.getItem('history') || '{}');
    function saveHistory(tool, result) {
        history[tool] = { result, timestamp: new Date().toLocaleString() };
        localStorage.setItem('history', JSON.stringify(history));
        updateHistory();
    }

    function updateHistory() {
        const historyContent = document.getElementById('historyContent');
        if (historyContent) {
            historyContent.innerHTML = '';
            for (let tool in history) {
                const div = document.createElement('div');
                div.innerHTML = `<p>${tool}: ${history[tool].result} (${history[tool].timestamp})</p>`;
                historyContent.appendChild(div);
            }
        }
    }

    function saveSettings() {
        const darkMode = document.getElementById('darkModePref')?.checked;
        const language = document.getElementById('language')?.value || 'id';
        if (darkMode !== undefined) {
            document.body.classList.toggle('dark-mode', darkMode);
            localStorage.setItem('darkMode', darkMode);
        }
        localStorage.setItem('language', language);
        // Tambah logika update teks berdasarkan bahasa jika perlu
    }

    // Panggil update awal
    updateGallery();
    updateHistory();
});
