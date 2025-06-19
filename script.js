//START

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
    noHex = hex.replace('#', '');

    // Convert from string to integer for rgb since rgb is in integer format
    const tempHolder = parseInt(noHex, 16);

    // scale by shifting bits
    const r = (tempHolder >> 16) & 255;
    const g = (tempHolder >> 8) & 255;
    const b = tempHolder & 255;
    
    return { r, g, b };
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    continue;
}