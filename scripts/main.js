import { currentColor, updateColor, updateLightness } from './state.js';
import { drawColorWheel, getColorFromClick } from './colorWheel.js';
import { updateColorDisplay, updateSliderDisplay } from './ui.js';
import { generateRandomColor } from './randomColor.js';

// DOM Elements
const colorBox = document.getElementById("colorBox");
const colorValues = document.getElementById("values");
const colorWheel = document.getElementById("colorWheel");
const color = colorWheel.getContext("2d"); // Renamed from ctx
const radius = colorWheel.width / 2;
const randomColorBtn = document.getElementById("randomColor");
const lightnessSlider = document.getElementById("lightness");
const lightnessValue = document.getElementById("lightnessValue");

// Lightness slider functionality
lightnessSlider.addEventListener("input", () => {
    const newLightness = parseInt(lightnessSlider.value);
    updateSliderDisplay(lightnessValue, newLightness);
    drawColorWheel(color, colorWheel, newLightness);
    updateLightness(newLightness);
    updateColorDisplay(colorBox, colorValues, currentColor.h, currentColor.s, newLightness);
});

// Color wheel click handler
colorWheel.addEventListener("click", (event) => {
    const colorData = getColorFromClick(colorWheel, event);
    if (colorData) {
        const lightness = parseFloat(lightnessSlider.value);
        updateColor(colorData.h, colorData.s, lightness);
        updateColorDisplay(colorBox, colorValues, colorData.h, colorData.s, lightness);
    }
});

// Random color button
randomColorBtn.addEventListener("click", () => {
    const randomColor = generateRandomColor();
    
    // Update sliders
    lightnessSlider.value = randomColor.l;
    updateSliderDisplay(lightnessValue, randomColor.l);
    
    updateColor(randomColor.h, randomColor.s, randomColor.l);
    updateColorDisplay(colorBox, colorValues, randomColor.h, randomColor.s, randomColor.l);
    drawColorWheel(color, colorWheel, randomColor.l); // Redraw wheel with new lightness
});

// Initialize
function initialize() {
    updateSliderDisplay(lightnessValue, lightnessSlider.value);
    drawColorWheel(color, colorWheel, currentColor.l);
    
    // Set initial color to a nice purple
    setTimeout(() => {
        updateColor(270, 30, 50);
        updateColorDisplay(colorBox, colorValues, 270, 30, 50);
    }, 100);
}

// Start the application
initialize();