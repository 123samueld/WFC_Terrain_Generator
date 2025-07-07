# WFC Terrain Generator & Map Editor

## About This Project

This project began as an experimental implementation of the Wave Function Collapse (WFC) formula for procedural terrain generation. However, it ended up as a semi-comprehensive **map editor with generative capabilities** that serves as the foundation for a larger game development pipeline.

### Project Evolution

**Phase 1/3 - Map Editor Foundation**
- Started as a WFC terrain generation experiment
- Morphed into a multi-featured map editor with:
  - Isometric terrain tile placement
  - Building and infrastructure system basics
  - River and water flow mechanic basics
  - Real-time terrain visualisation
  - WFC-based procedural generation with random collpase rules
- This map editor will be revisited ad hoc as Phase 2 requires additional features

**Phase 2/3 - Build a Game**
- Graphics Rendering
- Pathfinding
- Interactin Model
- Basic AI "brain" modules
- Basic online multiplayer system


**Phase 3/3 - Machine Learning Enemy AI**
- Machine Learning on GPUs
- AI Model integration

## Features

### Current Map Editor Features
- **Terrain System**: Isometric tile-based terrain with multiple tile types
- **Building System**: Power plants, factories, habitation blocks, and more
- **Infrastructure**: Roads, train tracks, power lines, and pipes 
- **Water System**: Rivers, lakes, bridges with basic flow mechanics
- **WFC Generation**: Procedural terrain generation using Wave Function Collapse
- **Real-time Editing**: Live terrain modification and visualisation

### WFC Implementation
- Basic Wave Function Collapse for terrain generation
- Superposition management and constraint propagation
- Visual generation process with step-by-step animation
- Weight adjustment system for fine-tuning generation

## Getting Started

### Prerequisites
- A modern web browser (only tested in Brave)
- A local web server (required for loading assets)

### Installation & Setup

1. **Download the Project**
   ```bash
   git clone https://github.com/yourusername/WFC_Terrain_Generator.git
   cd WFC_Terrain_Generator
   ```

2. **Start a Local Server**
   
   **Option A: Using Python (Recommended)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open the Application**
   - Open your web browser
   - Navigate to `http://localhost:8000`
   - The application should load automatically

### Why a Local Server?

This project requires a local web server because it loads external assets (images, sprites) and uses JavaScript modules. Opening `index.html` directly in a browser will result in CORS errors and the application won't function properly.

## Usage

### Basic Controls
- **B Key**: Toggle build menu
- **Mouse Wheel**: Cycle through tile variants
- **Left Click**: Place tiles
- **Right Click**: Deselect current tile
- **Arrow Keys**: Camera movement
- **Mouse**: Hover to see tile placement preview

### Menu Navigation
- **Build Options**: Access terrain tiles, buildings, and infrastructure
- **Generate Options**: Use WFC to generate terrain procedurally
- **Visualize Process**: Watch the WFC algorithm work step-by-step

### Terrain Types
- **Buildings**: Power plants, factories, habitation blocks
- **Infrastructure**: Roads, train tracks, power lines, pipes
- **Water**: Rivers, lakes, bridges with flow mechanics
- **Landscape**: Various terrain tiles and decorative elements

## More Info

### YouTube Channel
There's some supplamental info about this project on my youtube channel:
- [The Emperors Armoury](https://www.youtube.com/@armoriumimperatoris)


**Note**: This is map editor is Phase 1/3. Features will be updated as and when Phase 2 requires it.
