**Draws Until** is a **modifier-type node** (intermediate) used to simulate persistence or calculate occurrence probability based on attempts. It performs repeated draws from the input pool until a **specific target of symbols** (Stopping Conditions) is accumulated. The output of this node is not the symbols themselves, but **how many drawing rounds were needed** to reach the defined condition.

* **Type:** Modifier (intermediate node)
* **Function:** Draws repeatedly from a **Symbolic Pool** until the defined goals are met. Returns the total number of attempts performed.
* **Input:** **Symbolic Pool** (Symbol and Quantity)
* **Output:** Integer (Number of Attempts)

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
* **Default:** Draws Until
* **Function:** Name displayed on the modeling board

#### **Number of Draws**

* **Type:** Integer
* **Default:** `2`
* **Function:** Defines how many symbols will be drawn from the pool **per attempt (round)**.
    * Example: If set to `10`, each "attempt" consumes 10 symbols from the pool at once to check if the objectives have been met.

#### **Replacement**

* **Type:** Boolean (`True` | `False`)
* **Default:** `False`
* **Function:** Defines if the selected symbol is returned to the pool before the next draw.
    * If **`True`** (With Replacement): The symbol is returned to the pool after being drawn. The pool never runs out, allowing for infinite simulations until success.
    * If **`False`** (Without Replacement): The symbol is removed from the pool for the current attempt.
    * **Constraint:** If set to **`False`**, the node will stop execution if the pool becomes empty before the objectives are reached.

#### **Stopping Conditions (Objectives)**

* **Type:** List of Objectives (Symbol + Quantity)
* **Function:** Defines the goal that must be achieved to stop the drawing cycle.
    * **Symbol:** The name of the item you want to obtain.
    * **Quantity:** The number of units of this symbol that must be accumulated.
    * **Logic:** The node will continue drawing until **all** quantities of **all** listed symbols have been collected.

---

### **Usage Example**

**Scenario:** We want to know how many times we need to flip a coin until we accumulate **2 "Heads"**.

#### **1. Symbolic Pool Configuration (Input):**

| Symbol | Quantity |
| :--- | :--- |
| Heads | 1 |
| Tails | 1 |

#### **2. Draws Until Properties:**

* **Number of Draws:** `1` (Flip one coin at a time)
* **Replacement:** `True` (The coin returns to hand after being flipped)
* **Stopping Conditions:**
    * Symbol: `Heads`, Quantity: `2`

#### **3. Result (Output):**

The node will simulate the process internally (e.g., Tails, Tails, Heads, Tails, Heads).
* **Output:** `5` (It took 5 flips to accumulate the necessary 2 Heads).

#### **4. Connections:**

* Connect the **Symbolic Pool** to the **Draws Until** node.
* The output of this node is a number. Connect it to a **Histogram** to visualize the statistical distribution of the effort required (e.g., the average number of attempts for success).

---

### **Notes**

* The output of this node is strictly **numeric** (Integer). It does not pass the list of drawn symbols, only the integer representing the effort (number of rounds).
* When using **Without Replacement**, ensure the pool contains enough symbols to meet the goal, otherwise, the process will fail or stop prematurely.
* The **Number of Draws** property directly influences the speed of success. Drawing 5 items per round generally reaches the goal in fewer "rounds" than drawing 1 per round.