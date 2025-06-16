input_path = 'anime_data.csv'
output_path = 'anime_data_cleaned.csv'

# Baca file sebagai teks
with open(input_path, 'r', encoding='utf-8', errors='ignore') as file:
    raw_text = file.read()

# Hapus newline di dalam kutipan
cleaned_text = ''
inside_quotes = False

for char in raw_text:
    if char == '"':
        inside_quotes = not inside_quotes
    if inside_quotes and char == '\n':
        cleaned_text += ' '
    else:
        cleaned_text += char

# Tulis hasilnya ke file baru
with open(output_path, 'w', encoding='utf-8') as file:
    file.write(cleaned_text)

print("File berhasil dibersihkan dan disimpan sebagai:", output_path)
