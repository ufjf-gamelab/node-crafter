**Symbolic Pool** is a **generator-type node** used to create random symbolic values based on a set of **symbols and their quantities (weights) defined by the user**. Unlike the simple **Symbolic Generator**, this node allows simulating draws with unequal probabilities, making it ideal for representing the real distribution of elements such as decks with multiple copies of cards, inventories with different item rarities, or outcomes with a higher chance of occurrence.

* **Type:** Generator (initial node)
* **Function:** Randomly generates one of the defined symbolic values, respecting the specified quantities for each symbol (weighted drawing).
* **Output:** One symbolic value per execution
* **Output:** List of random values (pool) within the defined symbols and their quantities

---

### **Properties**

#### **Node ID**

* **Type:** Text
* **Default:** Random ID
* **Function:** Unique identifier for the node

#### **Status**

* **Type:** `Finished` | `Idle` | `Error` | `Loading` | `Missing data`
* **Default:** `Idle`
* **Function:** Indicates the current state of the node

#### **Name**

* **Type:** Text
* **Default:** Symbolic Pool
* **Function:** Name displayed on the modeling canvas

#### **Symbols**

* **Type:** Symbol and Weight Tuple (Text | Integer Number)
    * **Symbol (Text):** The possible symbolic value to be drawn.
    * **Quantity (Integer Number):** The weight or the number of times the symbol exists in the pool.
* **Default:** `[A, 1], [B, 1]`
* **Function:** Defines the possible symbols and the **weight of each one** when drawn.
* **Observation:** At least one symbol with a quantity greater than zero is required.

---

### **Usage Example**

**Scenario:** Simulating the drawing of items from a "treasure box" that contains 5 "Common Potions," 3 "Rare Armors," and 1 "Legendary Sword."

#### **1. Symbolic Pool Properties:**

| Symbol | Quantity |
| :--- | :--- |
| Common Potion | 5 |
| Rare Armor | 3 |
| Legendary Sword | 1 |

* *(Total of 9 items in the pool. The "Common Potion" has $\approx 55.6\%$ chance of being drawn.)*

#### **2. Connection with other nodes:**

* Connect the **Symbolic Pool** directly to the **Histogram** node to visualize the distribution of draws over multiple executions, or to a **Draw** node to track the frequency of item combinations.

---

### **Notes**

* Ideal for simulating weighted drawing systems (such as "loot boxes," item drops) where the frequency of each outcome is not equal.
* It is not compatible with nodes that require numerical values, such as mathematical operators, logical operators, or value comparison.