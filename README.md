# Capstone-Smaily

Repository team Smaily sebagai tempat untuk menampung code backend untuk Capstone Project di Bangkit Academy 2022

## CARA PAKAI (localhost):
1. Bikin database dulu di PostgreSQL yang namanya "testdb"
   - Install postgreSQL
   - Buka pSQL (PostgreSQL Shell)
   - Masukkan perintah berikut: ```CREATE DATABASE testdb```
2. Install package yang dubutuhkan pakai NPM
   - Install NodeJS
   - Buka folder tempat Anda menaruh code ini
   - Buka terminal Linux / cmd Windows di lokasi folder
   - Masukkan perintah ```npm init --y```
   - Install package yang dibutuhkan dengan perintah berikut: ```npm install package-name1 package-name2 package-nameN```
3. Jalankan node server.js
   - Ganti listening port terlebih dahulu (bila listening port di code sedang dipakai)
   - Masukkan perintah ```node server.js``` di terminal yang telah dibuka tadi
4. Tes API pakai Postman
   - Masukkan alamat yang ada di folder routes.js pada kolom address yang dituju
   - Tentukan HTTP Method sesuai dengan API yang ingin diuji
   - Masukkan variabel / parameter sesuai dengan API yang ingin diuji
   - Klik tombol Send untuk mengirim request ke API
   - Respons akan dikirim sesuai API yang diuji

## CARA PAKAI (online):
1. Tes API pakai Postman
   - Masukkan alamat yang ada di folder routes.js pada kolom address yang dituju
   - Tentukan HTTP Method sesuai dengan API yang ingin diuji
   - Masukkan variabel / parameter sesuai dengan API yang ingin diuji
   - Klik tombol Send untuk mengirim request ke API
   - Respons akan dikirim sesuai API yang diuji
2. (Opsional) Sambung langsung melalui pSQL ke server (untuk verifikasi, query, dll)
   - Install PostgreSQL
   - Buka pSQL (PostgreSQL Shell)
   - Masukkan konfigurasi koneksi seperti yang tertera pada file db.config.js
      -![Konfigurasi Koneksi](https://user-images.githubusercontent.com/69382273/172047643-8b0c76d9-d1a1-4694-8d6e-e94abe046dd7.png)


###### **YANG SUDAH:**
- [x] Login
- [x] Register
- [x] CRUD
- [x] Logout
- [x] Search
- [x] JWT
- [x] Hash Password
- [x] Pagination
- [x] Ordering
- [x] Insert Admin user
- [x] Input Validation
- [x] Profile
- [x] Role-based Authorization
- [x] Autentikasi token
- [x] Menyambungkan akun orangtua ke akun anak
- [x] Get & Set kunci untuk aplikasi dan URL pada perangkat anak

###### **YANG BELOM:**
- [ ] API untuk sambungin ke model ML (?)
- [ ] API untuk GCP (?)
- [ ] Dokumentasi API
- [ ] dll
