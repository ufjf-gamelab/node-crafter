# **Merge Dice Pools**

**Merge Dice Pools** is a **modifier-type node** used to combine two **numeric input pools** into a single **output pool**. It merges the values of both pools, preserving the simultaneous rolls in a unified group. This allows modeling situations where different types of dice should be treated as one combined set.

- **Type:** Modifier (intermediate node)
- **Function:** Merges the values of two numeric pools into a single pool
- **Output:** Numeric pool

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
- **Default:** Merge Dice Pools
- **Function:** Name displayed in the modeling board

---

## **Usage Example**

**Scenario:** In a combat system, the player rolls **2d6** for physical damage and **1d8** for magical damage. To apply a total damage effect, both pools need to be unified.

### **1. Dice Generator Node Properties:**

- Dice A: Minimum `1`, Maximum `6`
- Dice B: Minimum `1`, Maximum `8`

### **2. Dice Pool Node Properties:**

- Pool A: Quantity `2`
- Pool B: Quantity `1`

### **3. Connections:**

- Connect **Dice A** to **Pool A**
- Connect **Dice B** to **Pool B**
- Connect **Pool A** to the **Merge Dice Pools** node
- Connect **Pool B** to the **Merge Dice Pools** node
- Connect the **Merge Dice Pools** node to the **Dice Pool Sum** node
- Connect the **Dice Pool Sum** node to the **Histogram** node

<img src="/node-crafter/doc-images/merge-dice-pools.png" alt="Example usage of the Merge Dice Pools node" width="500px"/>

---

## **Notes**

- Ideal for **grouping simultaneous rolls of different dice types** into a single pool.
- Allows operations and modifiers to be applied uniformly to previously separated pools.
- Only works with **numeric pool** inputs.
