// FPSCounter.js

export default class FPSCounter {
    constructor(fpsDisplayElement) {
      this.fpsDisplayElement = fpsDisplayElement;
      this.frames = 0;
      this.fps = 0;
      this.lastTime = Date.now();
      
      // Start the FPS calculation loop
      this.startFPSCalculation();
    }
  
    // Method to update frame count
    updateFrame() {
      this.frames++;
    }
  
    // Method to calculate and display FPS every second
    startFPSCalculation() {
      setInterval(() => {
        const now = Date.now();
        const deltaTime = now - this.lastTime;
  
        if (deltaTime >= 1000) {
          this.fps = this.frames;
          this.frames = 0; // Reset frame count for the next second
          this.lastTime = now;
  
          // Update FPS display
          this.fpsDisplayElement.querySelector('span').textContent = `FPS: ${this.fps}`;
        }
      }, 1000);
    }
  }
  