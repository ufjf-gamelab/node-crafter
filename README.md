# Node Crafter - Visual Game Simulation Tool 

Node Crafter is a visual tool for modeling and simulating game rules, with probability analysis and dice roll simulations.

<img src="public/logo/md.png" />

### 📂 Examples (*Automobiles* Board Game)

To demonstrate NodeCrafter's capabilities, we provide simulation examples based on the **Automobiles** board game mechanics. These are **`.txt` files** that you must import into the NodeCrafter system to view the nodes and run the simulations.

* [**`StartingBag.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/StartingBag.txt): Models the initial composition of the player's bag.
* [**`1stRoundBag.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/1stRoundBag.txt): Simulates the bag state after the first round.
* [**`1stDrawDistribution.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/1stDrawDistribution.txt): Statistical distribution of the first cube draw.
* [**`MovementDistributionUsingOnlyGearActions.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/MovementDistributionUsingOnlyGearActions.txt): Expected movement distribution using only Gear actions.
* [**`RoundsuntilGearboxDistribution.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/RoundsuntilGearboxDistribution.txt): Average rounds needed to draw a gearbox cube.
* [**`DidntGainWearThisTurn.txt`**](https://ufjf-gamelab.github.io/node-crafter/examples/DidntGainWearThisTurn.txt): Probability of completing a turn without gaining wear cubes.

You can find these files in the `public/examples/` folder to import them locally, or find them directly on our web version

### Workspace

Node Crafter keeps your work in **diagrams**. A workspace can contain several diagrams, each shown as a tab at the top of the canvas.

- **New diagram**: create an empty diagram.
- **Import diagram**: load a `.json` or legacy `.txt` board into a new tab.
- **Export diagram**: download the active diagram as `.json`.
- **Import/Export workspace**: move all diagrams at once.
- **Ctrl+S / Cmd+S**: download the whole workspace as `.json`.
- **Ctrl+Shift+S**: download only the active diagram.

Diagrams are saved automatically in the browser. Closing a tab removes that diagram from the workspace.
