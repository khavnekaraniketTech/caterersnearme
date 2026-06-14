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

app.use('/caterers', catererRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "A critical routing server exception occurred down the main application line." });
});

//  Update this path to be extensionless under the service layer
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Express service engine online." });
});

// Only run the traditional listen server locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server executing successfully. JSON Data Engine active on Local Port: ${PORT}`);
    });
}

// Required for Vercel serverless distribution loops
module.exports = app;