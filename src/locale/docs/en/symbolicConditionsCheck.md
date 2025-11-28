**Symbolic Conditions Check** is a **modifier-type node** used to validate whether a set of drawn symbols meets specific quantity requirements. It acts as a logical filter for lists of items, verifying composite rules (such as "having 3 Kings AND 2 Queens"). This node returns `1` when the condition is true (all rules are met) and `0` when false, allowing the exact probability of complex combinations to be calculated.

  - **Type:** Modifier (intermediate node)
  - **Function:** Analyzes an input list of symbols and verifies if quantities meet the configured rules
  - **Output:** `1` for true, `0` for false

-----

## **Properties**

### **Node ID**

  - **Type:** Text
  - **Default:** Random ID
  - **Function:** Unique identifier of the node

### **Status**

  - **Type:** `Finished` | `Idle` | `Error` | `Loading` | `Missing Data`
  - **Default:** `Idle`
  - **Function:** Indicates the current state of the node

### **Name**

  - **Type:** Text
  - **Default:** Symbolic Conditions Check
  - **Function:** Name displayed on the modeling board

### **Conditions**

  - **Type:** List of Rules
  - **Default:** `[Symbol: "A", Type: ">=", Quantity: 1]`
  - **Function:** Defines the set of rules the draw must obey. Each rule consists of:
      - **Symbol:** The identifier of the item to be counted (e.g., "Ace Card").
      - **Operation:** `A >= B` (At least X), `A <= B` (At most X), or `A = B` (Exactly X).
      - **Quantity:** The reference numeric value.
  - **Observation:** The node uses **"AND" logic**. To return `1`, **all** listed conditions must be satisfied simultaneously in the same draw.

-----

## **Example of Use**

**Scenario:** Calculate the probability (drop rate) of getting a specific "Full House" (3 Kings and 2 Queens) when drawing a hand of 5 cards from a deck.

### **1. Properties of the Draw Symbols Node (Source):**

  - Draw Quantity: `5`
  - *(Connected to a Symbolic Pool representing a deck)*

### **2. Properties of the Symbolic Conditions Check Node:**

  - Condition 1: Symbol `King`, Operation `A = B`, Quantity `3`
  - Condition 2: Symbol `Queen`, Operation `A = B`, Quantity `2`

### **3. Connections with other nodes:**

  - Connect the **Draw Symbols** node to the **Symbolic Conditions Check** node
  - Connect the **Symbolic Conditions Check** node to the **Histogram** node
  - *(The Histogram will display bar `Success` indicating the % of times the Full House occurred)*

-----

## **Notes**

  - Ideal for transforming complex results (lists of items) into binary statistical data (Success/Failure).
  - The symbol name verification is strict (case-sensitive).
  - Requires an input of type List (Array), typically coming from the **Draw Symbols** node.