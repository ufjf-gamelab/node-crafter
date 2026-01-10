import { i18n } from "@/config/i18n";
import { INumericValueNode, INodeService } from "@/config/types";

export const NumericValueService: INodeService<INumericValueNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "numericValue",
      data: {
        name: i18n.t("nodeShortName.numericValue"),
        status: "IDLE",
        valuesConversionDictionary: {"A": 1},
        inputType: "symbolicPool",
        outputType: "numeric",
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");
    const sourceState = source.state as string[];
    const resultState = sourceState.map(symbol => symbol.split(", ").reduce((acc, s) => acc + (node.data.valuesConversionDictionary[s] || 0), 0));
    return resultState;
  },
};

