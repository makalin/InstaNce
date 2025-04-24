document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const variationsInput = document.getElementById('variations');
    const resultsSection = document.getElementById('resultsSection');
    const variationsGrid = document.getElementById('variationsGrid');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    let selectedFile = null;

    // Theme handling
    const setTheme = (isDark) => {
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme === 'dark');
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    // Handle drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#4a90e2';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        
        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
    });

    function handleFileSelection(file) {
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            generateBtn.disabled = false;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                dropZone.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px;">
                    <p>Click or drag another image to change</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle generate button click
    generateBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('variations', variationsInput.value);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to generate variations');
            }

            const data = await response.json();
            displayResults(data.variations);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate variations. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Variations';
        }
    });

    function displayResults(variations) {
        resultsSection.style.display = 'block';
        variationsGrid.innerHTML = '';

        variations.forEach((url, index) => {
            const variationItem = document.createElement('div');
            variationItem.className = 'variation-item';
            variationItem.innerHTML = `
                <img src="${url}" alt="Variation ${index + 1}">
                <button onclick="downloadImage('${url}', 'variation-${index + 1}.png')">
                    Download
                </button>
            `;
            variationsGrid.appendChild(variationItem);
        });
    }

    // Handle download all button
    downloadAllBtn.addEventListener('click', () => {
        const images = variationsGrid.querySelectorAll('img');
        images.forEach((img, index) => {
            downloadImage(img.src, `variation-${index + 1}.png`);
        });
    });

    // Helper function to download images
    window.downloadImage = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Failed to download image. Please try again.');
        }
    };
}); 