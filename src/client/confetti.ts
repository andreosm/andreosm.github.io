declare const confetti: typeof import("canvas-confetti").default;

export function startCelebration(): void {
  const duration = 7000;
  const end = Date.now() + duration;

  const colors = [
    "#FFD700",
    "#FF69B4",
    "#00BFFF",
    "#32CD32",
    "#FF4500",
    "#FFFFFF",
  ];

  // Initial confetti cannons
  confetti({
    particleCount: 250,
    angle: 60,
    spread: 75,
    origin: { x: 0, y: 1 },
    colors,
    zIndex: 9999,
  });

  confetti({
    particleCount: 250,
    angle: 120,
    spread: 75,
    origin: { x: 1, y: 1 },
    colors,
    zIndex: 9999,
  });

  // Subsequent fireworks-style bursts
  const interval = window.setInterval(() => {
    if (Date.now() >= end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 120,
      spread: 360,
      startVelocity: 55,
      gravity: 0.8,
      ticks: 100,
      origin: {
        x: 0.2 + Math.random() * 0.6,
        y: 0.15 + Math.random() * 0.35,
      },
      colors,
      zIndex: 9999,
    });
  }, 700);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCelebration);
} else {
  startCelebration();
}
