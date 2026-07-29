# Xolvon Project

Xolvon Project adalah aplikasi Point of Sales (POS) modern berbasis web yang dibangun dengan React (Vite) untuk frontend dan Flask (Python) untuk backend, menggunakan Supabase sebagai database.

## Teknologi Utama

- **Frontend**: React, Vite, Tailwind CSS v3, Zustand (State Management)
- **Backend**: Python, Flask, Supabase Python SDK.
- **Database**: Supabase (PostgreSQL).

## Struktur Direktori

Proyek ini dibagi menjadi dua bagian utama:
- `/frontend`: Berisi seluruh kode antarmuka pengguna (UI).
- `/backend`: Berisi API server yang menghubungkan frontend dengan database Supabase.

## Cara Menjalankan Aplikasi Lokal

Pastikan Anda memiliki Node.js dan Python terinstal di komputer Anda.

### 1. Menjalankan Backend (Flask)

1. Buka terminal baru dan masuk ke folder `backend`.
   ```bash
   cd backend
   ```
2. Aktifkan virtual environment (jika belum aktif).
   ```bash
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependensi (jika baru pertama kali).
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server Flask.
   ```bash
   python main.py
   ```
   Backend akan berjalan di `http://127.0.0.1:5000`.

### 2. Menjalankan Frontend (React + Vite)

1. Buka terminal baru dan masuk ke folder `frontend`.
   ```bash
   cd frontend
   ```
2. Install dependensi (jika baru pertama kali).
   ```bash
   npm install
   ```
3. Jalankan development server.
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`.

---
*Dibuat untuk Xolvon Project.*
