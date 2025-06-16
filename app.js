const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('./utils/swagger');
const { AppDataSource } = require('./config/data.source');
app.use(express.json());


AppDataSource.initialize()
    .then(() => {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
        app.use('/data', require('./routes/data'));
        
        console.log('📦 DB connected');
        app.listen(1111, () => {
            console.log('Server is running on http://localhost:1111');
            console.log('API documentation is available at http://localhost:1111/api-docs');
        });
    })
    .catch((err) => {
        console.error('❌ DB init error:', err);
    });

