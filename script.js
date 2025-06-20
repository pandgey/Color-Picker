// CORE FEATURE OF COLOR PICKER

const colorPicker = document.getElementById("colorPicker");
const colorBox = document.getElementById("colorBox");
const colorValues = document.getElementById("values");
const colorWheel = document.getElementById("colorWheel");
const Selectedcolor = colorWheel.getContext("2d");
const radius = colorWheel.width / 2;
const randomColor = document.getElementById("randomColor");

// Create the color wheel
function drawColorWheel() {
    Selectedcolor.clearRect(0, 0, colorWheel.width, colorWheel.height);

    for (let i = 0; i < 360; i++) {
        const startAngle = (i - 1) * Math.PI / 180;
        const endAngle = i * Math.PI / 180;

        Selectedcolor.beginPath();
        Selectedcolor.moveTo(radius, radius);
        Selectedcolor.arc(radius, radius, radius, startAngle, endAngle);
        Selectedcolor.closePath();
        Selectedcolor.fillStyle = `hsl(${i}, 100%, 50%)`;
        Selectedcolor.fill();
    }
}
drawColorWheel();

colorWheel.addEventListener("click", (event) => {
    
    const rect = colorWheel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dx = x - radius;
    const dy = y - radius;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
        const imageData = Selectedcolor.getImageData(x, y, 1, 1).data;
        const [r, g, b] = imageData;

        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);

        colorBox.style.backgroundColor = hex;
        colorValues.innerHTML = `
            <p>HEX: ${hex}</p>
            <p>RGB: (${r}, ${g}, ${b})</p>
            <p>HSL: (${hsl.h}°, ${hsl.s}%, ${hsl.l}%)</p>
        `;
    }
});

// listener for user input
colorPicker.addEventListener("input", () => {
  const hex = colorPicker.value;
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Update the color box and display values
  colorBox.style.backgroundColor = hex;
  colorValues.innerHTML = `
        <p>HEX: ${hex}</p>
        <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
        <p>HSL: (${hsl.h}°, ${hsl.s}%, ${hsl.l}%)</p>
      `;
});

// Function to convert hex to RGB
function hexToRgb(hex) {
    const noHex = hex.replace('#', '');

    // Convert from string to integer for rgb since rgb is in integer format
    const rgbInt = parseInt(noHex, 16);

    // scale by shifting bits
    const r = (rgbInt >> 16) & 255;
    const g = (rgbInt >> 8) & 255;
    const b = rgbInt & 255;
    
    return { r, g, b };
}

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
    const hexConverter = x => x.toString(16).padStart(2, '0');
    const hex = [r, g, b].map(hexConverter).join('');
    return "#" + hex;
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    let h, s, l = (maxVal + minVal) / 2;
    const diff = maxVal - minVal;

    // restrict the value of diff to be integer
    if (diff === 0) {
        h = s = 0; // achromatic
    } else {
        if (l < 0.5) {
            s = diff / (maxVal + minVal);
        } else {
            s = diff / (2 - maxVal - minVal);
        } switch (maxVal) {
            case r: h = (g - b) / diff + (g < b ? 6 : 0); 
                break;
            case g: h = (b - r) / diff + 2; 
                break;
            case b: h = (r - g) / diff + 4; 
                break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Event listener for the random color button
randomColor.addEventListener("click", () => {
    const randomHex = getRandomColor();
    const rgb = hexToRgb(randomHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Update the color box and display values
    colorBox.style.backgroundColor = randomHex;
    colorValues.innerHTML = `
        <p>HEX: ${randomHex}</p>
        <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
        <p>HSL: (${hsl.h}°, ${hsl.s}%, ${hsl.l}%)</p>
    `;
});

// Function to generate a random color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return rgbToHex(r, g, b);
}