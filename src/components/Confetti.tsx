/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';

export function fireConfetti(options?: { count?: number; spread?: number }) {
  try {
    const count = options?.count ?? 60;
    const spread = options?.spread ?? 70;

    confetti({
      particleCount: count,
      spread: spread,
      origin: { y: 0.65 },
      colors: ['#ff2d78', '#ff7597', '#be123c', '#c084fc', '#ffffff', '#fbbf24'],
      disableForReducedMotion: true,
    });
  } catch {
    // Graceful fallback if canvas blocked
  }
}

export function fireHeartConfetti() {
  try {
    const scalar = 2;
    const heart = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    });

    confetti({
      shapes: [heart],
      scalar,
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff2d78', '#ff4d8d', '#e11d48', '#fda4af'],
    });
  } catch {
    fireConfetti();
  }
}
