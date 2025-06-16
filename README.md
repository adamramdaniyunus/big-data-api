<!DOCTYPE html>
<html lang="en">
<body>

  <h1>📦 Anime Data Processor API</h1>

  <p>
    Proyek ini merupakan REST API yang digunakan untuk mengunggah file CSV berisi data anime, 
    melakukan proses parsing & analisis secara asynchronous menggunakan <strong>BullMQ + Redis</strong>, 
    dan menyimpan hasilnya ke dalam PostgreSQL menggunakan <strong>TypeORM</strong>.
  </p>

  <h2>🚀 Features</h2>
  <ul>
    <li>Upload CSV anime (judul, genre, sinopsis, rating, gambar)</li>
    <li>Proses asinkron menggunakan BullMQ & Redis</li>
    <li>Simpan data ke PostgreSQL</li>
    <li>Statistik total rating, rata-rata, total kata sinopsis, dan genre unik</li>
    <li>Dokumentasi API via Swagger</li>
  </ul>

  <h2>🧑‍💻 Getting Started</h2>

  <h3>1. Clone Repository</h3>
  <pre><code>git clone https://github.com/adamramdaniyunus/big-data-api.git
cd big-data-api</code></pre>

  <h3>2. Install Dependencies</h3>
  <pre><code>npm install</code></pre>

  <h3>3. Setup Redis & PostgreSQL</h3>
  <ul>
    <li>Pastikan Redis sudah berjalan di <code>localhost:6379</code></li>
    <li>Buat database PostgreSQL baru, contoh: <code>big_data_api</code></li>
    <li>Pastikan akses user dan password sesuai</li>
  </ul>

  <h3>4. Konfigurasi .env (jika digunakan)</h3>
  <pre><code>DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=big_data_api
REDIS_URL=redis://localhost:6379</code></pre>

  <p>Atau langsung edit di <code>data.source.js</code>:</p>
  <pre><code>host: 'localhost',
port: 5432,
username: 'postgres',
password: 'yourpassword',
database: 'big_data_api'</code></pre>

  <h3>5. Jalankan Server</h3>
  <pre><code>node index.js</code></pre>

  <p>Server akan berjalan di: <strong>http://localhost:1111</strong></p>

  <h3>6. Buka Dokumentasi API</h3>
  <p>
    📚 Swagger UI: 
    <a href="http://localhost:1111/api-docs" target="_blank">http://localhost:1111/api-docs</a>
  </p>

  <h2>📤 Endpoints</h2>
  <ul>
    <li><strong>POST</strong> <code>/data/upload</code> — Upload file CSV</li>
    <li><strong>GET</strong> <code>/data/progress?jobId=...</code> — Lihat progress dan hasil job</li>
  </ul>

  <h2>🧰 Teknologi yang Digunakan</h2>
  <ul>
    <li>Express.js</li>
    <li>BullMQ</li>
    <li>Redis</li>
    <li>PostgreSQL</li>
    <li>TypeORM</li>
    <li>Swagger UI</li>
  </ul>

  <h2>📄 Lisensi</h2>
  <p>MIT</p>

</body>
</html>
