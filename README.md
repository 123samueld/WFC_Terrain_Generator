# Sand Sim 3000 (ECS Attempt)

A falling sand simulation implemented in JavaScript using an **Entity-Component-System (ECS)** architecture, inspired by cellular automata and classic particle physics sand games.

## 💡 Goals

- Explore ECS design patterns in a particle-based simulation.
- Use spatial partitioning (chunks) for neighbor queries.
- Maintain performance with thousands of entities via `structs of arrays` layout.
- Simulate sand-like physics: falling, stacking, sliding.

## ⚙️ Key Features Implemented

- **ECS architecture** with decoupled `ParticleComponents`.
- **Chunk-based spatial acceleration** (`SpatialAccelerator.js`) to limit neighbor checks to local regions.
- **Profiler and Renderer modules** for debug visuals and frame rate tracking.
- `simulateSand()` function that checks neighbors and updates vertical movement.

## 🧪 Optimizations Attempted

- **Component-based architecture** for cache-friendly iteration over particle state.
- **Chunk grid division** to reduce the number of neighbor checks.
- **Bottom-check logic** to stop particles when blocked below.
- **Down-left and down-right fallback logic** to mimic sliding behavior.
- Tried to keep simulation purely particle-driven (no explicit grid cells).

## ❌ Critical Design Mistakes

Despite working features, the simulation fails under realistic conditions due to a few architectural missteps:

1. **Incorrect update order (ECS iteration vs spatial order):**
   - ECS processes particles in ID or insertion order.
   - For falling sand, particles must be processed *bottom-up* to simulate realistic stacking.
   - This leads to higher particles "falling through" lower ones because they haven't updated yet.

2. **Lack of a unified grid authority:**
   - Sand simulations are strictly cellular automata — the simulation domain *is* the grid.
   - Treating particles as floating entities without exclusive spatial ownership results in overlaps, misstacking, and non-deterministic behavior.

3. **No atomic movement:**
   - Without a grid to lock movement, multiple particles may move into the same location.
   - This breaks the rules of classic sand behavior (one particle per cell).

## 📉 Result

While the ECS pattern was a valuable learning experiment, it proved fundamentally incompatible with the strict grid-local, atomic movement rules required for a true sand simulation.

The project is being wrapped up as a failed-but-educational prototype.

## 🧠 Lessons Learned

- ECS works best when entities are **loosely coupled and spatially independent**.
- For grid-bound phenomena (e.g., sand, fire, Game of Life), a **cell-centric** model is a better fit.
- Simulation correctness often outweighs architectural elegance.

## 🔮 Future Directions

Should this be revisited:
- Consider a pure 2D array (`grid[y][x]`) where each cell holds a particle type.
- ECS can still be used *per cell*, or in hybrid systems (e.g., fluid particles + grid heat maps).
- Use a strict bottom-up, left-right update pass to enforce natural physics.

---

🛠️ *This project was a playground for ECS exploration — not a final product. It served its purpose by clarifying when ECS is a tool, and when it’s a trap.*

