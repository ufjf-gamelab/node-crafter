**Draw Symbols** is a **modifier-type node** (intermediate) used to simulate draws where symbols are taken from the input pool. Depending on the configuration, symbols can either be returned to the pool after each draw (**with replacement**) or removed for the duration of the attempt (**without replacement**). The output is a set of combinations or permutations of symbols.

* **Type:** Modifier (intermediate node)
* **Function:** Draws a defined quantity of symbols from a **Symbolic Pool**, either returning them or removing them based on the Replacement setting.
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
* **Default:** Draw Symbols
* **Function:** Name displayed on the modeling board

#### **Number of Draws**

* **Type:** Integer
* **Default:** `2`
* **Function:** Defines how many symbols will be drawn from the pool per attempt.

#### **Replacement**

* **Type:** Boolean (`True` | `False`)
* **Default:** `False`
* **Function:** Defines if the selected symbol is returned to the pool before the next draw.
    * If **`True`** (With Replacement): The symbol is returned to the pool after being drawn. The same specific instance of a symbol can be drawn multiple times in a single attempt.
    * If **`False`** (Without Replacement): The symbol is removed from the pool for the current attempt. The same specific instance cannot be drawn again.
    * **Constraint:** If set to **`False`**, an **Error** will occur if the **Number of Draws** is greater than the total number of elements in the **Symbolic Pool**.

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

#### **2. Draw Symbols Properties:**

* Number of Draws: `2`
* Replacement: `False`
* Order Matters?: `False` (Combination)

#### **3. Result (Possible Combinations):**

The node will generate results like: `{Ace, Ace}`, `{Ace, King}`, `{Ace, Queen}`, `{King, Queen}`.

*(Note: If **Replacement** were set to `True`, a result like `{King, King}` would become possible, even though there is only 1 King in the pool).*

#### **4. Connections:**

* Connect the **Symbolic Pool** (with the configuration above) to the **Draw Symbols** node.
* Connect the **Draw Symbols** to the **Histogram** node to analyze the frequency of the combinations.

---

### **Notes**

* This node handles Draw Symbols from **weighted pools**, making it ideal for simulating draws from decks, inventories, or item boxes.
* **Error Condition:** If **Replacement** is set to `False`, ensure your **Number of Draws** does not exceed the total pool size, otherwise the node will return a status of `Error`.
* If the **Order Matters?** property is set to `True`, the output will be a **Permutation** (ordered sequence).