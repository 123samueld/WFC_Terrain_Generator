// ProfilingTools.js

// Simulate CPU-bound work (heavy computation)
export function heavyComputation(duration = 500) {
    const start = performance.now();
    while (performance.now() - start < duration) {
      // Busy work (can be any intensive computation, like math operations)
      Math.sqrt(Math.random() * Math.random());
    }
  }
  