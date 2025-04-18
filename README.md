# Sand Sim 3000

Building a decent RTS game engine has become a bit of an obsession. One of the most challenging aspects of an RTS engine, in my opinion, is handling a very large number of dynamic objects in real time. A sand simulator, although far simpler than a full RTS engine, is a good playground to practise building an engine capable of efficiently handling many dynamic objects in real time. This is my third attempt at a sand simulator, and this one got much closer to success than previous attempts.

## 💡 Goals

- Architecture should follow Data-Oriented Design (DOD) principles.
- Explore Entity Component System (ECS) design patterns in a particle-based simulation.
- Use partitioning (chunks) for neighbour queries as a basic spatial accelerator.
- Maintain performance with thousands of entities via `structs of arrays` layout.
- Simulate thousands of particle physics interactions in real time without dropping the frame rate too badly (~30fps).

## ⚙️ Key Features Implemented

- **DOD-friendly architecture** to efficiently handle thousands of moving particles in real time.
- **ECS principles** with decoupled `ParticleComponents`.
- **Chunk-based spatial acceleration** (`SpatialAccelerator.js`) to limit neighbour checks to local regions.
- **Profiler and Renderer modules** for debug visuals and frame rate tracking.
- `simulateSand()` function that checks neighbours and updates vertical movement.

## 🧪 Optimisations Attempted

- **Component-based architecture** for cache-friendly iteration over particle state.
- **Chunk grid division** to reduce the number of neighbour checks.
- **Moving Particles Array** to reduce the number of particles iterated over each frame.

## ❌ Critical Design Mistakes

Despite working features, the simulation fails under realistic conditions due to some critical architectural mistakes:

1. **Temporal misalignment (ECS iteration vs spatial order):**
   - ECS processes particles in ID or insertion order.
   - For falling sand, particles must be processed *bottom-up* to simulate realistic stacking.
   - This leads to higher particles "falling through" lower ones because they are updated after the particle above them.

2. **Lack of a unified grid authority:**
   - Sand simulations are strictly cellular automata — the simulation domain *is* the grid.
   - Treating particles as floating entities without exclusive spatial ownership results in overlaps, misstacking, and non-deterministic behaviour.

3. **No atomic movement:**
   - Without a grid to lock movement, multiple particles may move into the same location.
   - This breaks the rules of classic sand behaviour (one particle per cell).

## 📉 Result

While the DOD pattern was a valuable learning experiment, the design was fundamentally flawed in its attempt to use ECS with the strict grid-local, atomic movement rules required for a true sand simulation.

The project is being wrapped up as a failed-but-educational prototype.

## 🧠 Lessons Learned

- A cellular automaton simulation (like a sand sim) must operate on a grid-based system.
- ECS is a potential solution but must **adhere to spatial grid coordinates**.
- Chunks are a basic but helpful spatial accelerator and greatly increased performance.

## 🔮 Future Directions

Should this be revisited:
- Use a strict bottom-up, left-right update pass to enforce natural physics.
- Consider ECS as a way of handling a 2D grid with DOD-friendly principles.
- Use spatial acceleration again — this feature worked well.

---

🛠️ *This project was a playground for mass particle physics exploration — not a final product. It served its purpose of practising DOD architecture.*
