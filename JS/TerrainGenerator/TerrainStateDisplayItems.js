export const terrainStateDisplayItems = {
    wfc: {
        title: "WFC Generation State",
        items: [
            {
                id: "currentStep",
                label: "Current Step",
                value: 0
            },
            {
                id: "collapsedTiles",
                label: "Collapsed Tiles",
                value: 0
            },
            {
                id: "superpositionTiles",
                label: "Superposition Tiles",
                value: 0
            },
            {
                id: "setTiles",
                label: "Set Tiles",
                value: 0
            },
            {
                id: "historyIndex",
                label: "History Index",
                value: 0
            },
            {
                id: "historyLength",
                label: "History Length",
                value: 0
            }
        ],
        potentialNeighbors: {
            title: "Potential Neighbors",
            grid: {
                rows: 3,
                cols: 4,
                cells: Array(12).fill(null).map((_, index) => ({
                    id: `neighbor${index}`,
                    value: null
                }))
            }
        }
    },
    // Add more display types here as needed
    // Example:
    // noise: {
    //     title: "Noise Generation State",
    //     items: [
    //         {
    //             id: "octaves",
    //             label: "Octaves",
    //             value: 0
    //         },
    //         {
    //             id: "persistence",
    //             label: "Persistence",
    //             value: 0
    //         }
    //     ]
    // }
}; 