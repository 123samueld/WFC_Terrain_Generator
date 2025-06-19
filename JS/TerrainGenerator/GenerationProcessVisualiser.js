import { 
    MATH, 
    TERRAIN_GENERATOR, 
    INITIALISE, 
    WFC_RULES, 
    TERRAIN_TILE,
    GENERATION_STATE
} from '../FilePathRouter.js';
import { options } from '../Options.js';

class GenerationProcessVisualiser {
    constructor() {
        // Add pulsing effect properties
        this.pulseStartTime = Date.now();
        this.pulseSpeed = 6; // Speed of the pulse
        this.pulseMinOpacity = 0.3;
        this.pulseMaxOpacity = 0.8;
        this.pulseMinWidth = 3;
        this.pulseMaxWidth = 5;
    }

    setCurrentCell(x, y) {
        GENERATION_STATE.currentCell = { x, y };
    }

    setNeighbourCells(cells) {
        GENERATION_STATE.neighbourCells = cells;
    }

    clearHighlights() {
        GENERATION_STATE.currentCell = null;
        GENERATION_STATE.neighbourCells = new Set();
    }

    // Calculate current pulse opacity
    getPulseOpacity() {
        const elapsed = (Date.now() - this.pulseStartTime) / 1000; // Convert to seconds
        const pulse = (Math.sin(elapsed * this.pulseSpeed) + 1) / 2; // Convert to 0-1 range
        return this.pulseMinOpacity + (pulse * (this.pulseMaxOpacity - this.pulseMinOpacity));
    }

    // Calculate current pulse width
    getPulseWidth() {
        const elapsed = (Date.now() - this.pulseStartTime) / 1000;
        const pulse = (Math.sin(elapsed * this.pulseSpeed) + 1) / 2;
        return this.pulseMinWidth + (pulse * (this.pulseMaxWidth - this.pulseMinWidth));
    }

    // Draw corner points
    drawCornerPoints(ctx, screenX, screenY) {
        const pointRadius = 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        
        // Draw points at each corner
        ctx.beginPath();
        ctx.arc(screenX, screenY - 50, pointRadius, 0, Math.PI * 2); // Top
        ctx.arc(screenX + 100, screenY, pointRadius, 0, Math.PI * 2); // Right
        ctx.arc(screenX, screenY + 50, pointRadius, 0, Math.PI * 2); // Bottom
        ctx.arc(screenX - 100, screenY, pointRadius, 0, Math.PI * 2); // Left
        ctx.fill();
    }

    highlightCurrentIterationCell(ctx, camera) {
        if (!GENERATION_STATE.shouldDrawHighlights || !GENERATION_STATE.currentCell) return;

        const { x, y } = GENERATION_STATE.currentCell;
        const drawX = x + 1;  // Add +1 offset only for drawing
        const isoCoords = MATH.cartesianToIsometric(drawX, y);
        const screenX = ctx.canvas.width / 2 + isoCoords.x - camera.x;
        const screenY = ctx.canvas.height / 2 + isoCoords.y - camera.y;

        // Draw red highlight for current cell with pulsing opacity and width
        const opacity = this.getPulseOpacity();
        const width = this.getPulseWidth();
        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);        // Top
        ctx.lineTo(screenX + 100, screenY);       // Right
        ctx.lineTo(screenX, screenY + 50);        // Bottom
        ctx.lineTo(screenX - 100, screenY);       // Left
        ctx.closePath();
        ctx.stroke();

        // Draw corner points only for current cell
        this.drawCornerPoints(ctx, screenX, screenY);

