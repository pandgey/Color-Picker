// Create the color wheel with adjustable lightness
export function drawColorWheel(color, colorWheel, lightness = 50) {
    const radius = colorWheel.width / 2;
    color.clearRect(0, 0, colorWheel.width, colorWheel.height);
    for (let i = 0; i < 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = radius + radius * Math.cos(angle);
        const y = radius + radius * Math.sin(angle);
        color.beginPath();
        color.moveTo(radius, radius);
        color.lineTo(x, y);
        color.strokeStyle = `hsl(${i}, 100%, ${lightness}%)`;
        color.lineWidth = 10;
        color.stroke();
    }
}

// Handle color wheel clicks and return color values
export function getColorFromClick(colorWheel, event) {
    const radius = colorWheel.width / 2;
    const rect = colorWheel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dx = x - radius;
    const dy = y - radius;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
        // Calculate hue from angle
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) angle += 360;

        // Calculate saturation from distance
        const saturation = Math.min((distance / radius) * 100, 100);

        return { h: angle, s: saturation };
    }
    
    return null;
}