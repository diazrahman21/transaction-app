# Aplikasi Transaksi Fullstack

Monorepo aplikasi fullstack untuk tes knowledge Widya Robotics.

## Teknologi

- Backend: Node.js, Express.js
- Database: PostgreSQL
- ORM: Prisma
- Autentikasi: JWT
- Hash password: bcrypt
- Frontend: Vue 3, Vite
- Styling: Tailwind CSS
- HTTP client: Axios
- Pengujian: Jest, Supertest

## Struktur Proyek

```text
fullstack-transaction-app/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Kebutuhan

- Node.js 18 atau lebih baru
- npm 9 atau lebih baru
- PostgreSQL 16 atau lebih baru

## Persiapan Awal

1. Install dependency dari root project:

```bash
npm install
```

2. Salin file environment backend:

```bash
copy backend\.env.example backend\.env
```

3. Salin file environment frontend jika tersedia:

```bash
copy frontend\.env.example frontend\.env
```

4. Pastikan PostgreSQL lokal sudah aktif dan database `transaction-app` sudah dibuat.

Contoh URL koneksi:

```bash
postgresql://postgres:password_anda@localhost:5432/transaction-app?schema=public
```

## Migrasi Database dan Seed

Jalankan migrasi Prisma dari backend:

```bash
npm run prisma:migrate --workspace backend
```

Jalankan seed untuk membuat user admin default:

```bash
npm run seed --workspace backend
```

Login default:

- Username: `admin`
- Password: `admin123`

## Menjalankan Backend

```bash
npm run dev:backend
```

Backend berjalan di `http://localhost:3000`.

## Menjalankan Frontend

```bash
npm run dev:frontend
```

Frontend berjalan di `http://localhost:5173`.

## Endpoint API

### Autentikasi

- `POST /api/auth/login`

### Transaksi

- `GET /api/transactions?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Catatan Request

- Semua route transaksi wajib memakai `Authorization: Bearer <token>`.
- `kode` dibuat otomatis oleh backend dengan format `T-${randomUniqueString}`.
- `unitPrice` ditentukan dari `productType` dan divalidasi oleh backend.
- `totalPrice` dihitung dari `unitPrice × quantity`.

## Pengujian Otomatis

Jalankan unit test backend:

```bash
npm test --workspace backend
```

Saat ini coverage otomatis fokus pada utilitas transaksi dan validasi payload.

## Informasi Tambahan

- Token JWT disimpan di `localStorage` oleh frontend.
- Halaman transaksi dilindungi route guard.
- Axios interceptor menambahkan token JWT secara otomatis.
- Aplikasi memakai toast dan dialog konfirmasi kustom untuk feedback CRUD.
- Prisma memetakan tabel database ke `users` dan `transactions`.

## Troubleshooting

Jika frontend menampilkan error `ERR_CONNECTION_REFUSED`, pastikan backend sudah aktif di port 3000.

Jika migrasi atau seed gagal dengan error autentikasi PostgreSQL, cek kembali isi `DATABASE_URL` di `backend\.env` dan pastikan username serta password sudah benar.
