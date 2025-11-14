**Draw Without Replacement** is a **modifier-type node** (intermediate) used to simulate draws where **each symbol is taken from the input pool only once** within the same execution. This node is based on the concept of taking elements from a set (**Symbolic Pool**) and **not returning them** for subsequent draws in the same attempt. The output is a set of combinations or permutations of symbols.

* **Type:** Modifier (intermediate node)
* **Function:** Draws a defined quantity of symbols from a **Symbolic Pool** without repeating the same element.
* **Input:** **Symbolic Pool** (Symbol and Quantity)
* **Output:** List of combinations/permutations (Symbolic Generator)

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
* **Default:** Draw Without Replacement
* **Function:** Name displayed on the modeling board

#### **Number of Draws (k)**

* **Type:** Integer
* **Default:** `2`
* **Function:** Defines how many symbols will be drawn from the pool per attempt. This value must be less than or equal to the total number of elements in the input pool.

#### **Order Matters?**

* **Type:** Boolean (`True` | `False`)
* **Default:** `False`
* **Function:** Defines whether the order of the drawn symbols affects the final result.
    * If **`True`** (Permutation): The output considers sequences like **AB** and **BA** as **distinct** results.
    * If **`False`** (Combination): The output considers sequences like **AB** and **BA** as the **same** result.

---

### **Usage Example**

**Scenario:** In a game, **2 cards** are drawn from a mini-deck containing 2 "Ace" cards, 1 "King" card, and 1 "Queen" card.

#### **1. Symbolic Pool Configuration (Input):**

| Symbol | Quantity |
| :--- | :--- |
| Ace | 2 |
| King | 1 |
| Queen | 1 |

* *(Total of 4 cards in the pool.)*

#### **2. Draw Without Replacement Properties:**

* Number of Draws: `2`
* Order Matters?: `False` (Combination)

#### **3. Result (Possible Combinations):**

The node will generate results like: `{Ace, Ace}`, `{Ace, King}`, `{Ace, Queen}`, `{King, Queen}`.

#### **4. Connections:**

* Connect the **Symbolic Pool** (with the configuration above) to the **Draw Without Replacement** node.
* Connect the **Draw Without Replacement** to the **Histogram** node to analyze the frequency of the combinations.

---

### **Notes**

* This node handles draw without replacement from **weighted pools**, making it ideal for simulating draws from decks, inventories, or item boxes.
* If the **Order Matters?** property is set to `True`, the output will be a **Permutation** (ordered sequence).
* The **Number of Draws** cannot exceed the total number of available items in the pool.