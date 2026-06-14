const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const catererRoutes = require('./routes/catererRoutes');

dotenv.config();
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Bind both paths to handle local execution and stripped Vercel paths
app.use('/api/caterers', catererRoutes);
app.use('/caterers', catererRoutes);

// Configure structural fallback targets for system health metrics
app.get('/api/health', (req, res) => res.status(200).json({ status: "OK" }));
app.get('/health', (req, res) => res.status(200).json({ status: "OK" }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "A critical routing server exception occurred down the main application line." });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server executing successfully. JSON Data Engine active on Local Port: ${PORT}`);
    });
}

module.exports = app;