# Sand Sim 3000

Building a decent RTS game engine has become a bit of an obsession. One of the most challenging aspects of an RTS engine, in my opinion, is handling a very large number of dynamic objects in real time. A sand simulator, although far more simple than a full RTS, is a good playground to practice building an engine capable of efficiently handling masses dynamic objects in real time. This is my third attempt at building a falling sand simulator. This attempt got much closer to success than previous attempt, although it still fell short due to 2 critical mistakes it's my current best attempt at managing large masses of dynamic objects.
## 💡 Goals

- Architecture should follow Data-Oriented Design (DOD) principles.
- Explore Entity Component System (ECS) `structs of arrays` design patterns in a particle-based simulation.
- Use partitioning (chunks) for neighbour queries as a basic spatial accelerator.
- Simulate thousands of particle physics interactions in real time without dropping the frame rate too badly (~30fps).
- Create some profiling tools to accuratley visualise features.

## ⚙️ Key Features Implemented

- **DOD-friendly architecture** to efficiently handle thousands of moving particles in real time.
- **ECS principles** with decoupled `ParticleComponents`.
- **Chunk-based spatial acceleration** (`SpatialAccelerator.js`) to limit neighbour checks to local regions.
- **Profiler and Renderer modules** for debug visuals and frame rate tracking.
- `simulateSand()` function that checks neighbours and updates vertical movement.

## 🧪 Optimisations Attempted

- **Component-based architecture** for cache-friendly iteration over Particle Entities.
- **Chunk grid division** to reduce the number of neighbour checks.
- **Moving Particles Array** to reduce the number of particles iterated over each frame.

## ❌ Critical Design Mistakes

Despite working features, the simulation fails under realistic conditions due to some critical architectural mistakes:

1. **Temporal misalignment:**
   - ECS processes particles in ID or insertion order.
   - For falling sand, particles must be processed *bottom-up* to simulate realistic stacking.
   - Particles were not iterated through in *bottom-up* order but in the array insertion order. The result was some higher particles "fall through" lower ones because they are updated after the particle below them, as well as some other undesirable interactions.
   - Entities misaligned with the order of the simulation grid breaks the ability to process particles in the required order: bottom-up.

2. **Lack of a unified grid authority:**
   - Sand simulations are strictly cellular automata — the simulation domain *is* the grid.
   - Treating particles as floating Entities without exclusive, descreet spatial ownership results in overlaps and misstacking.
   - A grid type structure must be maintained to create emergent behavior among the particles.


## 📉 Result

While the DOD pattern was a valuable learning experiment, the design was fundamentally flawed in its attempt to use ECS with the strict grid-local, atomic movement rules required for a true sand simulation.

The project is being wrapped up as a failed-but-educational prototype.

## 🧠 Lessons Learned

- A cellular automaton simulation (like a sand sim) must operate on a grid-based system.
- ECS is a potential solution but must **adhere to spatial grid coordinates**.
- Chunks are a basic but good spatial accelerator and greatly increased performance.

## 🔮 Future Directions

Should this be revisited:
- Use a strict bottom-up update pass to enforce natural physics.
- Consider ECS as a way of handling a 2D (flattened to 1D) grid with DOD-friendly principles.
- Use spatial acceleration again — this feature worked well.
- For C++ version, use a bit map to chart cells that need updated and push them to their own array each simulation loop cycle. This should help with efficient grid traversal and DOD-friendly cache locality

---

🛠️ *This project was a playground for mass particle physics exploration — not a final product. It served its purpose of practising DOD architecture.*
