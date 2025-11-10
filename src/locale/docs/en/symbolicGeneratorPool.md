**Symbolic Generator Pool** is a **modifier-type node** used to group the results of two **Symbolic Generator** nodes into a single set. It allows combining parallel symbolic executions, such as drawing two different symbols in a single turn.

- **Type:** Modifier (intermediate node)
- **Function:** Groups the values of two symbolic nodes into a single set
- **Output:** List of symbol pairs grouped by execution

---

## **Properties**

### **Node ID**

- **Type:** Text
- **Default:** Random ID
- **Function:** Unique identifier for the node

### **Status**

- **Type:** `Finished` | `Idle` | `Error` | `Loading` | `Missing data`
- **Default:** `Idle`
- **Function:** Indicates the current state of the node

### **Name**

- **Type:** Text
- **Default:** Symbolic Generator Pool
- **Function:** Name displayed on the modeling board

---

## **Example of Use**

**Scenario:** Simulate the draw of two random symbols representing cards from a custom deck with different figures.

### **1. Symbolic Generator Properties:**

- Generator A: Faces = `Heart`, `Sword`, `Star`
- Generator B: Faces = `Cube`, `Key`, `Moon`

### **2. Node Connections:**

- Connect **Symbolic Generator A** to the **Symbolic Generator Pool** node
- Connect **Symbolic Generator B** to the **Symbolic Generator Pool** node
- Connect the **Symbolic Generator Pool** node to the **Histogram** node

<img src="/node-crafter/doc-images/symbolic-generator-pool.png" width="500px" alt="Example usage of the Symbolic Generator Pool node"/>

---

## **Notes**

- Ideal for representing parallel draws of multiple symbolic elements
- Requires **Symbolic Generator** nodes as input
- Not compatible with numerical operations or nodes that depend on quantitative values
