# Gacha Frontend (Vue 3 + Vite)

Frontend untuk Sistem Gacha Event, dibangun menggunakan Vue 3, Vite, dan Vue Router.
Desain menggunakan standar SaaS Modern (Light Theme) dengan palet warna premium, tipografi Inter, dan ikonografi Lucide.

## Persyaratan
- Node.js
- npm / yarn

## Panduan Instalasi (Setup Frontend)

Buka terminal dan arahkan ke folder `gacha-frontend`:
```bash
cd gacha-frontend
npm install
npm run dev
```
*(Frontend akan berjalan di `http://localhost:5173`)*

## Fitur UI
- **Landing Page**: Beranda dengan gamifikasi (*copywriting* fokus pada game/koleksi) dan animasi yang interaktif.
- **Autentikasi**: Halaman Login & Register (*clean design*).
- **Dashboard User**: Menampilkan profil, sisa koin, menu pilihan event gacha, sistem roll, dan riwayat (*paginated*).
- **Admin Panel**: Mengelola event & item dengan fitur **Inline Edit**, indikator Total Drop Rate (peringatan warna), **Toggle Status**, dan visualisasi data (*Chart.js*).
- **Desain Premium**: Pendekatan UI/UX *user-friendly*, notifikasi visual, transisi mulus (*hover states*), dan pagination responsif.

## Koneksi API
Aplikasi akan secara otomatis terhubung ke `http://localhost:8000/api` menggunakan library `axios`.
Pastikan Backend Laravel Anda telah berjalan di URL tersebut.
