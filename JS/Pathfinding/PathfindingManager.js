// PathfindingManager.js
import { GENERATION_STATE } from '../FilePathRouter.js';

class PathfindingManager {
    constructor() {
        // Initialize any class properties here
        this.isInitialized = false;
        this.pathfindingGrid = null;
    }

    // Placeholder method to test after WFC initialization
    testAfterWFCInitialization() {
        return 1;
    }


}

// Export a singleton instance
export const PATHFINDING_MANAGER = new PathfindingManager(); 