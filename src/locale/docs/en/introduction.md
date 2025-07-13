Hello! Welcome to **Node Crafter**, a visual tool for modeling game rules, developed to assist in the creation and balancing of games with probabilistic elements — especially those involving **dice rolls**.  
Inspired by tools like **[McDie](https://gengelstein.itch.io/mcdie)** and **[AnyDice](https://anydice.com/)**, Node Crafter offers a **visual and intuitive interface**, where you can build game rules using **nodes and connections**, simulate their behavior, and observe the results through **graphs and statistics**.

---

## How the system works

- On the **left side of the screen**, you’ll find a list of all **available nodes**.
- Clicking on an option adds the node to the **center of the board**.
- When a node is selected, its **properties** appear on the **right side** and can be customized according to your modeling goals.
- At the **bottom center**, you’ll find the **task bar**, where simulations are started and results are displayed based on the model built on the board.

---

## Basic structure of a model

Every model must begin with a **generator** node — either a **Dice Generator** or a **Symbolic Generator**.  
From there, you can use **modifier nodes** to transform values as needed.  
At the end of the flow, the **Histogram** node is mandatory, as it is responsible for **visually displaying** the results of the simulation.

---

## Practical example: attack with advantage in D&D

To illustrate how the system works, we’ll use a classic mechanic from **[Dungeons & Dragons](https://wikipedia.org/wiki/Dungeons_%26_Dragons)**: performing an **attack with advantage**, including a **fixed bonus** and checking for a **critical hit**.

According to D&D 5th edition rules:

- An attack with advantage allows the player to roll **two d20 dice** and take the **higher result**;
- A **fixed attack bonus** is added to this value (in this example, +4);
- If the total equals or exceeds the target’s **Armor Class (AC)** (set to **15** in this case), the attack is considered successful;
- A **critical hit** occurs if **either die** rolls a natural **20**.

### How to model this in Node Crafter:

1. Create a **Dice Generator** node configured as a **d20**;
2. Connect it to a **Dice Pool** node, representing the two simultaneous rolls;
3. Connect the **Dice Pool** to a **Select Highest Dice** node, which filters out the highest value;
4. From this result, create two parallel flows:
   - **First flow:**
     - Add **+4** using the **Math** and **Integer** node;
     - Evaluate the total with a **Success** node, checking if it is **≥ 15**;
   - **Second flow:**
     - Compare the original value to **20** using a **Logical Comparison** node with the **equality operation**, identifying a **critical hit**.

<img src="/node-crafter/doc-images/dnd-model.png" width="100%" alt="Model example image"/>

---

## Acknowledgment

Thank you for using **Node Crafter**!  
If possible, please take a moment to answer the **[questionnaire](https://forms.gle/sUBEc2Pwr3dAd5MT9)** that is part of this research.  
Your feedback is essential for improving the system.
