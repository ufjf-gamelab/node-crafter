import { i18n } from "@/config/i18n";
import { ISymbolicGeneratorNode, IBagPullWithoutRepetitionNode, INodeService } from "@/config/types";

const TOTAL_SIMULATIONS = 10000;

export const BagPullWithoutRepetitionService: INodeService<IBagPullWithoutRepetitionNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "bagPullWithoutRepetition",
      data: {
        name: i18n.t("nodeShortName.bagPullWithoutRepetition"),
        status: "IDLE",
        inputType: "symbolicGenerator",
        outputType: "symbolicPool",
      },
    };
  },

  run({ inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceNode = source.node as ISymbolicGeneratorNode;
    const resultState = pullBagWithoutRepetition(sourceNode.data.faces);
    return resultState;
  },
};

function pullBagWithoutRepetition(balls: string[]) {
  const result: string[][] = [];

  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    const bolasEmbaralhadas = [...balls];
    for (let j = bolasEmbaralhadas.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [bolasEmbaralhadas[j], bolasEmbaralhadas[k]] = [bolasEmbaralhadas[k], bolasEmbaralhadas[j]];
    }

    result.push(bolasEmbaralhadas);
  }

  return result;
}
