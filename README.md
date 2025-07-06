# Vin Nesia - Direktori Alat AI

Vin Nesia adalah direktori alat AI berbasis static site yang cepat, responsif, dan SEO-friendly. Situs ini dibangun tanpa backend, menggunakan HTML, CSS, dan JavaScript, serta data dari `tools.json`.

## Fitur
- **Filter Kategori**: Pilih kategori alat AI melalui dropdown.
- **Pencarian**: Cari alat berdasarkan nama atau deskripsi tanpa reload.
- **Dark Mode**: Toggle antara mode terang/gelap, disimpan di LocalStorage.
- **Bookmark**: Simpan alat favorit ke LocalStorage dengan tombol bookmark.
- **Halaman Favorit**: Lihat daftar alat yang telah dibookmark.
- **Pagination**: Tampilkan 9 alat per halaman dengan tombol Prev/Next.
- **Responsif**: Desain mobile-friendly untuk HP dan desktop.
- **SEO-Friendly**: Meta tag dan title dioptimalkan.
- **GitHub Pages**: Siap di-deploy ke GitHub Pages.

## Cara Menjalankan
1. Clone repository ini: `git clone <repo-url>`.
2. Buka `index.html` di browser atau deploy ke GitHub Pages.
3. Tambahkan data alat AI ke `tools.json` dengan format:
   ```json
   {
       "id": "unique-id",
       "name": "Nama Alat",
       "description": "Deskripsi alat",
       "category": "Kategori",
       "url": "https://example.com"
   }
