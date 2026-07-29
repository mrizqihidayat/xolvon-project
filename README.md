# Xolvon Project

Xolvon Project adalah aplikasi Point of Sales (POS) modern berbasis web yang dirancang untuk memudahkan manajemen produk dan transaksi kasir. Aplikasi ini dibangun dengan memisahkan bagian antarmuka pengguna (Frontend) dan logika server (Backend) untuk skalabilitas yang lebih baik.

## Teknologi Utama

- **Frontend**: React, Vite, Tailwind CSS v3, Zustand (State Management), Axios, Lucide React (Icons).
- **Backend**: Python, Flask, Flask-Cors, Supabase Python SDK.
- **Database**: Supabase (PostgreSQL).

## Cara Menyiapkan Database dan Environment Variables

### 1. Database (Supabase)
Proyek ini menggunakan Supabase sebagai Database-as-a-Service. Anda harus memiliki akun Supabase dan membuat project baru.
- Buat tabel `products` (id, name, price, stock, category, image_url, is_active, created_at).
- Buat tabel `transactions` (id, total_amount, payment_method, created_at).
- Buat tabel `transaction_items` (id, transaction_id, product_id, quantity, price_at_time).

### 2. Environment Variables
Buat file `.env` di masing-masing folder (Backend dan Frontend):

**Di folder `backend/.env`:**
```env
SUPABASE_URL=https://ykxxkhaweqhnbaoxujyt.supabase.co
SUPABASE_KEY=sb_publishable_dnnLy6MXfQyocvfWpGHwPg_bBT7QHHq
```

**Di folder `frontend/.env`:**
```env
VITE_API_URL=http://127.0.0.1:5000/api/v1
```

## Cara Instalasi dan Menjalankan Aplikasi

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
3. Install dependensi.
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
2. Install dependensi.
   ```bash
   npm install
   ```
3. Jalankan development server.
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`.

## Link Deployment

- **Frontend**: https://xolvon-project-b9za.vercel.app/
- **Backend**: https://xolvon-project-snowy.vercel.app/

---
*Dibuat untuk Xolvon Project.*
