# TODO.md – Wave Function Collapse Terrain Generator

## ✅ Project Setup
- [x] Setup `Main.js` for application loop
- [x] Setup `Initialise.js` to configure canvas and initial state
- [x] Setup `Input.js` to capture user input (keyboard/mouse)
- [x] Setup `Simulation.js` for game state updates
- [x] Setup `Rendering.js` to draw to canvas
- [x] Setup `Profiling_Tools.js` for FPS or performance metrics

---

## 🧩 Simulation
- [ ] Define tile schema (IDs, edge constraints, weights)
- [ ] Build adjacency rules (which edges match)
- [ ] Initialize grid: each cell holds all possible tiles
- [ ] Calculate initial entropy for every cell
- [ ] Loop until all cells are collapsed:
  - [ ] Pick the non‑collapsed cell with lowest entropy
  - [ ] Collapse it: randomly select one tile (respecting weights)
  - [ ] Propagate constraints: prune incompatible tiles from neighbors
  - [ ] Recompute entropy for affected cells
  - [ ] Check for contradictions and handle (e.g. backtrack or reset)


---

## 🎨 Terrain Sprites
- [x] Create Cartesian and Isometric terrain sprites.
- [x] Save sprites in a `/assets/terrain_sprites/` folder
- [ ] Implement sprite loading logic in `Initialise.js`
- [ ] Map tile types to specific sprite images

---

## 🖼️ Rendering
- [ ] Map Scroll and Occlusion Culling
- [ ] Display generation process
- [ ] Cartesian to Isometric conversion, Vector-Matrix transformation

---

## 🧪 User Input
- [ ] Add controls to reset or regenerate terrain
- [ ] Add mouse support to "lock" certain tiles before collapse

---

## 🛠️ Debugging and Visualization Tools

---

## 🧹 Polish and UX
- [ ] UI elements (buttons, dropdowns) for tile sets and generation control
- [ ] Export generated terrain as image or JSON

---

## 🌱 Stretch Goals
- [ ] Support multiple tile sets/themes (urban, suburbs, industrial, wasteland)
- [ ] Implement weighted constraints for increased complexity in randomness/constraints
