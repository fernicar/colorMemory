export type HSB = [number, number, number]; // Hue (0-360), Saturation (0-100), Brightness (0-100)
export type RGB = [number, number, number]; // Red (0-255), Green (0-255), Blue (0-255)
export type LAB = [number, number, number]; // L (0-100), a (-128-127), b (-128-127)

export function hsbToRgb(h: number, s: number, b: number): RGB {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

export function hsbToHex(h: number, s: number, b: number): string {
  const [r, g, bVal] = hsbToRgb(h, s, b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bVal).toString(16).slice(1)}`;
}

export function rgbToLab(r: number, g: number, b: number): LAB {
  let r_ = r / 255, g_ = g / 255, b_ = b / 255;
  r_ = r_ > 0.04045 ? Math.pow((r_ + 0.055) / 1.055, 2.4) : r_ / 12.92;
  g_ = g_ > 0.04045 ? Math.pow((g_ + 0.055) / 1.055, 2.4) : g_ / 12.92;
  b_ = b_ > 0.04045 ? Math.pow((b_ + 0.055) / 1.055, 2.4) : b_ / 12.92;

  const x = (r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805) / 0.95047;
  const y = (r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722) / 1.00000;
  const z = (r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505) / 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + (16 / 116);

  const l = (116 * f(y)) - 16;
  const a = 500 * (f(x) - f(y));
  const b_lab = 200 * (f(y) - f(z));

  return [l, a, b_lab];
}

export function calculateDeltaE(lab1: LAB, lab2: LAB): number {
  return Math.sqrt(Math.pow(lab1[0] - lab2[0], 2) + Math.pow(lab1[1] - lab2[1], 2) + Math.pow(lab1[2] - lab2[2], 2));
}

export function scoreHsb(target: HSB, guess: HSB): number {
  const [h1, s1, b1] = target;
  const [h2, s2, b2] = guess;

  const rgb1 = hsbToRgb(h1, s1, b1);
  const rgb2 = hsbToRgb(h2, s2, b2);

  const lab1 = rgbToLab(...rgb1);
  const lab2 = rgbToLab(...rgb2);

  const dE = calculateDeltaE(lab1, lab2);

  const baseScore = 10 / (1 + Math.pow(dE / 32, 1.6));

  const hueDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
  const avgSat = (s1 + s2) / 2;

  const hueAcc = Math.max(0, 1 - Math.pow(hueDiff / 25, 1.5));
  const satWeightR = Math.min(1, avgSat / 30);
  const recovery = (10 - baseScore) * hueAcc * satWeightR * 0.30;

  const huePenFactor = Math.max(0, (hueDiff - 40) / 140);
  const satWeightP = Math.min(1, avgSat / 40);
  const penalty = baseScore * huePenFactor * satWeightP * 0.3;

  let finalScore = baseScore + recovery - penalty;

  if (finalScore < 9.8) {
    const jitter = (Math.random() * 0.08) - 0.04;
    finalScore += jitter;
  }

  finalScore = Math.max(0, Math.min(10, finalScore));
  return Math.round(finalScore * 100) / 100;
}

export function getTextColor(h: number, s: number, b: number): string {
  const [r, g, bVal] = hsbToRgb(h, s, b);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * bVal) / 255;
  return luminance > 0.45 ? '#000000' : '#ffffff';
}

export function generateRandomColor(): HSB {
  return [
    Math.floor(Math.random() * 360),
    Math.floor(Math.random() * 80) + 20, // Avoid completely desaturated colors
    Math.floor(Math.random() * 80) + 20, // Avoid completely dark colors
  ];
}
