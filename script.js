document.addEventListener('DOMContentLoaded', () => {
    const toolsList = document.getElementById('toolsList');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeToggle = document.getElementById('themeToggle');
    const favoritesBtn = document.getElementById('favoritesBtn');

    let tools = [];
    let filteredTools = [];
    let currentPage = 1;
    const toolsPerPage = 9;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Load tools from tools.json
    fetch('tools.json')
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat tools.json');
            return response.json();
        })
        .then(data => {
            tools = data;
            filteredTools = tools;
            if (tools.length === 0) {
                toolsList.innerHTML = '<p class="no-results">Tidak ada alat AI yang tersedia.</p>';
                return;
            }
            populateCategories();
            renderTools();
        })
        .catch(error => {
            toolsList.innerHTML = '<p class="no-results">Error: Gagal memuat data alat AI.</p>';
            console.error(error);
        });

    // Populate category dropdown
    function populateCategories() {
        const categories = [...new Set(tools.map(tool => tool.category))];
        if (categories.length === 0) {
            categoryFilter.innerHTML = '<option value="all">Tidak ada kategori</option>';
            return;
        }
        categories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Render tools
    function renderTools() {
        toolsList.innerHTML = '';
        if (filteredTools.length === 0) {
            toolsList.innerHTML = '<p class="no-results">Tidak ada alat ditemukan.</p>';
            updatePagination();
            return;
        }

        const start = (currentPage - 1) * toolsPerPage;
        const end = start + toolsPerPage;
        const paginatedTools = filteredTools.slice(start, end);

        paginatedTools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.classList.add('tool-card');
            toolCard.innerHTML = `
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                <a href="${tool.url}" target="_blank" rel="noopener">Kunjungi</a>
                <button class="bookmark-btn" data-id="${tool.id}">${favorites.includes(tool.id) ? '★' : '☆'}</button>
            `;
            toolsList.appendChild(toolCard);
        });

        updatePagination();
    }

    // Update pagination buttons
    function updatePagination() {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * toolsPerPage >= filteredTools.length;
    }

    // Filter and search
    function applyFilters() {
        const category = categoryFilter.value;
        const search = searchInput.value.toLowerCase().trim();

        filteredTools = tools.filter(tool => {
            const matchesCategory = category === 'all' || tool.category === category;
            const matchesSearch = tool.name.toLowerCase().includes(search) || tool.description.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });

        currentPage = 1;
        renderTools();
    }

    // Event listeners
    categoryFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTools();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentPage * toolsPerPage < filteredTools.length) {
            currentPage++;
            renderTools();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Dark mode toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
    }

    // Bookmark functionality
    toolsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('bookmark-btn')) {
            const id = e.target.dataset.id;
            if (favorites.includes(id)) {
                favorites = favorites.filter(fav => fav !== id);
                e.target.textContent = '☆';
            } else {
                favorites.push(id);
                e.target.textContent = '★';
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    });

    // Show favorites
    favoritesBtn.addEventListener('click', () => {
        filteredTools = tools.filter(tool => favorites.includes(tool.id));
        if (filteredTools.length === 0) {
            toolsList.innerHTML = '<p class="no-results">Belum ada alat favorit.</p>';
        }
        currentPage = 1;
        renderTools();
    });
});
