# Gacha Frontend (Vue 3 + Vite)

Frontend untuk Sistem Gacha Event, dibangun menggunakan Vue 3, Vite, dan Vue Router.
Desain menggunakan standar web modern (Light Theme) dengan palet warna premium, tipografi Inter, ikonografi dari Lucide, serta 100% responsif di perangkat mobile.

## Persyaratan
- Node.js (v18+)
- npm / yarn

## Panduan Instalasi (Setup Frontend)

Buka terminal dan arahkan ke folder `gacha-frontend`:
```bash
cd gacha-frontend
npm install
npm run dev
```
*(Frontend akan berjalan di `http://localhost:5173`)*

## Fitur Unggulan UI/UX
- **Fully Mobile Responsive**: Semua elemen dari *Landing Page*, *Dashboard*, hingga *Admin Panel* telah dioptimasi untuk layar sentuh, menggunakan navigasi menu *Hamburger* (Hide/Show), tata letak *grid* adaptif, dan pergeseran tabel horizontal (*overflow-x: auto*).
- **Animasi Gacha Interaktif**: Terdapat animasi spesial (*Shuffle Text*, *Pulse/Glow effect*, & efek cahaya *Shine*) saat user melakukan "Roll Gacha", membangun ketegangan (*suspense*) sebelum hadiah akhir ditampilkan dalam *modal box* yang elegan.
- **Dynamic Dashboard (Role-Based)**: 
  - **User Biasa**: Menampilkan sisa koin, menu roll event, dan riwayat gacha personal.
  - **Admin**: Menyembunyikan form roll gacha & sisa koin, serta langsung menampilkan *Global History* dari semua user secara ringkas pada tabel aktivitas terbaru.
- **Admin Panel (Advanced)**: Mengelola event & item dengan fitur **Inline Edit**, indikator Total Drop Rate (peringatan warna), **Toggle Status**, serta visualisasi grafik aktivitas gacha mingguan menggunakan *Chart.js*.
- **Desain Premium & Ringan**: Navigasi *Seamless* tanpa reload (*Vue Router*), transisi *hover* yang mulus, dan *feedback error/loading state* yang jelas (termasuk ikon berputar pada tombol).

## Koneksi API & Konfigurasi
Aplikasi ini sudah diprogram untuk melakukan *request* ke: `http://localhost:8000/api` menggunakan library `axios`.
Token autentikasi (JWT) disimpan dengan aman pada `localStorage` browser dan secara otomatis disematkan pada setiap request *Header*. Pastikan Backend Laravel Anda telah menyala pada alamat tersebut agar semua fungsionalitas berjalan normal.
