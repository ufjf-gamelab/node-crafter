import { i18n } from "@/config/i18n";
import { ISymbolicPoolNode, IDrawsUntilNode, INodeService } from "@/config/types";

const TOTAL_SIMULATIONS = 10000;

export const DrawsUntilService: INodeService<IDrawsUntilNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "drawsUntil",
      data: {
        name: i18n.t("nodeShortName.drawsUntil"),
        status: "IDLE",
        inputType: "symbolicPool",
        outputType: "numericPool",
        drawAmount: 2,
        replacement: false,
        objectives: [{symbol: "A", count: 1}]
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceNode = source.node as ISymbolicPoolNode;
    
    

    const weightedSymbols: string[] = [];
    sourceNode.data.symbols.forEach(([symbol, weight]) => {
      for (let i = 0; i < weight; i++) {
        weightedSymbols.push(symbol);
      }
    });
    if (!isOperationPossible(node.data.objectives, node.data.drawAmount, weightedSymbols, node.data.replacement)) {
      throw new Error(i18n.t("errors.drawsUntilImpossible"));
    }
    const resultState = drawsUntil(weightedSymbols, node.data.drawAmount, node.data.replacement, node.data.objectives);
    return resultState;
  },
};

function drawsUntil(symbols: string[], drawAmount: number, replacement: boolean, objectives: { symbol: string; count: number }[]) {
  const result: number[] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    let count = 0;
    const conditionsCount = new Array(objectives.length).fill(0);
    const conditionsMet = () => objectives.every((obj, index) => conditionsCount[index] >= obj.count);
    let bag = [...symbols];
    while (!conditionsMet()) {
      count++;
      const drawnValues: string[] = [];
      for (let j = 0; j < drawAmount; j++) {
        const drawnSymbol = bag[Math.floor(Math.random() * bag.length)];
        drawnValues.push(drawnSymbol);
        if (!replacement)
          bag.splice(bag.indexOf(drawnSymbol), 1);
      }

      // Update conditions count
      objectives.forEach((obj, index) => {
        const drawnCount = drawnValues.filter(s => s === obj.symbol).length;
        conditionsCount[index] += drawnCount;
      });

      // If replacement is true, reset the bag
      if (replacement) {
        bag = [...symbols];
      }
    }
    result.push(count);
  }

  return result;
}

function isOperationPossible(objectives: { symbol: string; count: number }[], drawAmount:number, symbols: string[], replacement: boolean) {
  for (const objective of objectives) {
    if (!symbols.includes(objective.symbol)) {
      return false;
    }
    if (!replacement && symbols.length < drawAmount) {
      return false;
    }
    if (!replacement && symbols.filter(s => s === objective.symbol).length < objective.count) {
      return false;
    }
  }
  return true;
}