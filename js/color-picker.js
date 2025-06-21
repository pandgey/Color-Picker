// Main color picker functionality

class ColorPicker {
    constructor() {
        // DOM Elements
        this.colorBox = document.getElementById("colorBox");
        this.colorValues = document.getElementById("values");
        this.randomColorBtn = document.getElementById("randomColor");
        this.lightnessSlider = document.getElementById("lightness");
        this.lightnessValue = document.getElementById("lightnessValue");

        // Current color state
        this.currentColor = {
            h: 270,
            s: 30,
            l: 50
        };

        this.setupEventListeners();
    }

    // Update color display
    updateDisplay(h = this.currentColor.h, s = this.currentColor.s, l = this.currentColor.l) {
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        this.currentColor = { h, s, l };

        this.colorBox.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        this.colorValues.innerHTML = `
            <p>HEX: ${hex}</p>
            <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
            <p>HSL: (${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)</p>
        `;

        // Trigger color change event
        if (this.onColorChange) {
            this.onColorChange(h, s, l);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Lightness slider handler
        this.lightnessSlider.addEventListener("input", () => {
            const lightness = parseFloat(this.lightnessSlider.value);
            this.lightnessValue.textContent = Math.round(lightness) + "%";

            this.updateDisplay(this.currentColor.h, this.currentColor.s, lightness);
        });

        // Random color button
        this.randomColorBtn.addEventListener("click", () => {
            const h = Math.random() * 360;
            const s = Math.random() * 100;
            const l = Math.random() * 100;

            this.lightnessSlider.value = l;
            this.lightnessValue.textContent = Math.round(l) + "%";

            this.updateDisplay(h, s, l);
        });
    }

    // Set callback for color changes
    onColorChange(callback) {
        this.onColorChange = callback;
    }

    // Get current color
    getCurrentColor() {
        return { ...this.currentColor };
    }

    // Set color programmatically
    setColor(h, s, l) {
        this.lightnessSlider.value = l;
        this.lightnessValue.textContent = Math.round(l) + "%";
        this.updateDisplay(h, s, l);
    }
}