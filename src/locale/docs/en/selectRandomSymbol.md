**Select Random Symbol** is a **modifier-type node** used to transform a **Symbolic Pool** (composed of text values) into a **simple list containing only one value per simulation**, selected randomly. Its main function is to filter the multiple values within a symbolic pool into a single representative result per simulation while preserving randomness.

- **Type:** Modifier (intermediate node)
- **Function:** Randomly selects one value per simulation from a symbolic pool
- **Output:** Simple list of symbolic (text) values

---

## **Properties**

### **Node ID**

- **Type:** Text
- **Default:** Random ID
- **Function:** Unique identifier for the node

### **Status**

- **Type:** `Finished` | `Idle` | `Error` | `Loading` | `Missing Data`
- **Default:** `Idle`
- **Function:** Indicates the current state of the node

### **Name**

- **Type:** Text
- **Default:** Select Random Symbol
- **Function:** Name displayed in the modeling board

---

## **Usage Example**

**Scenario:** In a card game, a player receives 3 random cards from a symbolic pool containing "Sword", "Shield", and "Potion". For each simulation, only **one of the symbols** is randomly selected as the main action.

### **1. Symbolic Generator Node Properties:**

- Possible values: `"Sword"`, `"Shield"`, `"Potion"`

### **2. Symbolic Pool Node Properties:**

- Quantity: `3`

### **3. Connections:**

- Connect the **Symbolic Generator** to the **Symbolic Pool** node
- Connect the **Symbolic Pool** node to the **Select Random Symbol** node
- Connect the **Select Random Symbol** node to the **Histogram** node

<img src="/node-crafter/doc-images/select-random-symbol.png" alt="Example usage of the Select Random Symbol node" width="500px"/>

---

## **Notes**

- Ideal for situations where multiple symbolic elements are generated in a **pool**, but only **one should be randomly selected**.
- Can represent effects like "drawing a card", "choosing a random action", or "picking an item from a backpack".
- Only works with **Symbolic Pool** inputs.
- It is a way to convert a symbolic pool into a simple list, enabling compatibility with nodes that **do not support pool-type inputs**.
