// Current color state
export let currentColor = {
    h: 0,
    s: 100,
    l: 50
};

export function updateColor(h, s, l) {
    currentColor.h = h;
    currentColor.s = s;
    currentColor.l = l;
}

export function updateLightness(newL) {
    currentColor.l = newL;
}