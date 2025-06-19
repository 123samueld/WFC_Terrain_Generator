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
                id: "currentCell",
                label: "Current Cell",
                value: 0
            },
            {
                id: "currentNeighbour",
                label: "Current Neighbour",
                value: 0
            },
            {
                id: "neighbourCells",
                label: "Neighbour Cells",
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
                rows: 4,
                cols: 4,
                cells: Array(16).fill(null).map((_, index) => ({
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