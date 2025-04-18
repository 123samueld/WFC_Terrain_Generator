# Sand Sim 3000 

A falling sand simulation implemented in JavaScript using an **Entity-Component-System (ECS)** architecture, inspired by cellular automata and classic particle physics sand games.

## 💡 Goals

- Architecture should follow Data Oriented Design (DOD) principles.
- Explore Entity Component System (ECS) design patterns in a particle-based simulation.
- Use partitioning (chunks) for neighbor queries as a basic spatial accelerator.
- Maintain performance with thousands of entities via `structs of arrays` layout.
- Simulate sand-like physics: falling, stacking, sliding, crumbling.

## ⚙️ Key Features Implemented

- **DOD friendly architecture** to efficiently handle thousands of moving particles in real time.
- **ECS principles** with decoupled `ParticleComponents`.
- **Chunk-based spatial acceleration** (`SpatialAccelerator.js`) to limit neighbor checks to local regions.
- **Profiler and Renderer modules** for debug visuals and frame rate tracking.
- `simulateSand()` function that checks neighbors and updates vertical movement.

## 🧪 Optimizations Attempted

- **Component-based architecture** for cache-friendly iteration over particle state.
- **Chunk grid division** to reduce the number of neighbor checks.
- **Moving Particles Array** to reduce number of particles iterated over each frame.


## ❌ Critical Design Mistakes

Despite working features, the simulation fails under realistic conditions due to some critical architectural mistakes:

1. **Temporal Misalignment (ECS iteration vs spatial order):**
   - ECS processes particles in ID or insertion order.
   - For falling sand, particles must be processed *bottom-up* to simulate realistic stacking.
   - This leads to higher particles "falling through" lower ones because they are updated after particle above them.

2. **Lack of a unified grid authority:**
   - Sand simulations are strictly cellular automata — the simulation domain *is* the grid.
   - Treating particles as floating entities without exclusive spatial ownership results in overlaps, misstacking, and non-deterministic behavior.

3. **No atomic movement:**
   - Without a grid to lock movement, multiple particles may move into the same location.
   - This breaks the rules of classic sand behavior (one particle per cell).

## 📉 Result

While the DOD pattern was a valuable learning experiment, the design was fundamentally flawed in it's attempt to use ECS with the strict grid-local, atomic movement rules required for a true sand simulation.

The project is being wrapped up as a failed-but-educational prototype.

## 🧠 Lessons Learned

- A cellular automita simulation (like a sand sim) must operate on a grid based system
- ECS is a potential solution but must **adhere to spatial grid coordinates**.
- Chunks are a basic but helpful spatial accelerator and greatly increased performance.

## 🔮 Future Directions

Should this be revisited:
- Use a strict bottom-up, left-right update pass to enforce natural physics.
- Consider ECS as a way of handling a 2d grid with DOD friendly principles.
- Use spatial acceleration again, this feature worked well.


---

🛠️ *This project was a playground for ECS exploration — not a final product. It served its purpose by clarifying when ECS is a tool, and when it’s a trap.*

