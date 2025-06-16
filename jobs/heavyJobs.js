const { Queue, Worker } = require('bullmq');
const redis = require('../utils/redis');
const { AppDataSource } = require('../config/data.source');
const animeEntity = require('../entities/anime.entity');
const animeLogEntity = require('../entities/anime_log.entity');

// Create a new queue
const queue = new Queue('heavyJobsQueue', { connection: redis });

function parseRating(ratingStr) {
    if (!ratingStr) return 0;
    return parseFloat(ratingStr.replace(',', '.')) || 0;
}

// Worker untuk memproses job dari heavyJobsQueue
const worker = new Worker(
    'heavyJobsQueue',
    async (job) => {
        try {
            console.log(`📥 Processing job ${job.id}`);
            const rows = job.data.rows;

            console.log(`📊 Total rows received: ${rows.length}`);

            // state data insert
            const animeRepository = AppDataSource.getRepository(animeEntity)
            const animeRepositoryLog = AppDataSource.getRepository(animeLogEntity)
            const insertBuffer = [];
            const chunkSize = 100;

            let totalRating = 0;
            let totalWords = 0;
            let count = 0;
            const genreSet = new Set();

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rating = parseRating(row.Rating);
                totalRating += rating;
                count++;

                if (row.Synopsis) {
                    const words = row.Synopsis.trim().split(/\s+/);
                    totalWords += words.length;
                }

                if (row.Genres) {
                    row.Genres.split(',').map(g => g.trim()).forEach(g => {
                        if (g) genreSet.add(g);
                    });
                }

                // Masukkan ke buffer
                insertBuffer.push({
                    title: row.Title,
                    genres: row.Genres,
                    synopsis: row.Synopsis,
                    rating,
                    image: row.Image,
                });

                // Batch insert per chunk
                if (insertBuffer.length >= chunkSize || i === rows.length - 1) {
                    try {
                        console.log("Inserting new data: ", row);
                        await animeRepository.insert(insertBuffer);

                        console.log(`✅ Success add new data: ${row}`);
                        
                    } catch (err) {
                        console.error(`❌ Failed inserting data for index ${i}:`, err);
                        // simpan insertBuffer ke log error
                        await animeRepositoryLog.insert(insertBuffer);
                    }
                    insertBuffer.length = 0; // Kosongkan buffer
                }

                // Progress per 10%
                if (i % Math.floor(rows.length / 10) === 0) {
                    const percent = Math.floor((i / rows.length) * 100);
                    console.log(`⏳ Progress: ${percent}%`);
                    await job.updateProgress(percent);
                }
            }

            const result = {
                totalRating,
                averageRating: count ? totalRating / count : 0,
                totalWords,
                uniqueGenres: Array.from(genreSet),
            };

            await redis.set(`result:${job.id}`, JSON.stringify(result), 'EX', 600);
            console.log(`✅ Job ${job.id} completed`);
            return result;
        } catch (err) {
            console.error(`❌ Job ${job.id} failed:`, err);
            throw err;
        }
    },
    {
        connection: redis,
    }
);

module.exports = {
    queue,
    worker
}