// Color harmony calculations and display

class ColorHarmonies {
    constructor() {
        this.containers = {
            complementary: document.getElementById("complementary"),
            triadic: document.getElementById("triadic"),
            analogous: document.getElementById("analogous"),
            splitComplementary: document.getElementById("splitComplementary"),
            tetradic: document.getElementById("tetradic"),
            monochromatic: document.getElementById("monochromatic")
            square: document.getElementById("square")
        };
    }

    // Generate color harmonies based on base color
    generate(h, s, l) {
        return {
            complementary: [
                { h, s, l },
                { h: (h + 180) % 360, s, l }
            ],
            triadic: [
                { h, s, l },
                { h: (h + 120) % 360, s, l },
                { h: (h + 240) % 360, s, l }
            ],
            analogous: [
                { h: (h - 30 + 360) % 360, s, l },
                { h, s, l },
                { h: (h + 30) % 360, s, l },
                { h: (h + 60) % 360, s, l }
            ],
            splitComplementary: [
                { h, s, l },
                { h: (h + 150) % 360, s, l },
                { h: (h + 210) % 360, s, l }
            ],
            tetradic: [
                { h, s, l },
                { h: (h + 90) % 360, s, l },
                { h: (h + 180) % 360, s, l },
                { h: (h + 270) % 360, s, l }
            ],
            monochromatic: [
                { h, s, l: Math.max(l - 30, 10) },
                { h, s, l: Math.max(l - 15, 10) },
                { h, s, l },
                { h, s, l: Math.min(l + 15, 90) },
                { h, s, l: Math.min(l + 30, 90) }
            ],
            square: [
                { h, s, l },
                { h: (h + 90) % 360, s, l },
                { h: (h + 180) % 360, s, l },
                { h: (h + 270) % 360, s, l }
            ]
        };
    }

    // Create harmony color element
    createColorElement(colorData, isPrimary = false) {
        const colorDiv = document.createElement('div');
        colorDiv.className = `harmony-color ${isPrimary ? 'primary' : ''}`;
        colorDiv.style.backgroundColor = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;

        const rgb = hslToRgb(colorData.h, colorData.s, colorData.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        const tooltip = document.createElement('div');
        tooltip.className = 'color-tooltip';
        tooltip.textContent = hex;
        colorDiv.appendChild(tooltip);

        // Click to copy color
        colorDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(hex).then(() => {
                tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    tooltip.textContent = hex;
                }, 1000);
            });
        });

        const hexLabel = document.createElement('p');
        hexLabel.className = 'harmony-color-label';
        hexLabel.textContent = hex;

        const wrapper = document.createElement('div');
        wrapper.className = 'harmony-color-wrapper';
        wrapper.appendChild(colorDiv);
        wrapper.appendChild(hexLabel);

        return wrapper;
    }

    // Update all harmony displays
    update(h, s, l) {
        const harmonies = this.generate(h, s, l);

        // Clear existing harmonies
        Object.values(this.containers).forEach(container => {
            container.innerHTML = '';
        });

        // Primary color indices for different harmonies
        const primaryIndices = {
            complementary: 0,
            triadic: 0,
            analogous: 1,
            splitComplementary: 0,
            tetradic: 0,
            monochromatic: 2
        };

        // Populate each harmony type
        Object.keys(harmonies).forEach(harmonyType => {
            const container = this.containers[harmonyType];
            const colors = harmonies[harmonyType];
            const primaryIndex = primaryIndices[harmonyType];

            colors.forEach((color, index) => {
                const colorElement = this.createColorElement(color, index === primaryIndex);
                container.appendChild(colorElement);
            });
        });
    }
}
