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
    if (sourceNode.data.symbols.length < node.data.drawAmount && !node.data.replacement) throw new Error(i18n.t("errors.pullsGreaterThanFaces"));

    const weightedSymbols: string[] = [];
    sourceNode.data.symbols.forEach(([symbol, weight]) => {
      for (let i = 0; i < weight; i++) {
        weightedSymbols.push(symbol);
      }
    });
    const resultState = drawsUntil(weightedSymbols, node.data.drawAmount, node.data.replacement);
    return resultState;
  },
};

function drawsUntil(symbols: string[], drawAmount: number, replacement: boolean) {
  const result: number[] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bag = [...symbols];
    const drawnValues: string[] = [];

    for (let j = 0; j < drawAmount; j++) {
      const drawnSymbol = bag[Math.floor(Math.random() * bag.length)];
      drawnValues.push(drawnSymbol);
      if (!replacement)
        bag.splice(bag.indexOf(drawnSymbol), 1);
    }
    result.push(0);
  }

  return result;
}
