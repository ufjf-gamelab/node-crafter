import { i18n } from "@/config/i18n";
import { ISymbolicPoolNode, IDrawSymbolsNode, INodeService } from "@/config/types";

const TOTAL_SIMULATIONS = 10000;

export const DrawSymbolsService: INodeService<IDrawSymbolsNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "drawSymbols",
      data: {
        name: i18n.t("nodeShortName.drawSymbols"),
        status: "IDLE",
        inputType: "symbolicPool",
        outputType: "symbolicPool",
        drawAmount: 2,
        orderMatters: false,
        replacement: false
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

    if (weightedSymbols.length < node.data.drawAmount && !node.data.replacement) throw new Error(i18n.t("errors.pullsGreaterThanTotalSymbols"));


    const resultState = drawSymbols(weightedSymbols, node.data.drawAmount, node.data.orderMatters, node.data.replacement);
    return resultState;
  },
};

function drawSymbols(symbols: string[], drawAmount: number, orderMatters: boolean, replacement: boolean) {
  const result: string[] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bag = [...symbols];
    const drawnValues: string[] = [];

    for (let j = 0; j < drawAmount; j++) {
      const drawnSymbol = bag[Math.floor(Math.random() * bag.length)];
      drawnValues.push(drawnSymbol);
      if (!replacement)
        bag.splice(bag.indexOf(drawnSymbol), 1);
    }
    let drawnHand = "";
    if (orderMatters)
      drawnHand = drawnValues.join(", ");
    else {
      const sortedValues = drawnValues.sort();
      drawnHand = sortedValues.join(", ");
    }
    result.push(drawnHand);
  }

  return result;
}
