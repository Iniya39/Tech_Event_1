/**
 * CHAPTER 1: PIXEL RECALL — Pixelation & Reveal Engine
 * Dynamically renders tech images with downsampled pixel blocks & digital blur filters.
 * Features automatic fallback placeholder generation if asset files are pending.
 */

class PixelationEngine {
    constructor(canvasElement = null) {
        this.canvas = canvasElement;
        this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
        
        // Offscreen buffer for downscaling
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCtx = this.bufferCanvas.getContext('2d');
        
        this.currentImage = null;
        this.isLoaded = false;

        // Base configuration per difficulty
        this.config = {
            easy:   { maxBlock: 36, minBlock: 1,  maxBlur: 10, minBlur: 0  },
            medium: { maxBlock: 42, minBlock: 8,  maxBlur: 14, minBlur: 3  },
            hard:   { maxBlock: 50, minBlock: 18, maxBlur: 16, minBlur: 6  }
        };
    }

    /**
     * Loads an image into the engine, falling back to a dynamic placeholder canvas if missing or slow.
     * @param {string} imageSrc 
     * @param {string} fallbackTitle - Title to use if generating placeholder
     * @returns {Promise<void>}
     */
    loadImage(imageSrc, fallbackTitle = "TECH LOGO") {
        return new Promise((resolve) => {
            this.isLoaded = false;
            const img = new Image();

            let resolved = false;
            const safeResolve = () => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            };

            // Safety fallback timeout to prevent blocking timer loop
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    console.warn("Image load timeout, using synthetic canvas asset:", imageSrc);
                    this.currentImage = this.createPlaceholderImage(fallbackTitle);
                    this.isLoaded = true;
                    if (this.canvas) {
                        this.canvas.width = 400;
                        this.canvas.height = 400;
                    }
                    safeResolve();
                }
            }, 600);

            img.onload = () => {
                clearTimeout(timeoutId);
                this.currentImage = img;
                this.isLoaded = true;
                if (this.canvas) {
                    this.canvas.width = 400;
                    this.canvas.height = 400;
                }
                safeResolve();
            };

            img.onerror = () => {
                clearTimeout(timeoutId);
                this.currentImage = this.createPlaceholderImage(fallbackTitle);
                this.isLoaded = true;
                if (this.canvas) {
                    this.canvas.width = 400;
                    this.canvas.height = 400;
                }
                safeResolve();
            };

            img.src = imageSrc;
        });
    }

    /**
     * Dynamically creates a stylized high-tech vector canvas placeholder.
     * @param {string} title 
     * @returns {HTMLCanvasElement}
     */
    createPlaceholderImage(title) {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 400;
        pCanvas.height = 400;
        const pCtx = pCanvas.getContext('2d');

        // Dark tech gradient background
        const grad = pCtx.createLinearGradient(0, 0, 400, 400);
        grad.addColorStop(0, '#0a1128');
        grad.addColorStop(0.5, '#001f3f');
        grad.addColorStop(1, '#000814');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 400, 400);

        // Tech grid lines
        pCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        pCtx.lineWidth = 1;
        for (let i = 0; i <= 400; i += 40) {
            pCtx.beginPath();
            pCtx.moveTo(i, 0); pCtx.lineTo(i, 400);
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.moveTo(0, i); pCtx.lineTo(400, i);
            pCtx.stroke();
        }

        // Glowing center tech badge
        pCtx.save();
        pCtx.shadowColor = '#00f0ff';
        pCtx.shadowBlur = 25;
        pCtx.strokeStyle = '#00f0ff';
        pCtx.lineWidth = 4;
        pCtx.strokeRect(80, 80, 240, 240);

        pCtx.fillStyle = '#00f0ff';
        pCtx.font = '900 24px "Orbitron", sans-serif';
        pCtx.textAlign = 'center';
        pCtx.textBaseline = 'middle';
        pCtx.fillText('PIXEL RECALL', 200, 170);

        pCtx.fillStyle = '#7000ff';
        pCtx.shadowColor = '#7000ff';
        pCtx.font = '700 18px "Rajdhani", sans-serif';
        pCtx.fillText(title.toUpperCase(), 200, 215);

        pCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        pCtx.font = '12px sans-serif';
        pCtx.fillText('[ PLACEHOLDER ASSET ]', 200, 250);
        pCtx.restore();

        return pCanvas;
    }

    /**
     * Renders attached image directly and clearly without blur or pixelation downsampling.
     * @param {number} timeRatio - Value from 1.0 (start) down to 0.0 (timeout)
     * @param {string} difficulty - "easy", "medium", or "hard"
     */
    render(timeRatio, difficulty = "easy") {
        if (!this.canvas || !this.ctx || !this.isLoaded || !this.currentImage) return;

        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
        this.ctx.clearRect(0, 0, w, h);

        // Draw image directly at full scale
        this.ctx.drawImage(this.currentImage, 0, 0, w, h);
        this.canvas.style.filter = 'none';
    }

    /**
     * Completely resets canvas visual state.
     */
    reset() {
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.style.filter = 'none';
        }
        this.isLoaded = false;
        this.currentImage = null;
    }
}
