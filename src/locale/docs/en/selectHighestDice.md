**Select Highest Dice** is a **modifier-type node** used to transform a **numeric pool** into a **simple list containing only the highest value per simulation**. Its main function is to filter the pool and retain only the highest result in each simulation, making it useful for situations where the best out of multiple rolls should be selected.

- **Type:** Modifier (intermediate node)
- **Function:** Selects the highest value from a numeric pool for each simulation
- **Output:** Simple list of numeric values

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
- **Default:** Select Highest Dice
- **Function:** Name displayed in the modeling board

---

## **Usage Example**

**Scenario:** In a skill test, a player rolls **3 six-sided dice (3d6)** and the **highest value** among them is used to determine success (≥ 4).

### **1. Dice Generator Node Properties:**

- Minimum Value: `1`
- Maximum Value: `6`

### **2. Dice Pool Node Properties:**

- Quantity: `3`

### **#. Dice Success Properties:**

- Success equal or greater than: `4`

### **4. Connections:**

- Connect the **Dice Generator** to the **Dice Pool** node
- Connect the **Dice Pool** node to the **Select Highest Dice** node
- Connect the **Select Highest Dice** node to the **Success Dice** node
- Connect the **Success Dice** node to the **Histogram** node

<img src="/node-crafter/doc-images/select-highest-dice.png" alt="Example usage of Select Highest Dice node" width="500px"/>

---

## **Notes**

- Ideal for situations where only the **best result** from multiple rolls should be considered.
- Often used in systems with **advantage mechanics**, critical hits, or similar effects.
- Can be combined with **Dice Pool** and any node that outputs a numeric pool.
