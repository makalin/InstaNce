const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

// Mock OpenAI
jest.mock('openai', () => {
    return {
        OpenAI: jest.fn().mockImplementation(() => ({
            images: {
                createVariation: jest.fn().mockResolvedValue({
                    data: [
                        { url: 'https://example.com/variation1.png' },
                        { url: 'https://example.com/variation2.png' }
                    ]
                })
            }
        }))
    };
});

// Create a test uploads directory
const testUploadsDir = path.join(__dirname, '../test-uploads');
if (!fs.existsSync(testUploadsDir)) {
    fs.mkdirSync(testUploadsDir);
}

// Configure multer for testing
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, testUploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create test app
const app = express();
app.use(express.json());
app.post('/api/generate', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const numVariations = parseInt(req.body.variations) || 3;
        const variations = [];

        for (let i = 0; i < numVariations; i++) {
            const response = await new OpenAI().images.createVariation({
                image: req.file.path,
                n: 1,
                size: "1024x1024"
            });
            variations.push(response.data[0].url);
        }

        res.json({ variations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate image variations' });
    }
});

describe('Server Tests', () => {
    afterAll(() => {
        // Clean up test uploads directory
        if (fs.existsSync(testUploadsDir)) {
            fs.readdirSync(testUploadsDir).forEach(file => {
                fs.unlinkSync(path.join(testUploadsDir, file));
            });
            fs.rmdirSync(testUploadsDir);
        }
    });

    test('should return 400 if no image is uploaded', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({ variations: 2 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No image uploaded');
    });

    test('should generate image variations successfully', async () => {
        const response = await request(app)
            .post('/api/generate')
            .attach('image', path.join(__dirname, 'test-image.jpg'))
            .field('variations', 2);

        expect(response.status).toBe(200);
        expect(response.body.variations).toHaveLength(2);
        expect(response.body.variations[0]).toBe('https://example.com/variation1.png');
    });

    test('should handle server errors gracefully', async () => {
        // Mock OpenAI to throw an error
        OpenAI.mockImplementation(() => ({
            images: {
                createVariation: jest.fn().mockRejectedValue(new Error('API Error'))
            }
        }));

        const response = await request(app)
            .post('/api/generate')
            .attach('image', path.join(__dirname, 'test-image.jpg'))
            .field('variations', 2);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to generate image variations');
    });
}); 