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
        outputType: "symbolicGeneratorPool",
        drawAmount: 2,
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
    const resultState = pullBagWithoutRepetition(weightedSymbols, node.data.drawAmount);
    return resultState;
  },
};

function pullBagWithoutRepetition(symbols: string[], drawAmount: number) {
  const result: string[][] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bag = [...symbols];
    const pulledValues: string[] = [];

    for (let j = 0; j < drawAmount; j++) {
      const pulledFace = bag[Math.floor(Math.random() * bag.length)];
      pulledValues.push(pulledFace);
      bag.splice(bag.indexOf(pulledFace), 1);
    }

    result.push(pulledValues);
  }

  return result;
}
