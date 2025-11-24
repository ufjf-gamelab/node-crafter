import { generateHash } from "./generate-hash";
import { IFlowInstance, INode, INodeState, INodeType } from "@/config/types";
import { DiceGenerator } from "@/features/dice-generator";
import { Histogram } from "@/features/histogram";
import { DicePool } from "@/features/dice-pool";
import { DicePoolSum } from "@/features/dice-pool-sum";
import { DiceSuccess } from "@/features/dice-success";
import { DiceBetweenInterval } from "@/features/dice-between-interval";
import { DiceCountRepetition } from "@/features/dice-count-repetition";
import { DiceExplode } from "@/features/dice-explode";
import { BagPullWithoutRepetition } from "@/features/bag-pull-without-repetition";
import { DrawSymbols } from "@/features/draw-symbols";
import { DrawsUntil } from "@/features/draws-until";
import { SymbolicGenerator } from "@/features/symbolic-generator";
import { SymbolicPool } from "@/features/symbolic-pool";
import { SymbolicGeneratorPool } from "@/features/symbolic-generator-pool";
import { DiceMath } from "@/features/dice-math";
import { DiceAbsolute } from "@/features/dice-absolute";
import { DiceLogical } from "@/features/dice-logical";
import { ValueIsEven } from "@/features/value-is-even";
import { ValueIsOdd } from "@/features/value-is-odd";
import { IntegerValue } from "@/features/integer-value";
import { AndLogical } from "@/features/and-logical";
import { OrLogical } from "@/features/or-logical";
import { SelectRandomDice } from "@/features/select-random-dice";
import { SelectRandomSymbol } from "@/features/select-random-symbol";
import { MergeDicePools } from "@/features/merge-dice-pools";
import { SelectHighestDice } from "@/features/select-highest-dice";
import { XYPosition } from "@xyflow/react";

const NODE_MODULES = {
  //dice
  diceGenerator: DiceGenerator,
  diceExplode: DiceExplode,
  // symbolic
  symbolicGenerator: SymbolicGenerator,
  bagPullWithoutRepetition: BagPullWithoutRepetition,
  drawSymbols: DrawSymbols,
  drawsUntil: DrawsUntil,
  // operations
  diceMath: DiceMath,
  diceCountRepetition: DiceCountRepetition,
  diceAbsolute: DiceAbsolute,
  dicePoolSum: DicePoolSum,
  // parameters
  integerValue: IntegerValue,
  // logical
  diceLogical: DiceLogical,
  andLogical: AndLogical,
  orLogical: OrLogical,
  diceSuccess: DiceSuccess,
  diceBetweenInterval: DiceBetweenInterval,
  valueIsEven: ValueIsEven,
  valueIsOdd: ValueIsOdd,
  // pools
  dicePool: DicePool,
  symbolicGeneratorPool: SymbolicGeneratorPool,
  symbolicPool: SymbolicPool,
  mergeDicePools: MergeDicePools,
  // filters
  selectRandomDice: SelectRandomDice,
  selectHighestDice: SelectHighestDice,
  selectRandomSymbol: SelectRandomSymbol,
  // output
  histogram: Histogram,
} as const;

export const NodeManager = {
  new(type: INodeType, flow: IFlowInstance): INode {
    const defaultDefinitions = {
      id: generateHash(),
      position: getAdjustedPosition(flow),
    };

    const service = NODE_MODULES[type].service;
    if (!service) throw new Error(`Node type ${type} not registered`);
    return service.new(flow, defaultDefinitions);
  },

  duplicate(flow: IFlowInstance, id: string) {
    const baseNode = flow.getNode(id);
    if (!baseNode) return null;

    const newNode = this.new(baseNode.type, flow);
    newNode.data = { ...baseNode.data };
    newNode.position = getAdjustedPosition(flow);
    flow.addNodes([newNode]);
    return newNode;
  },

  runIterative<N extends INode = INode>(node: N, inputs: { node: INode; state: INodeState }[], iterations: number): INodeState<N> {
    const service = NODE_MODULES[node.type].service;
    if (!service) throw new Error(`Node type ${node.type} not registered`);
    return service.run({ node: node as never, inputs, iterations }) as INodeState<N>;
  },

  getProperties(node: INode) {
    return NODE_MODULES[node.type].properties;
  },

  getNodeTypes(): Record<INodeType, React.ComponentType<any>> {
    return Object.entries(NODE_MODULES).reduce((acc, [key, value]) => {
      acc[key as INodeType] = value.component;
      return acc;
    }, {} as Record<INodeType, React.ComponentType<any>>);
  },
};

function getAdjustedPosition(flow: IFlowInstance, options?: { offset?: number; center?: XYPosition }): XYPosition {
  const { x, y, zoom } = flow.getViewport();
  const containerCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  if (options?.center) {
    containerCenter.x = options.center.x;
    containerCenter.y = options.center.y;
  }

  const offset = options?.offset || 18;
  let adjustedPosition = { x: (containerCenter.x - x) / zoom, y: (containerCenter.y - y) / zoom - 50 };
  while (flow.getNodes().some((node) => node.position.x === adjustedPosition.x && node.position.y === adjustedPosition.y)) {
    adjustedPosition = { x: adjustedPosition.x + offset, y: adjustedPosition.y + offset };
  }

  return adjustedPosition;
}
