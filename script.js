// CORE FEATURE OF COLOR PICKER

const colorPicker = document.getElementById("colorPicker");
const colorBox = document.getElementById("colorBox");
const colorValues = document.getElementById("values");

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

// Button to allow user to copy the HEX value
const copyBttn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");

copyBttn.addEventListener("click", () => {
    const hex = colorPicker.value;
    navigator.clipboard.writeText(hex).then(() => {
        copyMsg.textContent = "The HEX value has been copied!";
        setTimeout(() => 
            copyMsg.textContent = "", 2000);
    });
});

// Live text preview

const previewTxt = document.getElementById("textInput");
previewText.addEventListener("input", () => {
    const hex = colorPicker.value;
    previewTxt.style.color = hex;
});

// Random button generator

const randomBttn = document.getElementById("randomBtn");
randomBttn.addEventListener("click", () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    colorPicker.value = randomHex;
    colorPicker.dispatchEvent(new Event("input")); // Trigger input event to update UI
});