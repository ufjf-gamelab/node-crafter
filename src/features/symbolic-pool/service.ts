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
        faces: [["A", 1], ["B", 1]],
        outputType: "symbolicPool",
      },
    };
  },

  run({ node, iterations }) {
    const resultState = generateRandomSymbolicData(node.data.faces, iterations);
    return resultState;
  },
};

function generateRandomSymbolicData(faces: [string, number][], iterations: number) {
  const weightedFaces: string[] = [];
  faces.forEach(([face, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedFaces.push(face);
    }
  });

  const randomData: number[] = [];
  for (let i = 0; i < iterations; i++) {
    randomData.push(parseInt(Math.floor(Math.random() * weightedFaces.length + 1).toString()));
  }

  const result: string[] = [];
  randomData.forEach((data) => {
    const itemFound = weightedFaces.find((_item, index) => index + 1 === data);
    itemFound && result.push(itemFound);
  });

  return result;
}
