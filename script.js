// DOM model
const selector = document.getElementById("colorPicker");
const box = document.getElementById("colorBox");
const values = document.getElementById("values");

// Color changer listener for user input
selector.addEventListener("input", () => {
  const hex = selector.value;
  const rgb = hexTorgb(hex);
  const hsl = rgbTohsl(rgb.r, rgb.g, rgb.b);

  // box to display the color
  box.style.backgroundColor = hex;
  values.innerHTML = `
        <p>HEX: ${hex}</p>
        <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
        <p>HSL: (${hsl.h}°, ${hsl.s}%, ${hsl.l}%)</p>
      `;
});

function hexTorgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {

    // >> = shift by bits
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: (bigint >> 0) & 255,
  };
}

function rgbTohsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;  //gray
  } else {  // find hue and saturation
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
