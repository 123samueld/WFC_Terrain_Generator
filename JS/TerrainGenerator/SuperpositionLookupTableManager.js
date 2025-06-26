/* 
    Superposition Lookup Table Manager - The lookup table is a CSV file, this manager handles the translation of the CSV for WFC.
    Better to edit the lookup talbe in a spreadsheet program.
    The rows are the tile types, columns are the direction of neighbours and the array stored at a cell are legitimate superposition tile types.
*/

    /*Direction column spreadsheet key*/
    // A= North
    // B = North East
    // C = East
    // D = South East
    // E = South
    // F = South West
    // G = West
    // H = North West

    /*Tile type row spreadsheet key*/
    // 1 = Power_Plant
    // 2 = Factorum
    // 3 = Chemical_Plant
    // 4 = Train_Station
    // 5 = Promethium_Refinery
    // 6 = Hab_Block    

    // 7 = Road_Cross
    // 8 = Road_Straight_Latitude
    // 9 = Road_Straight_Longitude
    // 10 = Road_L_Curve_Top_Left
    // 11 = Road_L_Curve_Top_Right
    // 12 = Road_L_Curve_Bottom_Left
    // 13 = Road_L_Curve_Bottom_Right
    // 14 = Road_Diagonal_Top_Left
    // 15 = Road_Diagonal_Top_Right
    // 16 = Road_Diagonal_Bottom_Left
    // 17 = Road_Diagonal_Bottom_Right
    // 18 = Road_T_Junction_Top
    // 19 = Road_T_Junction_Right
    // 20 = Road_T_Junction_Bottom
    // 21 = Road_T_Junction_Left

    // 22 = Lake_Middle
    // 23 = Lake_Bank_North
    // 25 = Lake_Bank_North_East
    // 26 = Lake_Bank_East
    // 27 = Lake_Bank_South_East
    // 28 = Lake_Bank_South
    // 29 = Lake_Bank_South_West
    // 30 = Lake_Bank_West
    // 31 = Lake_Bank_North_West

    // 32 = River_NS
    // 33 = River_SN
    // 34 = River_WE
    // 35 = River_EW
    // 36 = River_NE
    // 37 = River_NW
    // 38 = River_SE

    // 39 = Bridge_NS
    // 40 = Bridge_SN
    // 41 = Bridge_WE
    // 42 = Bridge_EW
    // 43 = Bridge_NE
    // 44 = Bridge_NW
    // 45 = Bridge_SE

// Import CSV and convert to 3D array
export async function loadSuperpositionLookupTable() {
    try {
        const response = await fetch('./JS/TerrainGenerator/SuperpositionLookupTable.csv');
        const csvText = await response.text();
        
        
        // Parse CSV into 3D array - maintain all row positions
        const lines = csvText.split('\n');
        const lookupTable = []; // 3D array: [row][column][cell_array]
        
        
        for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
            const line = lines[rowIndex];
            console.log(`Processing line ${rowIndex + 1}: "${line}"`);
            
            // Split by comma and handle quoted values properly
            const cells = [];
            let currentCell = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    cells.push(currentCell.trim());
                    currentCell = '';
                } else {
                    currentCell += char;
                }
            }
            cells.push(currentCell.trim()); // Add the last cell
                       
            const row = [];
            
            // Ensure we have exactly 8 columns (A-H directions)
            for (let colIndex = 0; colIndex < 8; colIndex++) {
                const cell = cells[colIndex] || '';
                let cellArray = [];
                
                if (cell && cell !== '') {
                    // Parse array format like "[22, 27]"
                    if (cell.startsWith('[') && cell.endsWith(']')) {
                        const arrayContent = cell.slice(1, -1);
                        cellArray = arrayContent.split(',').map(n => parseInt(n.trim()));
                        console.log(`Row ${rowIndex + 1}, Col ${colIndex + 1}: [${cellArray.join(', ')}]`);
                    }
                }
                
                row.push(cellArray);
            }
            
            // Always add the row to maintain position mapping
            lookupTable.push(row);
        }
        
        return lookupTable;
    } catch (error) {
        console.error('Error loading SuperpositionLookupTable.csv:', error);
        return [];
    }
}

