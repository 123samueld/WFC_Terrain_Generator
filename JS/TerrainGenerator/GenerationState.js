// GenerationState.js

class GenerationState {
    constructor() {
        // Cell tracking state
        this.currentCell = null;
        this.neighbourCells = new Set();
        this.currentNeighbor = null;  // Track which neighbor we're currently processing
        this.highlightedCells = new Set();
        this.neighborIndices = [];  // Store raw neighbor indices

        // Generation state
        this.isGenerating = false;
        this.shouldDrawHighlights = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.generationStepCount = 0;  // Track number of generation steps

        //WFC State Tracking
        this.superpositionTiles = new Map();  // Set of possible tile types
        this.collapsedTiles = new Set();  // Cells that have been collapsed to a single tile
        this.setTiles = new Set();        // Cells that are collapsed AND all neighbors are collapsed
        this.untouchedTiles = new Set();  // Cells that haven't been processed yet
        this.neighbourCells = new Set();  // Set of neighbour cells

        // Visualization State Tracking
        this.lastUpdatedCell = null;  // Track which cell was last updated
        this.currentNeighborTerrainTypes = new Set();  // Track terrain types for current neighbor



        // Playback state
        this.nextStep = false;
        this.playSpeed = 200; // Base speed in milliseconds
        this.playSpeedDivider = 1; // Default to middle speed (1-5)
        this.isPlaying = false;
        this.playInterval = null;

        // Step tracking state
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
    }
}

// Export a singleton instance
export const GENERATION_STATE = new GenerationState();

