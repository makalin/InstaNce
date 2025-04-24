require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/api/generate', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const imagePath = req.file.path;
        const numVariations = parseInt(req.body.variations) || 3;

        const variations = [];
        for (let i = 0; i < numVariations; i++) {
            const response = await openai.images.createVariation({
                image: imagePath,
                n: 1,
                size: "1024x1024"
            });

            variations.push(response.data[0].url);
        }

        res.json({ variations });
    } catch (error) {
        console.error('Error generating variations:', error);
        res.status(500).json({ error: 'Failed to generate image variations' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 