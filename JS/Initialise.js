// Initialise.js

export function initCanvas() {
    const canvas = document.getElementById('sandCanvas');
    const ctx = canvas.getContext('2d');
  
    // Set canvas dimensions
    canvas.width = 1055;  // Width of the canvas
    canvas.height = 800; // Height of the canvas
  
    // Draw a small square in the middle of the canvas
    drawSquare(ctx, canvas.width, canvas.height);
  }
  
  function drawSquare(ctx, canvasWidth, canvasHeight) {
    const squareSize = 12; // Size of the square
    const x = (canvasWidth - squareSize) / 2; // Center position
    const y = (canvasHeight - squareSize) / 2; // Center position
  
    ctx.fillStyle = 'blue'; // Set color of the square
    ctx.fillRect(x, y, squareSize, squareSize); // Draw the square
  }
  