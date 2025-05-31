import { MATH, OPTIONS } from '../FilePathRouter.js';

class GenerationProcessVisualiser {
    constructor() {
        this.currentCell = null;
        this.neighbourCells = [];
        this.isActive = false;
        this.stepByStep = false;
        this.playSpeed = 500;
    }



    setCurrentCell(x, y) {
        this.currentCell = { x, y };
    }

    setNeighbourCells(cells) {
        this.neighbourCells = cells;
    }

    clearHighlights() {
        this.currentCell = null;
        this.neighbourCells = [];
    }

    highlightCurrentIterationCell(ctx, camera) {
        if (!this.isActive || !this.currentCell) return;

        const { x, y } = this.currentCell;
        const isoCoords = MATH.cartesianToIsometric(x, y);
        const screenX = ctx.canvas.width / 2 + isoCoords.x - camera.x;
        const screenY = ctx.canvas.height / 2 + isoCoords.y - camera.y;

        // Draw red highlight for current cell
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32); // Top
        ctx.lineTo(screenX + 32, screenY); // Right
        ctx.lineTo(screenX, screenY + 32); // Bottom
        ctx.lineTo(screenX - 32, screenY); // Left
        ctx.closePath();
        ctx.stroke();
    }

    highlightNeighbourCells(ctx, camera) {
        if (!this.isActive || !this.neighbourCells.length) return;

        // Draw orange highlights for neighbour cells
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
        ctx.lineWidth = 2;

        this.neighbourCells.forEach(cell => {
            const { x, y } = cell;
            const isoCoords = MATH.cartesianToIsometric(x, y);
            const screenX = ctx.canvas.width / 2 + isoCoords.x - camera.x;
            const screenY = ctx.canvas.height / 2 + isoCoords.y - camera.y;

            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 32); // Top
            ctx.lineTo(screenX + 32, screenY); // Right
            ctx.lineTo(screenX, screenY + 32); // Bottom
            ctx.lineTo(screenX - 32, screenY); // Left
            ctx.closePath();
            ctx.stroke();
        });
    }

    draw(ctx, camera) {
        if (!this.isActive) return;
        
        this.highlightNeighbourCells(ctx, camera);
        this.highlightCurrentIterationCell(ctx, camera);
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
        this.clearHighlights();
        this.waitingForStep = false;
    }

    isVisualisationEnabled() {
        return Options.visualiseTerrainGenerationProcess;
    }
}

export const generationProcessVisualiser = new GenerationProcessVisualiser(); 