const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const catererRoutes = require('./routes/catererRoutes');

dotenv.config();
const app = express();

// Enable multi-origin cross communication
app.use(cors({
    origin: '*', // Open for testing locally; switch to Vercel domain during deployment
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Main Root Endpoint Routing Context Mapping
app.use('/api/caterers', catererRoutes);

// Catch-All Global Middleware Exception Layer
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "A critical routing server exception occurred down the main application line." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server executing successfully. JSON Data Engine active on Local Port: ${PORT}`);
});