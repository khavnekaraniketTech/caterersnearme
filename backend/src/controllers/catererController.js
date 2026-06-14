const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/caterers.json');

// Global memory cache layer to bypass serverless container filesystem restrictions
let memoryCaterersCache = null;

const readCaterersFromFile = () => {
    try {
        if (memoryCaterersCache) return memoryCaterersCache;

        if (!fs.existsSync(DATA_FILE_PATH)) {
            const defaultEmptyArray = [];
            try {
                fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaultEmptyArray, null, 2));
            } catch (wErr) {
                // Catches and bypasses write errors on live read-only serverless platforms
            }
            memoryCaterersCache = defaultEmptyArray;
            return defaultEmptyArray;
        }
        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        memoryCaterersCache = JSON.parse(rawData);
        return memoryCaterersCache;
    } catch (error) {
        console.error(`Error reading data store file: ${error.message}`);
        return memoryCaterersCache || [];
    }
};

const writeCaterersToFile = (data) => {
    try {
        memoryCaterersCache = data; // Sync runtime cache state
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Persistent file write omitted due to container environment constraints: ${error.message}`);
    }
};

// GET /api/caterers 
exports.getCaterers = (req, res) => {
    try {
        let caterers = readCaterersFromFile();
        const { search, maxPrice } = req.query;

        if (search) {
            caterers = caterers.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.location.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (maxPrice) {
            const boundaryPrice = Number(maxPrice);
            if (!isNaN(boundaryPrice)) {
                caterers = caterers.filter(c => c.pricePerPlate <= boundaryPrice);
            }
        }

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

        // 1. Identity Validation Checks
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Name is required and must be a valid text string." });
        }
        if (!location || typeof location !== 'string' || location.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Location area is required and must be a valid text string." });
        }

        // 2. Budget and Metric Validations (Using precise type checking)
        const numericPrice = Number(pricePerPlate);
        if (pricePerPlate === undefined || isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ error: "Validation Failure: Price per plate parameter must evaluate to a positive number." });
        }

        const numericRating = Number(rating);
        if (rating === undefined || isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
            return res.status(400).json({ error: "Validation Failure: Rating parameter metric is required and must map cleanly between 0.0 and 5.0." });
        }

        // 3. Array Deep Sanity Verification & Safe Mapping
        if (!cuisines || !Array.isArray(cuisines) || cuisines.length === 0) {
            return res.status(400).json({ error: "Validation Failure: Cuisines dataset block must be a non-empty array." });
        }

        // Automatically clean string elements to close code breaking loops
        const cleanCuisines = cuisines
            .map(c => String(c).trim())
            .filter(c => c !== "" && c !== "undefined" && c !== "null");

        if (cleanCuisines.length === 0) {
            return res.status(400).json({ error: "Validation Failure: Please supply at least one valid culinary specialty tag." });
        }

        const caterers = readCaterersFromFile();
        const generatedId = caterers.length > 0 ? Math.max(...caterers.map(c => c.id)) + 1 : 1;

        const newCatererRecord = {
            id: generatedId,
            name: name.trim(),
            location: location.trim(),
            pricePerPlate: numericPrice,
            cuisines: cleanCuisines,
            rating: parseFloat(numericRating.toFixed(1))
        };

        caterers.push(newCatererRecord);
        writeCaterersToFile(caterers);

        res.status(201).json(newCatererRecord);
    } catch (error) {
        res.status(500).json({ error: "Data Serialization Execution Failure", message: error.message });
    }
};