        // Log when cell is highlighted
    }

    highlightNeighbourCells(ctx, camera) {
        if (!GENERATION_STATE.shouldDrawHighlights || !GENERATION_STATE.neighbourCells.size) return;

        GENERATION_STATE.neighbourCells.forEach(cell => {
            const drawX = cell.x + 1;  // Add +1 offset only for drawing
            const isoCoords = MATH.cartesianToIsometric(drawX, cell.y);
            const screenX = ctx.canvas.width / 2 + isoCoords.x - camera.x;
            const screenY = ctx.canvas.height / 2 + isoCoords.y - camera.y;

            // If this is the current neighbor being processed, use pulsing yellow
            if (GENERATION_STATE.currentNeighbor && GENERATION_STATE.currentNeighbor.x === cell.x && GENERATION_STATE.currentNeighbor.y === cell.y) {
                const opacity = this.getPulseOpacity();
                const width = this.getPulseWidth();
                ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;  // Pulsing yellow for current neighbor
                ctx.lineWidth = width;
            } else {
                ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)';  // Static orange for other neighbors
                ctx.lineWidth = 2;
            }

            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 50);        // Top
            ctx.lineTo(screenX + 100, screenY);       // Right
            ctx.lineTo(screenX, screenY + 50);        // Bottom
            ctx.lineTo(screenX - 100, screenY);       // Left
            ctx.closePath();
            ctx.stroke();

            // Draw corner points only for current neighbor
            if (GENERATION_STATE.currentNeighbor && GENERATION_STATE.currentNeighbor.x === cell.x && GENERATION_STATE.currentNeighbor.y === cell.y) {
                this.drawCornerPoints(ctx, screenX, screenY);
            }
        });
    }

    draw(ctx, camera) {
        if (!GENERATION_STATE.shouldDrawHighlights) return;
        
        this.highlightNeighbourCells(ctx, camera);
        this.highlightCurrentIterationCell(ctx, camera);
    }

    isVisualisationEnabled() {
        return options.visualiseTerrainGenerationProcess;
    }

    // Center camera on a cell while respecting constraints
    centerCameraOnCell(x, y) {
        const { write } = INITIALISE.getGameStateBuffers();
        const drawX = x + 1;  // Add +1 offset for drawing
        const isoCoords = MATH.cartesianToIsometric(drawX, y);
        
        // Calculate target camera position to center the cell
        const targetX = isoCoords.x;
        const targetY = isoCoords.y;
        
        // Apply camera constraints
        write.camera.x = Math.max(-2900, Math.min(3100, targetX));
        write.camera.y = Math.max(400, Math.min(3200, targetY));
    }

    // First step - initialization
    firstStep() {
        // TERRAIN GENERATION: Initialize the WFC algorithm
        TERRAIN_GENERATOR.initialize();
        
        // STATE UPDATE: Set initial generation state
        GENERATION_STATE.isGenerating = true;
        GENERATION_STATE.shouldDrawHighlights = true;
        GENERATION_STATE.currentStep = 1;
        GENERATION_STATE.generationStepCount = 1;
        
        // TERRAIN GENERATION: Find the first cell to process
        const cellIndex = TERRAIN_GENERATOR.findLowestEntropyCell();
        if (cellIndex !== null) {
            const x = cellIndex % 36;
            const y = Math.floor(cellIndex / 36) % 36;
            
            // VISUALIZATION: Set up current cell for display
            GENERATION_STATE.currentCell = { x, y };
            this.centerCameraOnCell(x, y);
            
            // STATE UPDATE: Initialize step tracking state
            GENERATION_STATE.stepState = {
                type: GENERATION_STATE.StepType.FINDING_CELL,
                currentCell: { x, y },
                currentNeighbor: null,
                stepNumber: 1
            };
            
            // TERRAIN GENERATION: Get neighboring cells that need processing
            GENERATION_STATE.neighborIndices = TERRAIN_GENERATOR.getNeighbourCells(cellIndex);
            
            // VISUALIZATION: Convert neighbor indices to display coordinates
            GENERATION_STATE.neighbourCells = new Set();
            GENERATION_STATE.neighborIndices.forEach(index => {
                if (index !== null) {
                    const nx = index % 36;
                    const ny = Math.floor(index / 36) % 36;
                    GENERATION_STATE.neighbourCells.add({ x: nx, y: ny });
                }
            });
            
            // STATE UPDATE: Set up first neighbor for processing
            if (GENERATION_STATE.neighbourCells.size > 0) {
                GENERATION_STATE.currentNeighbor = Array.from(GENERATION_STATE.neighbourCells)[0];
                GENERATION_STATE.currentStepType = GENERATION_STATE.StepType.PROCESSING_NEIGHBOR;
                
                // Get superposition tiles for current neighbor
                const neighborIndex = GENERATION_STATE.currentNeighbor.x + (GENERATION_STATE.currentNeighbor.y * 36);
                const superpositionTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                if (superpositionTiles) {
                    GENERATION_STATE.currentNeighborTerrainTypes = new Set(superpositionTiles);
                }
                
                // STATE UPDATE: Update step state for neighbor processing
                GENERATION_STATE.stepState = {
                    type: GENERATION_STATE.StepType.PROCESSING_NEIGHBOR,
                    currentCell: { x, y },
                    currentNeighbor: GENERATION_STATE.currentNeighbor,
                    stepNumber: 1
                };
            } else {
                GENERATION_STATE.currentNeighbor = null;
                GENERATION_STATE.currentNeighborTerrainTypes.clear();
            }
        }
        
        return true;
    }

    // Step-by-step generation for visualization
    generateStepVisualisation() {
        GENERATION_STATE.generationStepCount++;
        GENERATION_STATE.stepState.stepNumber = GENERATION_STATE.generationStepCount;

        // Check if we're done
        if (TERRAIN_GENERATOR.superPositionTileSetEmpty()) {
            GENERATION_STATE.isGenerating = false;
            return false;
        }

        // If we don't have a current cell, find the next one
        if (!GENERATION_STATE.currentCell) {
            GENERATION_STATE.currentStepType = GENERATION_STATE.StepType.FINDING_CELL;
            
            // Find the cell with lowest entropy
            let cellIndex = TERRAIN_GENERATOR.findLowestEntropyCell();
            if (cellIndex === null) {
                GENERATION_STATE.isGenerating = false;
                return false;
            }

            // Convert index to x,y coordinates
            const x = cellIndex % 36;
            const y = Math.floor(cellIndex / 36) % 36;
            GENERATION_STATE.currentCell = { x, y };
            
            // Center camera on the new cell
            this.centerCameraOnCell(x, y);
            
            // Get and store neighbors for processing
            GENERATION_STATE.neighborIndices = TERRAIN_GENERATOR.getNeighbourCells(cellIndex);
            
            // Convert neighbor indices to coordinates and store them
            GENERATION_STATE.neighbourCells = new Set();
            GENERATION_STATE.neighborIndices.forEach(index => {
                if (index !== null) {
                    const nx = index % 36;
                    const ny = Math.floor(index / 36) % 36;
                    GENERATION_STATE.neighbourCells.add({ x: nx, y: ny });
                }
            });

            // Update step state
            GENERATION_STATE.stepState = {
                type: GENERATION_STATE.StepType.FINDING_CELL,
                currentCell: { x, y },
                currentNeighbor: null,
                stepNumber: this.generationStepCount
            };
            
            // Start with the first neighbor
            if (GENERATION_STATE.neighbourCells.size > 0) {
                GENERATION_STATE.currentNeighbor = Array.from(GENERATION_STATE.neighbourCells)[0];
                GENERATION_STATE.currentStepType = GENERATION_STATE.StepType.PROCESSING_NEIGHBOR;
                
                // Get superposition tiles for current neighbor
                const neighborIndex = GENERATION_STATE.currentNeighbor.x + (GENERATION_STATE.currentNeighbor.y * 36);
                const superpositionTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                if (superpositionTiles) {
                    GENERATION_STATE.currentNeighborTerrainTypes = new Set(superpositionTiles);
                }
                
                // STATE UPDATE: Update step state for neighbor processing
                GENERATION_STATE.stepState = {
                    type: GENERATION_STATE.StepType.PROCESSING_NEIGHBOR,
                    currentCell: { x, y },
                    currentNeighbor: GENERATION_STATE.currentNeighbor,
                    stepNumber: GENERATION_STATE.generationStepCount
                };
            } else {
                GENERATION_STATE.currentNeighbor = null;
                GENERATION_STATE.currentNeighborTerrainTypes.clear();
            }

            GENERATION_STATE.currentStep++;
            return true;
        }

        // If we have a current cell, process its neighbors one by one
        if (GENERATION_STATE.currentNeighbor) {
            GENERATION_STATE.currentStepType = GENERATION_STATE.StepType.PROCESSING_NEIGHBOR;
            
            // Process current neighbor
            const neighborIndex = GENERATION_STATE.currentNeighbor.x + (GENERATION_STATE.currentNeighbor.y * 36);
            
            // Move to next neighbor
            const neighbors = Array.from(GENERATION_STATE.neighbourCells);
            const currentIndex = neighbors.findIndex(n => 
                n.x === GENERATION_STATE.currentNeighbor.x && n.y === GENERATION_STATE.currentNeighbor.y);
            
            if (currentIndex < neighbors.length - 1) {
                GENERATION_STATE.currentNeighbor = neighbors[currentIndex + 1];
                
                // Get superposition tiles for current neighbor
                const neighborIndex = GENERATION_STATE.currentNeighbor.x + (GENERATION_STATE.currentNeighbor.y * 36);
                const superpositionTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                if (superpositionTiles) {
                    GENERATION_STATE.currentNeighborTerrainTypes = new Set(superpositionTiles);
                }
                
                // Update step state for next neighbor
                GENERATION_STATE.stepState = {
                    type: GENERATION_STATE.StepType.PROCESSING_NEIGHBOR,
                    currentCell: GENERATION_STATE.currentCell,
                    currentNeighbor: GENERATION_STATE.currentNeighbor,
                    stepNumber: GENERATION_STATE.generationStepCount
                };
            } else {
                // All neighbors processed, process the complete step
                const cellIndex = GENERATION_STATE.currentCell.y * 36 + GENERATION_STATE.currentCell.x;
                
                // Call WFC's generateStep with the current cell index
                const success = TERRAIN_GENERATOR.generateStep(cellIndex);
                
                if (!success) {
                    GENERATION_STATE.isGenerating = false;
                    return false;
                }
                
                // Clear everything for next step
                GENERATION_STATE.currentCell = null;
                GENERATION_STATE.currentNeighbor = null;
                GENERATION_STATE.currentNeighborTerrainTypes.clear();
                GENERATION_STATE.neighbourCells.clear();
                GENERATION_STATE.neighborIndices = [];
                GENERATION_STATE.currentStepType = GENERATION_STATE.StepType.FINDING_CELL;
                
                // Update step state for finding next cell
                GENERATION_STATE.stepState = {
                    type: GENERATION_STATE.StepType.FINDING_CELL,
                    currentCell: null,
                    currentNeighbor: null,
                    stepNumber: GENERATION_STATE.generationStepCount
                };
            }
            
            GENERATION_STATE.currentStep++;
            return true;
        }

        return false;
    }

    // Control methods
    play() {
        if (GENERATION_STATE.isPlaying) return;
        
        GENERATION_STATE.isPlaying = true;
        GENERATION_STATE.shouldDrawHighlights = true;
        
        const initialDelay = GENERATION_STATE.playSpeed / GENERATION_STATE.playSpeedDivider;

        // Start the play interval
        GENERATION_STATE.playInterval = setInterval(() => {
            const currentDelay = GENERATION_STATE.playSpeed / GENERATION_STATE.playSpeedDivider;

            if (!this.generateStepVisualisation()) {
                this.pause();
            }
        }, GENERATION_STATE.playSpeed / GENERATION_STATE.playSpeedDivider);
    }

    pause() {
        GENERATION_STATE.isPlaying = false;
        if (GENERATION_STATE.playInterval) {
            clearInterval(GENERATION_STATE.playInterval);
            GENERATION_STATE.playInterval = null;
        }
    }

    stepForward() {
        if (GENERATION_STATE.isPlaying) return false;
        
        GENERATION_STATE.shouldDrawHighlights = true;
        
        return this.generateStepVisualisation();
    }

    stepBack() {
        if (GENERATION_STATE.isPlaying) return;
        
        // Try to step back in WFC state
        if (TERRAIN_GENERATOR.stepBack()) {
            // Update visualization state
            GENERATION_STATE.generationStepCount--;
            
            // Clear current state
            GENERATION_STATE.currentCell = null;
            GENERATION_STATE.currentNeighbor = null;
            GENERATION_STATE.currentNeighborTerrainTypes.clear();
            GENERATION_STATE.neighbourCells.clear();
            GENERATION_STATE.neighborIndices = [];
            
            // Update step state
            GENERATION_STATE.stepState = {
                type: GENERATION_STATE.StepType.FINDING_CELL,
                currentCell: null,
                currentNeighbor: null,
                stepNumber: GENERATION_STATE.generationStepCount
            };
            
            // Keep visualization active
            GENERATION_STATE.shouldDrawHighlights = true;
            GENERATION_STATE.isGenerating = true;
        }
    }

    setPlaySpeed(divider) {
        // Update the playSpeedDivider in GenerationState
        GENERATION_STATE.playSpeedDivider = divider;
        
        // Check if currently playing and restart if needed
        if (GENERATION_STATE.isPlaying) {
            this.pause();
            this.play();
        } 
    }

    reset() {
  
        GENERATION_STATE.isGenerating = false;
        GENERATION_STATE.currentStep = 0;
        GENERATION_STATE.shouldDrawHighlights = false;
        GENERATION_STATE.playSpeedDivider = 1; // Reset to default divider
        this.clearHighlights();
        this.pause();
        GENERATION_STATE.generationStepCount = 0;  // Reset the generation step counter
        
    }
}

export const generationProcessVisualiser = new GenerationProcessVisualiser(); 