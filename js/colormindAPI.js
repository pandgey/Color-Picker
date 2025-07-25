// ai-palette.js
class AIPaletteGenerator {
    constructor() {
        this.apiUrl = "http://colormind.io/api/";
        this.isLoading = false;
    }

    // Generate a random palette using a random seed
    async generateRandomPalette() {
        if (this.isLoading) return;
        this.isLoading = true;
        try {
            // Use a set of random seed options
            const seedOptions = [
                [[44,43,44],[90,83,82],"N","N","N"],
                [[200,50,50],"N","N","N","N"],
                ["N","N",[50,150,200],"N","N"],
                [[100,50,150],"N","N","N",[200,180,50]],
                // Fully random seed
                Array.from({length: 5}, () => Math.random() < 0.5 ? "N" : [
                    Math.floor(Math.random()*256),
                    Math.floor(Math.random()*256),
                    Math.floor(Math.random()*256)
                ])
            ];
            const randomSeed = seedOptions[Math.floor(Math.random() * seedOptions.length)];
            const data = {
                model: "default",
                input: randomSeed
            };
            const palette = await new Promise((resolve, reject) => {
                const http = new XMLHttpRequest();
                http.onreadystatechange = function() {
                    if (http.readyState == 4) {
                        if (http.status == 200) {
                            try {
                                const palette = JSON.parse(http.responseText).result;
                                resolve(palette);
                            } catch (error) {
                                reject(new Error('Failed to parse API response'));
                            }
                        } else {
                            reject(new Error(`HTTP error! status: ${http.status}`));
                        }
                    }
                };
                http.open("POST", this.apiUrl, true);
                http.send(JSON.stringify(data));
            });
            this.displayPalette(palette);
        } catch (error) {
            console.error('Random Palette Generation Error:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Display the palette as a row of swatches and allow picking a color
    displayPalette(palette) {
        if (!palette || !palette.length) return;
        // Create or get the palette container
        let paletteContainer = document.getElementById('colormind-palette');
        if (!paletteContainer) {
            paletteContainer = document.createElement('div');
            paletteContainer.id = 'colormind-palette';
            paletteContainer.style.display = 'flex';
            paletteContainer.style.gap = '8px';
            paletteContainer.style.margin = '16px 0';
            paletteContainer.style.justifyContent = 'center';
            const colorBox = document.getElementById('colorBox');
            if (colorBox && colorBox.parentNode) {
                colorBox.parentNode.insertBefore(paletteContainer, colorBox.nextSibling);
            }
        }
        paletteContainer.innerHTML = '';
        palette.forEach(([r, g, b]) => {
            const swatch = document.createElement('div');
            swatch.style.width = '40px';
            swatch.style.height = '40px';
            swatch.style.borderRadius = '8px';
            swatch.style.border = '2px solid #fff';
            swatch.style.boxShadow = '0 1px 4px rgba(0,0,0,0.12)';
            swatch.style.background = `rgb(${r},${g},${b})`;
            swatch.style.cursor = 'pointer';
            swatch.title = this.rgbToHex(r, g, b);
            swatch.addEventListener('click', () => {
                this.updateColorBoxAndValues(r, g, b);
            });
            paletteContainer.appendChild(swatch);
        });
        // Show the first color by default
        const [r, g, b] = palette[0];
        this.updateColorBoxAndValues(r, g, b);
    }

    // Helper to update colorBox and values
    updateColorBoxAndValues(r, g, b) {
        const colorBox = document.getElementById('colorBox');
        if (colorBox) {
            colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
        this.updateValuesDisplay(r, g, b);
    }

    updateValuesDisplay(r, g, b) {
        const valuesEl = document.getElementById('values');
        if (valuesEl) {
            const hex = this.rgbToHex(r, g, b);
            const [h, s, l] = this.rgbToHsl(r, g, b);
            valuesEl.innerHTML = `
                <p>HEX: ${hex}</p>
                <p>RGB: (${r}, ${g}, ${b})</p>
                <p>HSL: (${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)</p>
            `;
        }
    }

    // Utility functions
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
}

// Initialize when DOM is loaded
// Expose the generator globally for button event binding

document.addEventListener('DOMContentLoaded', () => {
    window.aiPaletteGenerator = window.aiPaletteGenerator || new AIPaletteGenerator();
});