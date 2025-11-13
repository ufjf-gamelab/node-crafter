import { i18n } from "@/config/i18n";
import { ISymbolicGeneratorNode, IDrawWithoutReplacementNode, INodeService } from "@/config/types";

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
        draws: 2,
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceNode = source.node as ISymbolicGeneratorNode;
    if (sourceNode.data.faces.length < node.data.draws) throw new Error(i18n.t("errors.pullsGreaterThanFaces"));

    const resultState = pullBagWithoutRepetition(sourceNode.data.faces, node.data.draws);
    return resultState;
  },
};

function pullBagWithoutRepetition(balls: string[], draws: number) {
  const result: string[][] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bag = [...balls];
    const pulledValues: string[] = [];

    for (let j = 0; j < draws; j++) {
      const pulledFace = bag[Math.floor(Math.random() * bag.length)];
      pulledValues.push(pulledFace);
      bag.splice(bag.indexOf(pulledFace), 1);
    }

    result.push(pulledValues);
  }

  return result;
}
