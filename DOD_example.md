# Data-Oriented Design: Car Brake System Example

## Component Storage

```plaintext
Struct Cars {
    int[]    IDs;           // 4 bytes each
    Color[]  Colours;       // 8 bytes each
    byte[]   Wheels;        // 1 byte each
    float[]  BrakeForces;   // 2 bytes each
    float[]  Velocities;    // 8 bytes each
    bool[]   IsBraking;     // 1 bit each
}
```

## Compact Working Set for System

```plaintext
Struct BrakingCars {
    float[] Velocities;
    float[] BrakeForces;
    int[]   OriginalIDs;    // used to write back results
}
```

## Helper Function to Extract Compact Data

```plaintext
Function extractBrakingComponents(Cars cars) -> BrakingCars {
    BrakingCars result;
    for (int i = 0; i < cars.IDs.length; i++) {
        if (cars.IsBraking[i]) {
            result.Velocities.push(cars.Velocities[i]);
            result.BrakeForces.push(cars.BrakeForces[i]);
            result.OriginalIDs.push(i);
        }
    }
    return result;
}
```

## Brake System

```plaintext
Function ApplyBrakes(float[] velocities, float[] brakeForces) {
    for (int i = 0; i < velocities.length; i++) {
        velocities[i] -= brakeForces[i];
    }
}
```

## Write Results Back

```plaintext
Function WriteVelocitiesBack(Cars cars, BrakingCars braking) {
    for (int i = 0; i < braking.OriginalIDs.length; i++) {
        int id = braking.OriginalIDs[i];
        cars.Velocities[id] = braking.Velocities[i];
    }
}
```

## Example Usage

```plaintext
Cars cars = {
    IDs:         [0, 1, 2, 3],
    Colours:     [Red, Blue, Green, Yellow],
    Wheels:      [4, 4, 3, 4],
    BrakeForces: [2.0, 1.6, 2.2, 1.8],
    Velocities:  [70.0, 50.0, 60.0, 80.0],
    IsBraking:   [true, true, false, true]
};

// Pipeline:
BrakingCars braking = extractBrakingComponents(cars);
ApplyBrakes(braking.Velocities, braking.BrakeForces);
WriteVelocitiesBack(cars, braking);
```
