// ai-palette.js
class AIPaletteGenerator {
    constructor() {
        this.apiUrl = "http://colormind.io/api/";
        this.isLoading = false;
        this.seedColors = []; // Store multiple seed colors
        this.init();
    }

    init() {
        this.bindEvents();
        this.createAIPaletteSection();
    }

    bindEvents() {
        const aiPaletteBtn = document.getElementById('aiPalette');
        if (aiPaletteBtn) {
            aiPaletteBtn.addEventListener('click', () => this.generatePalette());
        }
    }

    createAIPaletteSection() {
        // Check if AI palette section already exists
        if (document.getElementById('aiPaletteSection')) {
            return;
        }

        const harmoniesContainer = document.querySelector('.harmonies-container');
        if (!harmoniesContainer) {
            console.error('Harmonies container not found');
            return;
        }

        const aiSection = document.createElement('div');
        aiSection.className = 'ai-palette-section';
        aiSection.id = 'aiPaletteSection';
        aiSection.style.display = 'none';
        aiSection.innerHTML = `
            <div class="harmony-section">
                <div class="harmony-title">AI Generated Palette</div>
                <div class="harmony-colors" id="aiPaletteColors"></div>
            </div>
        `;

        harmoniesContainer.appendChild(aiSection);
    }

    async generatePalette() {
        if (this.isLoading) return;

        try {
            // Get current color(s) - you can modify this to collect multiple colors
            const currentColor = this.getCurrentColor();
            if (!currentColor) {
                this.showError('Please select a color first');
                return;
            }

            this.setLoadingState(true);
            
            // You can extend this to use multiple seed colors like:
            // const seedColors = this.getSeedColors(); // [color1, color2, ...]
            // const palette = await this.callColormindAPI(seedColors);
            
            const palette = await this.callColormindAPI(currentColor);
            this.displayPalette(palette);
            this.showAIPaletteSection();

        } catch (error) {
            console.error('AI Palette Generation Error:', error);
            this.showError('Failed to generate AI palette. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Method to add multiple seed colors (you can call this from your main code)
    addSeedColor(r, g, b) {
        this.seedColors.push([r, g, b]);
        // Limit to 4 seed colors (5th slot for AI generation)
        if (this.seedColors.length > 4) {
            this.seedColors = this.seedColors.slice(-4);
        }
    }

    // Method to get seed colors for multi-color generation
    getSeedColors() {
        if (this.seedColors.length > 0) {
            return this.seedColors;
        }
        
        // Fallback to current color
        const currentColor = this.getCurrentColor();
        return currentColor ? [currentColor] : [[128, 128, 128]];
    }

    // Method to generate palette with multiple seed colors
    async generatePaletteWithSeeds() {
        if (this.isLoading) return;

        try {
            this.setLoadingState(true);
            
            const seedColors = this.getSeedColors();
            const palette = await this.callColormindAPI(seedColors);
            this.displayPalette(palette);
            this.showAIPaletteSection();

        } catch (error) {
            console.error('AI Palette Generation Error:', error);
            this.showError('Failed to generate AI palette. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Clear seed colors
    clearSeedColors() {
        this.seedColors = [];
    }

    callColormindAPI(seedColor) {
        return new Promise((resolve, reject) => {
            const url = "http://colormind.io/api/";
            
            // Support multiple seed colors or single seed color
            let input;
            if (Array.isArray(seedColor[0])) {
                // Multiple colors provided
                input = [...seedColor];
                // Fill remaining slots with "N"
                while (input.length < 5) {
                    input.push("N");
                }
            } else {
                // Single color provided
                input = [seedColor, "N", "N", "N", "N"];
            }
            
            const data = {
                model: "default",
                input: input
            };

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
            
            http.open("POST", url, true);
            http.send(JSON.stringify(data));
        });
    }

    getCurrentColor() {
        // ADAPT THIS METHOD TO YOUR COLOR SYSTEM
        // This is a placeholder - you need to integrate with your existing color picker
        
        // Option 1: If you have a global color variable
        // return window.currentColor || [128, 128, 128];
        
        // Option 2: If you can get color from your color wheel class
        // return window.colorWheel ? window.colorWheel.getCurrentRGB() : [128, 128, 128];
        
        // Option 3: Parse from your color box element
        const colorBox = document.getElementById('colorBox');
        if (colorBox) {
            const rgb = this.extractRGBFromElement(colorBox);
            if (rgb) return rgb;
        }

        // Option 4: Parse from your values display
        const valuesEl = document.getElementById('values');
        if (valuesEl) {
            const rgb = this.extractRGBFromValues(valuesEl);
            if (rgb) return rgb;
        }

        // Default fallback
        return [128, 128, 128];
    }

    extractRGBFromElement(element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        if (bgColor.startsWith('rgb')) {
            const matches = bgColor.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return [
                    parseInt(matches[0]),
                    parseInt(matches[1]),
                    parseInt(matches[2])
                ];
            }
        }
        return null;
    }

    extractRGBFromValues(valuesElement) {
        const text = valuesElement.textContent;
        const rgbMatch = text.match(/RGB:\s*\((\d+),\s*(\d+),\s*(\d+)\)/);
        
        if (rgbMatch) {
            return [
                parseInt(rgbMatch[1]),
                parseInt(rgbMatch[2]),
                parseInt(rgbMatch[3])
            ];
        }
        return null;
    }

    displayPalette(palette) {
        const container = document.getElementById('aiPaletteColors');
        if (!container) {
            console.error('AI palette colors container not found');
            return;
        }

        container.innerHTML = '';

        palette.forEach((color, index) => {
            const [r, g, b] = color;
            const colorDiv = document.createElement('div');
            colorDiv.className = 'harmony-color ai-color';
            colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            colorDiv.title = `RGB(${r}, ${g}, ${b}) - ${this.rgbToHex(r, g, b)}`;
            
            // Add click handler to select this color
            colorDiv.addEventListener('click', () => {
                this.selectColor(r, g, b);
            });

            container.appendChild(colorDiv);
        });
    }

    selectColor(r, g, b) {
        // ADAPT THIS METHOD TO YOUR COLOR SYSTEM
        // This method should update your color picker with the selected color
        
        // Option 1: If you have a global function to set color
        // window.setCurrentColor(r, g, b);
        
        // Option 2: If you can access your color wheel instance
        // const [h, s, l] = this.rgbToHsl(r, g, b);
        // window.colorWheel.setColor(h, s, l);
        
        // Option 3: Trigger a custom event
        const event = new CustomEvent('aiColorSelected', {
            detail: { r, g, b }
        });
        document.dispatchEvent(event);

        // Option 4: Update color box directly (basic fallback)
        const colorBox = document.getElementById('colorBox');
        if (colorBox) {
            colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }

        // Update values display
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

    setLoadingState(loading) {
        this.isLoading = loading;
        const button = document.getElementById('aiPalette');
        const loadingEl = document.getElementById('loading');
        
        if (button) {
            button.disabled = loading;
            if (loading) {
                button.style.opacity = '0.7';
                if (loadingEl) loadingEl.style.display = 'block';
            } else {
                button.style.opacity = '1';
                if (loadingEl) loadingEl.style.display = 'none';
            }
        }
    }

    showAIPaletteSection() {
        const section = document.getElementById('aiPaletteSection');
        if (section) {
            section.style.display = 'block';
        }
    }

    showError(message) {
        // Create or update error message element
        let errorEl = document.getElementById('aiPaletteError');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'aiPaletteError';
            errorEl.style.cssText = `
                background: #ff6b6b;
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
                text-align: center;
                display: none;
            `;
            
            const button = document.getElementById('aiPalette');
            if (button && button.parentNode) {
                button.parentNode.insertBefore(errorEl, button.nextSibling);
            }
        }

        errorEl.textContent = message;
        errorEl.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
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
document.addEventListener('DOMContentLoaded', () => {
    window.aiPaletteGenerator = new AIPaletteGenerator();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPaletteGenerator;
}