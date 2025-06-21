// Color wheel drawing and interaction

class ColorWheel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.radius = this.canvas.width / 2;
        this.setupEventListeners();
    }

    // Draw the color wheel with adjustable lightness
    draw(lightness = 50) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.radius;
        const centerY = this.radius;
        
        // Draw pixel by pixel for smooth gradients
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= this.radius) {
                    // Calculate hue from angle
                    let hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
                    
                    // Calculate saturation from distance (0 at center, 100 at edge)
                    const saturation = Math.min((distance / this.radius) * 100, 100);
                    
                    // Convert HSL to RGB
                    const rgb = hslToRgb(hue, saturation, lightness);
                    
                    const index = (y * this.canvas.width + x) * 4;
                    data[index] = rgb.r;     // Red
                    data[index + 1] = rgb.g; // Green
                    data[index + 2] = rgb.b; // Blue
                    data[index + 3] = 255;   // Alpha
                } else {
                    // Transparent outside the circle
                    const index = (y * this.canvas.width + x) * 4;
                    data[index + 3] = 0; // Transparent
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // Get color from click position
    getColorFromPosition(x, y) {
        const dx = x - this.radius;
        const dy = y - this.radius;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.radius) {
            let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            if (angle < 0) angle += 360;

            const saturation = Math.min((distance / this.radius) * 100, 100);
            
            return { h: angle, s: saturation };
        }
        
        return null;
    }

    // Setup click event listener
    setupEventListeners() {
        this.canvas.addEventListener("click", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const color = this.getColorFromPosition(x, y);
            if (color && this.onColorSelect) {
                this.onColorSelect(color.h, color.s);
            }
        });
    }

    // Set callback for color selection
    onColorSelect(callback) {
        this.onColorSelect = callback;
    }
}