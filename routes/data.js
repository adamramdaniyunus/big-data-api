const express = require("express");
const { queue } = require('../jobs/heavyJobs');
const redis = require('../utils/redis');
const multer = require('multer');
const csv = require('csv-parser');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// /**
//  * @swagger
//  * /data/start-heavy-job:
//  *   post:
//  *     summary: Start a heavy job
//  *     description: Start a heavy job that processes data and stores the result in Redis.
//  *     responses:
//  *       200:
//  *         description: Job started successfully.
//  *       500:
//  *         description: Internal server error.
//  *     tags:
//  *       - Data
//  */
// router.post('/start-heavy-job', async (req, res) => {
//     try {
//         const dummyData = Array(1e6).fill(1); // data besar
//         const job = await queue.add("processData", { data: dummyData });
//         res.json({ jobId: job.id });
//     } catch (error) {
//         console.error('Error starting heavy job:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

/**
 * @swagger
 * /data/get-job-result/{jobId}:
 *   get:
 *     summary: Get the result of a heavy job
 *     description: Retrieve the result of a heavy job processed by the worker.
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         description: The ID of the job to retrieve the result for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cached data
 */
router.get('/get-job-result/:jobId', async (req, res) => {
    const jobId = req.params.jobId;
    console.log(`Retrieving result for job ID: ${jobId}`);


    try {
        // Retrieve the result from Redis
        const result = await redis.get(`result:${jobId}`);

        console.log(result);


        if (result === null) {
            return res.status(404).json({ error: 'Job not found or result not available yet.' });
        }

        res.status(200).json({ jobId, result: JSON.parse(result) });
    } catch (error) {
        console.error('Error retrieving job result:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// /**
//  * @swagger
//  * /data/cached:
//  *   get:
//  *     summary: Get large data with Redis caching
//  *     responses:
//  *       200:
//  *         description: Cached data
//  */
// router.get("/cached", async (req, res) => {
//     const cacheKey = "large_data_result";
//     const cached = await redis.get(cacheKey);

//     if (cached) {
//         return res.json({ source: "cache", data: JSON.parse(cached) });
//     }

//     const largeData = Array(100000).fill({ value: "some big value" });
//     await redis.set(cacheKey, JSON.stringify(largeData), 'EX', 600); // 10 menit

//     res.json({ source: "generated", data: largeData });
// });


/**
 * @swagger
 * /data/upload-csv:
 *  post:
 *    tags:
 *      - CSV Jobs
 *    summary: Upload CSV file untuk diproses
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *        description: Job berhasil ditambahkan ke antrean
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: CSV uploaded & job queued
 *                jobId:
 *                  type: string
 *                  example: "15"
 *      '500':
 *        description: Gagal memproses CSV
 */
router.post('/upload-csv', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', req.file.path);
        const content = fs.readFileSync(filePath, 'utf8');

        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            relax_quotes: true,
            relax_column_count: true,
            escape: '\\',
        });

        const job = await queue.add('processCSV', { rows: records });
        res.status(202).json({ message: 'File uploaded and job queued', jobId: job.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

module.exports = router;