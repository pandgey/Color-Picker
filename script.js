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
    continue;
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    continue;
}