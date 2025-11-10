import { i18n } from "@/config/i18n";
import { ISelectRandomSymbolNode, INodeService } from "@/config/types";

export const SelectRandomSymbolService: INodeService<ISelectRandomSymbolNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "selectRandomSymbol",
      data: {
        name: i18n.t("nodeShortName.selectRandomSymbol"),
        status: "IDLE",
        inputType: "symbolicGeneratorPool",
        outputType: "symbolic",
      },
    };
  },

  run({ inputs, iterations }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceState = source.state as string[][];
    const resultState = selectRandomValueFromPool(sourceState, iterations);
    return resultState;
  },
};

function selectRandomValueFromPool(data: string[][], iterations: number) {
  const result: string[] = [];

  for (let i = 0; i < iterations; i++) {
    result[i] = data[i][Math.floor(Math.random() * data[i].length)];
  }
  return result;
}