// Global variable to store the loaded lookup table
let superpositionLookupTable = null;

// Function to set the loaded lookup table
export function setSuperpositionLookupTable(table) {
    superpositionLookupTable = table;
}

// Function to lookup valid neighbor types for a given cell type and direction
export function lookupSuperpositionNeighbours(currentCellType, neighborDirection) {
    if (!superpositionLookupTable) {
        console.warn('Superposition Lookup Table not loaded');
        return [];
    }
    
    // Convert direction to column index (A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7)
    const directionToColumn = {
        'north': 0,      // A
        'north-east': 1, // B
        'east': 2,       // C
        'south-east': 3, // D
        'south': 4,      // E
        'south-west': 5, // F
        'west': 6,       // G
        'north-west': 7  // H
    };
    
    const columnIndex = directionToColumn[neighborDirection.toLowerCase()];
    if (columnIndex === undefined) {
        console.warn(`Invalid direction: ${neighborDirection}`);
        return [];
    }
    
    // Convert current cell type to row index
    // This mapping is based on the tile type row spreadsheet key in the comments
    const tileTypeToRow = {
        // Buildings (1-6)
        'Power_Plant': 1,
        'Factorum': 2,
        'Chemical_Plant': 3,
        'Train_Station': 4,
        'Promethium_Refinery': 5,
        'Hab_Block': 6,
        
        // Roads (7-21)
        'Road_Cross': 7,
        'Road_Straight_Latitude': 8,
        'Road_Straight_Longitude': 9,
        'Road_L_Curve_Top_Left': 10,
        'Road_L_Curve_Top_Right': 11,
        'Road_L_Curve_Bottom_Left': 12,
        'Road_L_Curve_Bottom_Right': 13,
        'Road_Diagonal_Top_Left': 14,
        'Road_Diagonal_Top_Right': 15,
        'Road_Diagonal_Bottom_Left': 16,
        'Road_Diagonal_Bottom_Right': 17,
        'Road_T_Junction_Top': 18,
        'Road_T_Junction_Right': 19,
        'Road_T_Junction_Bottom': 20,
        'Road_T_Junction_Left': 21,
        
        // Lakes (22-31)
        'Lake_Middle': 22,
        'Lake_Bank_North': 23,
        'Lake_Bank_North_East': 25,
        'Lake_Bank_East': 26,
        'Lake_Bank_South_East': 27,
        'Lake_Bank_South': 28,
        'Lake_Bank_South_West': 29,
        'Lake_Bank_West': 30,
        'Lake_Bank_North_West': 31,
        
        // Rivers (32-38)
        'River_NS': 32,
        'River_SN': 33,
        'River_WE': 34,
        'River_EW': 35,
        'River_NE': 36,
        'River_NW': 37,
        'River_SE': 38,
        
        // Bridges (39-45)
        'Bridge_NS': 39,
        'Bridge_SN': 40,
        'Bridge_WE': 41,
        'Bridge_EW': 42,
        'Bridge_NE': 43,
        'Bridge_NW': 44,
        'Bridge_SE': 45
    };
    
    const rowIndex = tileTypeToRow[currentCellType];
    if (rowIndex === undefined) {
        console.warn(`Unknown tile type: ${currentCellType}`);
        return [];
    }
    
    // Get the valid neighbor types from the lookup table
    if (superpositionLookupTable[rowIndex] && superpositionLookupTable[rowIndex][columnIndex]) {
        const validNeighbors = superpositionLookupTable[rowIndex][columnIndex];
        console.log(`Lookup result for ${currentCellType} -> ${neighborDirection}: [${validNeighbors.join(', ')}]`);
        return validNeighbors;
    } else {
        console.warn(`No data found for ${currentCellType} -> ${neighborDirection} (row ${rowIndex}, col ${columnIndex})`);
        return [];
    }
}