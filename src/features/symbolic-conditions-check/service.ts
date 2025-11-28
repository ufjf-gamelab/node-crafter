import { i18n } from "@/config/i18n";
import { ISymbolicConditionsCheckType, ISymbolicConditionsCheckNode, INodeService } from "@/config/types";

const TOTAL_SIMULATIONS = 10000;

// TODO: Implementar a lógica real de verificação das condições simbólicas

export const SymbolicConditionsCheckService: INodeService<ISymbolicConditionsCheckNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "symbolicConditionsCheck",
      data: {
        name: i18n.t("nodeShortName.symbolicConditionsCheck"),
        status: "IDLE",
        inputType: "symbolicPool",
        outputType: "boolean",
        conditions: [
          {symbol: "A", type: ">=", count: 1},
        ],
      },
    };
  },

  run({ node, inputs }) {
    const [source] = inputs;
    if (!source) throw new Error("Source connection state not found!");

    const sourceState = source.state as string[];


    const resultState = checkConditions(sourceState, node.data.conditions);
    return resultState;
  },
};

function checkConditions(symbols: string[], conditions: {symbol: string, type: ISymbolicConditionsCheckType, count: number}[]) {
  const result: number[] = [];
  
  for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
    result.push(1);
  }

  return result;
}
