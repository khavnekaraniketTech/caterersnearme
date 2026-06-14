const fs = require('fs');
const path = require('path');

// Dynamically target our JSON data storage node
const DATA_FILE_PATH = path.join(__dirname, '../data/caterers.json');

// Safely handle asynchronous file reading
const readCaterersFromFile = () => {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            // Self-healing layer: if the file is missing, create it as an empty array
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2));
            return [];
        }
        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error reading data store file: ${error.message}`);
        throw new Error("Failed to read from local data engine.");
    }
};

// Safely handle asynchronous file serialization writes
const writeCaterersToFile = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing data store file: ${error.message}`);
        throw new Error("Failed to persist data modifications to local file engine.");
    }
};

// GET /api/caterers 
exports.getCaterers = (req, res) => {
    try {
        let caterers = readCaterersFromFile();
        const { search, maxPrice } = req.query;

        // Apply case-insensitive name filtering
        if (search) {
            caterers = caterers.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply max price plate budget boundaries
        if (maxPrice) {
            const boundaryPrice = Number(maxPrice);
            if (!isNaN(boundaryPrice)) {
                caterers = caterers.filter(c => c.pricePerPlate <= boundaryPrice);
            }
        }

        // Automatically prioritize highest rated catering options first
        caterers.sort((a, b) => b.rating - a.rating);

        res.status(200).json(caterers);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Processing Exception", message: error.message });
    }
};

// GET /api/caterers/:id
exports.getCatererById = (req, res) => {
    try {
        const caterers = readCaterersFromFile();
        const targetId = parseInt(req.params.id, 10);

        if (isNaN(targetId)) {
            return res.status(400).json({ error: "Invalid parameter format: ID must be a numeric integer value" });
        }

        const caterer = caterers.find(c => c.id === targetId);
        if (!caterer) {
            return res.status(404).json({ error: "Caterer resource matching the supplied identifier cannot be found" });
        }

        res.status(200).json(caterer);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Processing Exception", message: error.message });
    }
};

// POST /api/caterers 
exports.createCaterer = (req, res) => {
    try {
        const { name, location, pricePerPlate, cuisines, rating } = req.body;

        // 1. Structural Validation Rules
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Name is required and must be a valid text string." });
        }
        if (!location || typeof location !== 'string' || location.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Location area is required and must be a valid text string." });
        }
        if (pricePerPlate === undefined || typeof pricePerPlate !== 'number' || pricePerPlate <= 0) {
            return res.status(400).json({ error: "Validation Failure: Price per plate parameter must evaluate to a positive number." });
        }
        if (!cuisines || !Array.isArray(cuisines) || cuisines.length === 0) {
            return res.status(400).json({ error: "Validation Failure: Cuisines dataset block must be a non-empty array of keywords." });
        }
        if (rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 5) {
            return res.status(400).json({ error: "Validation Failure: Rating parameter metric is required and must map cleanly between 0.0 and 5.0." });
        }

        const caterers = readCaterersFromFile();

        // 2. Safe Auto-Incrementing Key Generator
        const generatedId = caterers.length > 0 ? Math.max(...caterers.map(c => c.id)) + 1 : 1;

        const newCatererRecord = {
            id: generatedId,
            name: name.trim(),
            location: location.trim(),
            pricePerPlate,
            cuisines: cuisines.map(cuisine => cuisine.trim()),
            rating: parseFloat(rating.toFixed(1))
        };

        // 3. Save into persistence array stream
        caterers.push(newCatererRecord);
        writeCaterersToFile(caterers);

        res.status(201).json(newCatererRecord);
    } catch (error) {
        res.status(500).json({ error: "Data Serialization Execution Failure", message: error.message });
    }
};