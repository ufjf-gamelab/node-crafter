import { i18n } from "@/config/i18n";
import { INodeService, ISymbolicPoolNode } from "@/config/types";

export const SymbolicPoolService: INodeService<ISymbolicPoolNode> = {
  new(_flow, { id, position }) {
    return {
      id,
      position,
      type: "symbolicPool",
      data: {
        name: i18n.t("nodeShortName.symbolicPool"),
        status: "IDLE",
        symbols: [["A", 1], ["B", 1]],
        outputType: "symbolicPool",
      },
    };
  },

  run({ node, iterations }) {
    const resultState = generateRandomSymbolicData(node.data.symbols, iterations);
    return resultState;
  },
};

function generateRandomSymbolicData(symbols: [string, number][], iterations: number) {
  const weightedSymbols: string[] = [];
  symbols.forEach(([symbol, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedSymbols.push(symbol);
    }
  });

  const randomData: number[] = [];
  for (let i = 0; i < iterations; i++) {
    randomData.push(parseInt(Math.floor(Math.random() * weightedSymbols.length + 1).toString()));
  }

  const result: string[] = [];
  randomData.forEach((data) => {
    const itemFound = weightedSymbols.find((_item, index) => index + 1 === data);
    itemFound && result.push(itemFound);
  });

  return result;
}
