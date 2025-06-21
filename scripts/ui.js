import { hslToRgb, rgbToHex } from './colorUtils.js';

// Update color display
export function updateColorDisplay(colorBox, colorValues, h, s, l) {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  colorBox.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
  colorValues.innerHTML = `
        <p>HEX: ${hex}</p>
        <p>RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})</p>
        <p>HSL: (${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)</p>
    `;
}

// Update slider display
export function updateSliderDisplay(lightnessValue, lightness) {
    lightnessValue.textContent = Math.round(lightness) + "%";
}