// Global variables
let currentMode = 'single';
let capturedPhotos = [];
let stream = null;
let isCapturing = false;

// DOM Elements
const video = document.getElementById('camera-feed');
const sections = {
    shotSelector: document.getElementById('shot-selector'),
    cameraPreview: document.getElementById('camera-preview'),
    captureSequence: document.getElementById('capture-sequence'),
    layoutSelector: document.getElementById('layout-selector'),
    editingScreen: document.getElementById('editing-screen')
};

// Initialize camera when the page loads
async function initializeCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please ensure you have given permission.');
    }
}

// Show specific section and hide others
function showSection(sectionId) {
    Object.entries(sections).forEach(([id, element]) => {
        element.classList.toggle('d-none', id !== sectionId);
    });
}

// Shot type selection
function selectMode(mode) {
    currentMode = mode;
    showSection('cameraPreview');
    initializeCamera();
}

// Countdown animation
function countdown(seconds) {
    return new Promise(resolve => {
        const countdownElement = document.getElementById('countdown');
        countdownElement.style.display = 'block';
        
        const interval = setInterval(() => {
            countdownElement.textContent = seconds;
            seconds--;
            
            if (seconds < 0) {
                clearInterval(interval);
                countdownElement.style.display = 'none';
                resolve();
            }
        }, 1000);
    });
}

// Flash animation
function flashEffect() {
    const flash = document.getElementById('flash');
    flash.style.opacity = '1';
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 100);
}

// Capture photo
function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.scale(-1, 1); // Mirror effect
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}

// Start capture sequence
async function startCapture() {
    if (isCapturing) return;
    isCapturing = true;
    
    await countdown(3);
    
    if (currentMode === 'single') {
        flashEffect();
        capturedPhotos = [capturePhoto()];
        showSection('editingScreen');
    } else {
        showSection('captureSequence');
        for (let i = 0; i < 5; i++) {
            await countdown(5);
            flashEffect();
            capturedPhotos.push(capturePhoto());
            updateProgress((i + 1) * 20);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        showSection('layoutSelector');
    }
    
    isCapturing = false;
}

// Update progress bar during 5-shot sequence
function updateProgress(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${percentage}%`;
}

// Layout selection
function selectLayout(layout) {
    showSection('editingScreen');
    initializeEditor();
}

// Initialize editor
function initializeEditor() {
    const canvas = document.getElementById('editor-canvas');
    const ctx = canvas.getContext('2d');
    
    // Load frames
    loadFrames();
    
    // Load stickers
    loadStickers();
}

// Load frames from assets
function loadFrames() {
    const framesContainer = document.getElementById('frames-container');
    // Implementation for loading frames
}

// Load stickers from assets
function loadStickers() {
    const stickersContainer = document.getElementById('stickers-container');
    // Implementation for loading stickers
}

// Add text box to editor
function addTextBox() {
    // Implementation for adding text
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Shot type selection
    document.getElementById('single-shot-btn').addEventListener('click', () => selectMode('single'));
    document.getElementById('five-shot-btn').addEventListener('click', () => selectMode('five'));

    // Layout selection
    document.getElementById('grid-layout').addEventListener('click', () => selectLayout('grid'));
    document.getElementById('vertical-layout').addEventListener('click', () => selectLayout('vertical'));
    document.getElementById('single-layout').addEventListener('click', () => selectLayout('single'));

    // Other buttons
    document.getElementById('start-capture').addEventListener('click', startCapture);
    document.getElementById('add-text-btn').addEventListener('click', addTextBox);
    document.getElementById('finish-editing').addEventListener('click', () => {
        // Implementation for finishing editing
    });
});