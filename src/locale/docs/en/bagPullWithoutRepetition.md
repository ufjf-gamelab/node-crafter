**Pull Bag Without Repetition** is a **modifier-type node** used to simulate draws in which **each symbol can only be drawn once per simulation**. Inspired by the concept of a physical bag from which balls or tokens are drawn and **not returned**, this node outputs a **symbolic pool** containing the drawn elements in the **order they were pulled**.

- **Type:** Modifier (intermediate node)
- **Function:** Draws symbols without replacement from a symbolic generator
- **Output:** Symbolic pool (list of pulled symbols in order)

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
- **Default:** Pull Bag Without Repetition
- **Function:** Name displayed in the modeling board

### **Number of Pulls**

- **Type:** Integer
- **Default:** `2`
- **Function:** Defines how many symbols will be drawn from the bag per simulation

---

## **Usage Example**

**Scenario:** In a luck-based game, the player draws **3 tokens from a bag** containing `"Fire"`, `"Water"`, `"Earth"`, and `"Air"`. Symbols are drawn **without replacement**, meaning they cannot repeat within the same simulation.

### **1. Symbolic Generator Properties:**

- Faces: `"Fire"`, `"Water"`, `"Earth"`, `"Air"`

### **2. Pull Bag Without Repetition Properties:**

- Number of Pulls: `3`

### **3. Connections:**

- Connect the **Symbolic Generator** to the **Pull Bag Without Repetition** node
- Connect the **Pull Bag Without Repetition** node to the **Histogram** or another analysis node

<img src="/node-crafter/doc-images/bag-pull-without-repetition.png" alt="Example usage of the Pull Bag Without Repetition node" width="500px"/>

---

## **Notes**

- Ideal for representing **draws without replacement**, such as pulling cards, tokens, or unique elements.
- Ensures that **no symbol is repeated in the same simulation**.
- Works only with **symbolic generator inputs**.
- The **order of drawn symbols is preserved** in the output pool.
