    // DOM Elements
    const colorBox = document.getElementById("colorBox");
    const colorValues = document.getElementById("values");
    const colorWheel = document.getElementById("colorWheel");
    const ctx = colorWheel.getContext("2d");
    const radius = colorWheel.width / 2;
    const randomColorBtn = document.getElementById("randomColor");
    const lightnessSlider = document.getElementById("lightness");
    const lightnessValue = document.getElementById("lightnessValue");

    // Current color state
    let currentColor = {
        h: 0,
        s: 0,
        l: 50
    };

    // Create the color wheel with saturation gradient
    function drawColorWheel() {
        ctx.clearRect(0, 0, colorWheel.width, colorWheel.height);

        // Draw the hue wheel
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;

            for (let r = 0; r < radius; r += 1) {
                const saturation = r / radius * 100;
                const lightness = lightnessSlider.value;
                
                ctx.beginPath();
                ctx.arc(radius, radius, r, startAngle, endAngle);
                ctx.strokeStyle = `hsl(${angle}, ${saturation}%, ${lightness}%)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // Update color display
    function updateColorDisplay(h = currentColor.h, s = currentColor.s, l = currentColor.l) {
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        currentColor = { h, s, l };
        
        colorBox.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        colorValues.innerHTML = `
            <p>HEX: ${hex}</p>
            <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
            <p>HSL: (${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)</p>
        `;
    }

    // Color wheel click handler
    colorWheel.addEventListener("click", (event) => {
        const rect = colorWheel.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dx = x - radius;
        const dy = y - radius;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
            // Calculate hue from angle
            let angle = Math.atan2(dy, dx) * 180 / Math.PI;
            if (angle < 0) angle += 360;
            
            // Calculate saturation from distance
            const saturation = Math.min((distance / radius) * 100, 100);
            
            // Use current lightness
            const lightness = parseFloat(lightnessSlider.value);
            
            updateColorDisplay(angle, saturation, lightness);
        }
    });

    // Lightness slider handler
    lightnessSlider.addEventListener("input", () => {
        const lightness = parseFloat(lightnessSlider.value);
        lightnessValue.textContent = Math.round(lightness) + '%';
        
        // Redraw the color wheel with new lightness
        drawColorWheel();
        
        // Update current color
        updateColorDisplay(currentColor.h, currentColor.s, lightness);
    });

    // Random color button
    randomColorBtn.addEventListener("click", () => {
        const h = Math.random() * 360;
        const s = Math.random() * 100;
        const l = Math.random() * 100;
        
        // Update sliders
        lightnessSlider.value = l;
        lightnessValue.textContent = Math.round(l) + '%';
        
        updateColorDisplay(h, s, l, currentColor.a);
        drawColorWheel(); // Redraw wheel with new lightness
    });

    // Utility functions
    function rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    // Initialize
    lightnessValue.textContent = lightnessSlider.value + '%';
    opacityValue.textContent = opacitySlider.value + '%';
    
    drawColorWheel();
    
    // Set initial color to a nice purple
    setTimeout(() => {
        updateColorDisplay(270, 30, 50);
    }, 100);