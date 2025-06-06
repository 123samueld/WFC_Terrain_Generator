import { MATH, TERRAIN_GENERATOR, INITIALISE, COLLAPSE_RULES, TERRAIN_TILE } from '../FilePathRouter.js';
import { options } from '../Options.js';

class GenerationProcessVisualiser {
    constructor() {
        this.currentCell = null;
        this.neighbourCells = new Set();
        this.currentNeighbor = null;  // Track which neighbor we're currently processing
        this.highlightedCells = new Set();
        this.nextStep = false;
        this.playSpeed = 500;
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.shouldDrawHighlights = false;
        this.playInterval = null;
        this.isGenerating = false;
        this.neighborIndices = [];  // Store raw neighbor indices
        this.generationStepCount = 0;  // Track number of generation steps
        
        // Add state tracking
        this.StepType = {
            FINDING_CELL: 'finding_cell',
            PROCESSING_NEIGHBOR: 'processing_neighbor'
        };
        this.currentStepType = this.StepType.FINDING_CELL;
        this.stepState = {
            type: this.StepType.FINDING_CELL,
            currentCell: null,
            currentNeighbor: null,
            stepNumber: 0
        };

        // Add pulsing effect properties
        this.pulseStartTime = Date.now();
        this.pulseSpeed = 6; // Speed of the pulse
        this.pulseMinOpacity = 0.3;
        this.pulseMaxOpacity = 0.8;
        this.pulseMinWidth = 3;
        this.pulseMaxWidth = 5;
    }

    setCurrentCell(x, y) {
        this.currentCell = { x, y };
    }

    setNeighbourCells(cells) {
        this.neighbourCells = cells;
    }

    clearHighlights() {
        this.currentCell = null;
        this.neighbourCells = new Set();
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
        if (!this.shouldDrawHighlights || !this.currentCell) return;

        const { x, y } = this.currentCell;
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
    }

