import { i18n } from "@/config/i18n";
import { IDiceExplodeNode, IDiceGeneratorNode, INodeService } from "@/config/types";

export const DiceExplodeService: INodeService<IDiceExplodeNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "diceExplode",
      data: {
        name: i18n.t("nodeShortName.diceExplode"),
        status: "IDLE",
        explodeFace: 1,
        inputType: "numericGenerator",
        outputType: "numeric",
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error(i18n.t("errors.sourceNotFound"));

    const sourceState = source.state as number[];
    const sourceNode = source.node as IDiceGeneratorNode;
    if (sourceNode.data.max < node.data.explodeFace) throw new Error(i18n.t("errors.explodeFaceGreaterThanMax"));

    const resultState = explodeDice(sourceState, node.data.explodeFace);
    return resultState;
  },
};

function explodeDice(data: number[], explodeFace: number): number[] {
  const result: number[] = [];
  let count = 0;

  for (const val of data) {
    if (val === explodeFace) {
      count++;
    } else {
      if (count > 0) {
        result.push(count);
        count = 0;
      }
    }
  }

  if (count > 0) {
    result.push(count);
  }

  return result;
}
