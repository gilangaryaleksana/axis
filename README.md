# Chatbot Backend (Express.js + TypeScript + Prisma) — TERPISAH dari Frontend

Backend murni REST API, tidak ada kode UI sama sekali. Struktur MVC:
`routes/` → `controllers/` → Prisma (database).

```
src/
  config/         # koneksi Prisma & strategi Passport (Google/GitHub OAuth)
  controllers/    # logic bisnis tiap fitur
  routes/         # pemetaan URL ke controller
  middlewares/    # auth guard (JWT) & error handler
  utils/          # JWT helper, asyncHandler, AppError
  app.ts          # setup Express (middleware + mount routes)
  server.ts       # entry point, jalankan server
prisma/
  schema.prisma   # sinkron 1:1 dengan database MySQL yang sudah dibuat
  seed.ts         # isi 4 persona awal
```

## 1. Install dependency

```bash
npm install
```

## 2. Setup environment

Copy `.env.example` jadi `.env`, isi:

- `DATABASE_URL` — connection string MySQL kamu
- `JWT_SECRET` — generate pakai `openssl rand -base64 32`
- `FRONTEND_URL` — URL project frontend kamu (untuk CORS & redirect OAuth)
- Kredensial Google & GitHub OAuth (client ID/secret + callback URL)

## 3. Migrasi database & seed persona

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

## 4. Jalankan server (mode development)

```bash
npm run dev
```

Server jalan di `http://localhost:5000`. Cek health check di `GET /`.

## Alur Login (OAuth)

1. Frontend arahkan user ke `GET http://localhost:5000/api/auth/google`
   (atau `/api/auth/github`).
2. Setelah user setuju di Google/GitHub, backend redirect balik ke:
   `FRONTEND_URL/auth/callback?token=<JWT>`
3. Frontend ambil `token` dari query string, simpan (misal di localStorage),
   lalu kirim di setiap request API sebagai header:
   `Authorization: Bearer <token>`

## Daftar Endpoint

| Method | Endpoint                          | Keterangan                              | Auth  |
|--------|------------------------------------|-------------------------------------------|-------|
| GET    | `/api/auth/google`                | Mulai login Google                        | -     |
| GET    | `/api/auth/github`                | Mulai login GitHub                        | -     |
| GET    | `/api/auth/me`                    | Profil user yang login                    | user  |
| POST   | `/api/auth/logout`                | Logout                                    | user  |
| PATCH  | `/api/user/persona`               | Pilih role: tentara/polisi/dokter/guru    | user  |
| GET    | `/api/personas`                   | Daftar persona untuk dipilih saat chat    | user  |
| POST   | `/api/personas`                   | Tambah persona baru                       | admin |
| PATCH  | `/api/personas/:id`               | Update persona                            | admin |
| DELETE | `/api/personas/:id`               | Nonaktifkan persona                       | admin |
| POST   | `/api/conversations`              | Mulai percakapan baru                     | user  |
| GET    | `/api/conversations`              | Riwayat percakapan                        | user  |
| GET    | `/api/conversations/:id`          | Lanjutkan percakapan lama                 | user  |
| PATCH  | `/api/conversations/:id`          | Ganti judul percakapan                    | user  |
| DELETE | `/api/conversations/:id`          | Hapus percakapan                          | user  |
| GET    | `/api/conversations/:id/messages` | Ambil semua pesan                         | user  |
| POST   | `/api/conversations/:id/messages` | Kirim pesan & terima respons bot          | user  |
| GET    | `/api/admin/users`                | Lihat semua user                          | admin |
| GET    | `/api/admin/personas`             | Lihat semua persona (termasuk nonaktif)   | admin |

## Catatan integrasi AI

Fungsi `generateBotReply()` di `src/controllers/message.controller.ts`
masih placeholder. Ganti dengan pemanggilan API model (Anthropic/OpenAI)
sesuai `persona.systemPrompt` supaya bot benar-benar membalas sesuai
karakter (tentara/polisi/dokter/guru). Contoh kodenya sudah ada di
komentar di atas fungsi tersebut.

## Kalau ada error

Karena strukturnya sudah terpisah rapi:
- Error soal routing/URL → cek folder `src/routes/`
- Error soal logic (nggak ketemu data, dsb) → cek folder `src/controllers/`
- Error soal auth/token → cek `src/middlewares/auth.middleware.ts`
- Error soal database/kolom → cek `prisma/schema.prisma`