    highlightNeighbourCells(ctx, camera) {
        if (!this.shouldDrawHighlights || !this.neighbourCells.size) return;

        this.neighbourCells.forEach(cell => {
            const drawX = cell.x + 1;  // Add +1 offset only for drawing
            const isoCoords = MATH.cartesianToIsometric(drawX, cell.y);
            const screenX = ctx.canvas.width / 2 + isoCoords.x - camera.x;
            const screenY = ctx.canvas.height / 2 + isoCoords.y - camera.y;

            // If this is the current neighbor being processed, use pulsing yellow
            if (this.currentNeighbor && this.currentNeighbor.x === cell.x && this.currentNeighbor.y === cell.y) {
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
            if (this.currentNeighbor && this.currentNeighbor.x === cell.x && this.currentNeighbor.y === cell.y) {
                this.drawCornerPoints(ctx, screenX, screenY);
            }
        });
    }

    draw(ctx, camera) {
        if (!this.shouldDrawHighlights) return;
        
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
        TERRAIN_GENERATOR.initialize();
        this.isGenerating = true;
        this.shouldDrawHighlights = true;
        this.currentStep = 1;
        this.generationStepCount = 1;
        
        // Get the cell index and convert to x,y coordinates
        const cellIndex = TERRAIN_GENERATOR.findLowestEntropyCell();
        if (cellIndex !== null) {
            const x = cellIndex % 36;
            const y = Math.floor(cellIndex / 36) % 36;
            this.currentCell = { x, y };
            
            // Center camera on the initial cell
            this.centerCameraOnCell(x, y);
            
            // Initialize step state
            this.stepState = {
                type: this.StepType.FINDING_CELL,
                currentCell: { x, y },
                currentNeighbor: null,
                stepNumber: 1
            };
            
            // Get and store neighbors for processing
            this.neighborIndices = TERRAIN_GENERATOR.getNeighbourCells(cellIndex);
            
            // Convert neighbor indices to coordinates and store them
            this.neighbourCells = new Set();
            this.neighborIndices.forEach(index => {
                if (index !== null) {
                    const nx = index % 36;
                    const ny = Math.floor(index / 36) % 36;
                    this.neighbourCells.add({ x: nx, y: ny });
                }
            });
            
            // Start with the first neighbor
            if (this.neighbourCells.size > 0) {
                this.currentNeighbor = Array.from(this.neighbourCells)[0];
                this.currentStepType = this.StepType.PROCESSING_NEIGHBOR;
                
                // Update step state for neighbor processing
                this.stepState = {
                    type: this.StepType.PROCESSING_NEIGHBOR,
                    currentCell: { x, y },
                    currentNeighbor: this.currentNeighbor,
                    stepNumber: 1
                };
            } else {
                this.currentNeighbor = null;
            }
        }
        
        return true;
    }

    // Step-by-step generation for visualization
    generateStepVisualisation() {
        this.generationStepCount++;
        this.stepState.stepNumber = this.generationStepCount;

        // Check if we're done
        if (TERRAIN_GENERATOR.superPositionTileSetEmpty()) {
            this.isGenerating = false;
            return false;
        }

        // If we don't have a current cell, find the next one (Step 1, 4, 7, etc.)
        if (!this.currentCell) {
            this.currentStepType = this.StepType.FINDING_CELL;
            
            // Find the cell with lowest entropy
            let cellIndex = TERRAIN_GENERATOR.findLowestEntropyCell();
            if (cellIndex === null) {
                this.isGenerating = false;
                return false;
            }

            // Convert index to x,y coordinates
            const x = cellIndex % 36;
            const y = Math.floor(cellIndex / 36) % 36;
            this.currentCell = { x, y };
            
            // Center camera on the new cell
            this.centerCameraOnCell(x, y);
            
            // Get and store neighbors for processing
            this.neighborIndices = TERRAIN_GENERATOR.getNeighbourCells(cellIndex);
            
            // Convert neighbor indices to coordinates and store them
            this.neighbourCells = new Set();
            this.neighborIndices.forEach(index => {
                if (index !== null) {
                    const nx = index % 36;
                    const ny = Math.floor(index / 36) % 36;
                    this.neighbourCells.add({ x: nx, y: ny });
                }
            });

            // Analyze socket configuration for visualization
            const socketConfig = COLLAPSE_RULES.analyseCellSockets(cellIndex, TERRAIN_TILE.terrainTiles, TERRAIN_GENERATOR.grid, TERRAIN_GENERATOR.gridSize);
            if (socketConfig) {
                console.log("Socket configuration:", socketConfig);
            }

            // Update step state
            this.stepState = {
                type: this.StepType.FINDING_CELL,
                currentCell: { x, y },
                currentNeighbor: null,
                stepNumber: this.generationStepCount
            };
            
            // Start with the first neighbor
            if (this.neighbourCells.size > 0) {
                this.currentNeighbor = Array.from(this.neighbourCells)[0];
                this.currentStepType = this.StepType.PROCESSING_NEIGHBOR;
                
                // Update step state for neighbor processing
                this.stepState = {
                    type: this.StepType.PROCESSING_NEIGHBOR,
                    currentCell: { x, y },
                    currentNeighbor: this.currentNeighbor,
                    stepNumber: this.generationStepCount
                };
            } else {
                this.currentNeighbor = null;
            }

            this.currentStep++;
            return true;
        }

        // If we have a current cell, process its neighbors one by one (Step 2, 3, 5, 6, etc.)
        if (this.currentNeighbor) {
            this.currentStepType = this.StepType.PROCESSING_NEIGHBOR;
            
            // Process current neighbor
            const neighborIndex = this.currentNeighbor.y * 36 + this.currentNeighbor.x;
            
            // Move to next neighbor
            const neighbors = Array.from(this.neighbourCells);
            const currentIndex = neighbors.findIndex(n => 
                n.x === this.currentNeighbor.x && n.y === this.currentNeighbor.y);
            
            if (currentIndex < neighbors.length - 1) {
                this.currentNeighbor = neighbors[currentIndex + 1];
                
                // Update step state for next neighbor
                this.stepState = {
                    type: this.StepType.PROCESSING_NEIGHBOR,
                    currentCell: this.currentCell,
                    currentNeighbor: this.currentNeighbor,
                    stepNumber: this.generationStepCount
                };
            } else {
                // All neighbors processed, process the complete step
                const cellIndex = this.currentCell.y * 36 + this.currentCell.x;
                TERRAIN_GENERATOR.processStep(cellIndex);
                
                // Clear everything for next step
                this.currentCell = null;
                this.currentNeighbor = null;
                this.neighbourCells.clear();
                this.neighborIndices = [];
                this.currentStepType = this.StepType.FINDING_CELL;
                
                // Update step state for finding next cell
                this.stepState = {
                    type: this.StepType.FINDING_CELL,
                    currentCell: null,
                    currentNeighbor: null,
                    stepNumber: this.generationStepCount
                };
            }
            
            this.currentStep++;
            return true;
        }

        return false;
    }

    // Control methods
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldDrawHighlights = true;
        
        // Start the play interval
        this.playInterval = setInterval(() => {
            if (!this.generateStepVisualisation()) {
                this.pause();
            }
        }, this.playSpeed);
    }

    pause() {
        this.isPlaying = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    stepForward() {
        if (this.isPlaying) return false;
        
        this.shouldDrawHighlights = true;
    
        // If this is the first step, run initialization
        if (this.currentStep === 0) {
            return this.firstStep();
        }
        
        return this.generateStepVisualisation();
    }

    stepBack() {
        if (this.isPlaying) return;
        
        // Try to step back in WFC state
        if (TERRAIN_GENERATOR.stepBack()) {
            // Update visualization state
            this.generationStepCount--;
            
            // Clear current state
            this.currentCell = null;
            this.currentNeighbor = null;
            this.neighbourCells.clear();
            this.neighborIndices = [];
            
            // Update step state
            this.stepState = {
                type: this.StepType.FINDING_CELL,
                currentCell: null,
                currentNeighbor: null,
                stepNumber: this.generationStepCount
            };
            
            // Keep visualization active
            this.shouldDrawHighlights = true;
            this.isGenerating = true;
        }
    }

    setPlaySpeed(speed) {
        this.playSpeed = speed;
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }

    reset() {
        this.isGenerating = false;
        this.currentStep = 0;
        this.shouldDrawHighlights = false;
        this.clearHighlights();
        this.pause();
        this.generationStepCount = 0;  // Reset the generation step counter
    }
}

export const generationProcessVisualiser = new GenerationProcessVisualiser(); 