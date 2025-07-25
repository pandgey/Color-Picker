// Main application initialization and coordination

document.addEventListener("DOMContentLoaded", () => {
  // Initialize components
  const colorWheel = new ColorWheel("colorWheel");
  const colorPicker = new ColorPicker();
  const colorHarmonies = new ColorHarmonies();

  // Connect color wheel to picker
  colorWheel.onColorSelect = (h, s) => {
    const currentColor = colorPicker.getCurrentColor();
    colorPicker.updateDisplay(h, s, currentColor.l);
    colorWheel.draw(currentColor.l);
  };

  // Connect picker to harmonies and wheel
  colorPicker.onColorChange = (h, s, l) => {
    colorHarmonies.update(h, s, l);
    colorWheel.draw(l);
  };

  // Initialize with default color
  colorPicker.lightnessValue.textContent =
    colorPicker.lightnessSlider.value + "%";
  colorWheel.draw(50);
  colorPicker.updateDisplay(270, 30, 50);

  // Add event listener for random palette button
  const randomPaletteBtn = document.getElementById('generate-random-palette');
  if (randomPaletteBtn && window.aiPaletteGenerator) {
    randomPaletteBtn.addEventListener('click', () => {
      window.aiPaletteGenerator.generateRandomPalette();
    });
  }
});
