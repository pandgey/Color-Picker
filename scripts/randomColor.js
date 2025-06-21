// Generate random color values
export function generateRandomColor() {
    return {
        h: Math.random() * 360,
        s: Math.random() * 100,
        l: Math.random() * 100
    };
}