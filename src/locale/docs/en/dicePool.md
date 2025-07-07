**Dice Pool** is a **modifier-type node** used to generate a **numeric pool** from a **numeric generator node input**. It represents multiple simultaneous rolls of the same type of dice and is ideal for systems that require grouping random values, such as multi-dice rolls.

- **Type:** Modifier (intermediate node)
- **Function:** Performs multiple rolls from the input generator node based on the defined quantity
- **Output:** Numeric pool (list of multiple values per simulation)

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
- **Default:** Dice Pool
- **Function:** Name displayed in the modeling board

### **Quantity**

- **Type:** Integer number
- **Default:** `2`
- **Function:** Defines how many times the generator node will be executed per simulation (e.g., 3 means 3dX)

---

## **Usage Example**

**Scenario:** Simulate a damage system where the player rolls **2 six-sided dice (2d6)** and sums the result to determine the total damage.

### **1. Dice Generator Node Properties:**

- Minimum Value: `1`
- Maximum Value: `6`

### **2. Dice Pool Node Properties:**

- Quantity: `2`

### **3. Connections:**

- Connect the **Dice Generator** to the **Dice Pool** node
- Connect the **Dice Pool** node to the **Dice Pool Sum** node
- Connect the **Dice Pool Sum** node to the **Histogram** node

<img src="/node-crafter/doc-images/dice-pool.png" width="500px" alt="Example usage of Dice Pool with Dice Pool Sum node"/>

---

## **Notes**

- Ideal for representing rolls like **2d6**, **3d10**, etc., centralizing the repetition logic in a single node.
- Can be combined with selection nodes like **Select Highest Dice** and **Select Random Dice** to filter the pool.
- Replaces the need for multiple separate generator nodes to simulate more than one dice.
