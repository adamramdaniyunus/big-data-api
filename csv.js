const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'anime_data.csv');
const outputPath = path.join(__dirname, 'anime_data_no_enters.csv');

// Baca isi file
const raw = fs.readFileSync(inputPath, 'utf-8');

// Gabung semua baris, tapi tetap pertahankan struktur baris CSV
const lines = raw.split('\n');

const cleanedLines = lines.map(line => {
  // Hilangkan enter dalam kutipan (misalnya di kolom sinopsis)
  const cleaned = line.replace(/"([^"]*)"/g, (match, group1) => {
    const noNewlines = group1.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    return `"${noNewlines}"`;
  });
  return cleaned;
});

fs.writeFileSync(outputPath, cleanedLines.join('\n'), 'utf-8');

console.log(`✅ Semua enter di dalam kutipan dihapus. Hasil: ${outputPath}`);
