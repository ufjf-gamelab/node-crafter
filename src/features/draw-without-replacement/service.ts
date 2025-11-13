import { i18n } from "@/config/i18n";
import { ISymbolicPoolNode, IDrawWithoutReplacementNode, INodeService } from "@/config/types";

const TOTAL_SIMULATIONS = 10000;

export const DrawWithoutReplacementService: INodeService<IDrawWithoutReplacementNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "drawWithoutReplacement",
      data: {
        name: i18n.t("nodeShortName.drawWithoutReplacement"),
        status: "IDLE",
        inputType: "symbolicPool",
        outputType: "symbolicPool",
        drawAmount: 2,
        orderMatters: false,
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceNode = source.node as ISymbolicPoolNode;
    if (sourceNode.data.symbols.length < node.data.drawAmount) throw new Error(i18n.t("errors.pullsGreaterThanFaces"));

    const weightedSymbols: string[] = [];
    sourceNode.data.symbols.forEach(([symbol, weight]) => {
      for (let i = 0; i < weight; i++) {
        weightedSymbols.push(symbol);
      }
    });
    const resultState = drawWithoutReplacement(weightedSymbols, node.data.drawAmount, node.data.orderMatters);
    return resultState;
  },
};

function drawWithoutReplacement(symbols: string[], drawAmount: number, orderMatters: boolean) {
  const result: string[] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bag = [...symbols];
    const drawnValues: string[] = [];

    for (let j = 0; j < drawAmount; j++) {
      const drawnSymbol = bag[Math.floor(Math.random() * bag.length)];
      drawnValues.push(drawnSymbol);
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
