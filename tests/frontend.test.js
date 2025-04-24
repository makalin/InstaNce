const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Frontend Tests', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Load the HTML file
        const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable'
        });
        document = dom.window.document;
        window = dom.window;

        // Mock fetch
        window.fetch = jest.fn();

        // Load the script
        const scriptContent = fs.readFileSync(path.join(__dirname, '../public/script.js'), 'utf8');
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    });

    test('should initialize with generate button disabled', () => {
        const generateBtn = document.getElementById('generateBtn');
        expect(generateBtn.disabled).toBe(true);
    });

    test('should enable generate button when file is selected', () => {
        const fileInput = document.getElementById('fileInput');
        const generateBtn = document.getElementById('generateBtn');

        // Create a mock file
        const file = new window.File(['test'], 'test.jpg', { type: 'image/jpeg' });
        
        // Trigger file input change event
        const event = new window.Event('change');
        Object.defineProperty(event, 'target', {
            value: { files: [file] }
        });
        fileInput.dispatchEvent(event);

        expect(generateBtn.disabled).toBe(false);
    });

    test('should handle drag and drop events', () => {
        const dropZone = document.getElementById('dropZone');
        
        // Test dragover
        const dragoverEvent = new window.Event('dragover');
        dropZone.dispatchEvent(dragoverEvent);
        expect(dropZone.style.borderColor).toBe('#4a90e2');

        // Test dragleave
        const dragleaveEvent = new window.Event('dragleave');
        dropZone.dispatchEvent(dragleaveEvent);
        expect(dropZone.style.borderColor).toBe('#ddd');
    });

    test('should make API call when generate button is clicked', async () => {
        const fileInput = document.getElementById('fileInput');
        const generateBtn = document.getElementById('generateBtn');

        // Mock fetch response
        window.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                variations: ['url1', 'url2']
            })
        });

        // Create and select a file
        const file = new window.File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const event = new window.Event('change');
        Object.defineProperty(event, 'target', {
            value: { files: [file] }
        });
        fileInput.dispatchEvent(event);

        // Click generate button
        generateBtn.click();

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.fetch).toHaveBeenCalledWith('/api/generate', expect.any(Object));
        expect(document.getElementById('resultsSection').style.display).toBe('block');
    });

    test('should handle API errors gracefully', async () => {
        const fileInput = document.getElementById('fileInput');
        const generateBtn = document.getElementById('generateBtn');

        // Mock fetch to return error
        window.fetch.mockRejectedValueOnce(new Error('API Error'));

        // Create and select a file
        const file = new window.File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const event = new window.Event('change');
        Object.defineProperty(event, 'target', {
            value: { files: [file] }
        });
        fileInput.dispatchEvent(event);

        // Mock window.alert
        window.alert = jest.fn();

        // Click generate button
        generateBtn.click();

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.alert).toHaveBeenCalledWith('Failed to generate variations. Please try again.');
    });
}); 