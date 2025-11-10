import { i18n } from "@/config/i18n";
import { ISymbolicGeneratorPoolNode, INodeService, ISymbolicGeneratorNode } from "@/config/types";

export const SymbolicGeneratorPoolService: INodeService<ISymbolicGeneratorPoolNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "symbolicGeneratorPool",
      data: {
        name: i18n.t("nodeShortName.symbolicGeneratorPool"),
        status: "IDLE",
        inputType: "symbolicGenerator",
        outputType: "symbolicGeneratorPool",
        quantity: 2,
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceState = source.state as string[];
    const sourceNode = source.node as ISymbolicGeneratorNode;
    const resultState = getSymbolicGeneratorPool(sourceState, node.data.quantity, sourceNode.data.faces);
    return resultState;
  },
};

export function getSymbolicGeneratorPool(input: string[], quantity: number, faces: string[]) {
  let result: string[][] = [];

  for (let i = 0; i < input.length; i++) {
    result[i] = [input[i]];

    for (let j = 0; j < quantity - 1; j++) {
      const randomValue = faces[Math.floor(Math.random() * faces.length)];
      result[i].push(randomValue);
    }
  }

  return result;
}
