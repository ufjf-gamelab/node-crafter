import { Edge, Node, ReactFlowInstance } from "@xyflow/react";

export type IChartData = { label: string | number; value: number }[];
export type IChart = { id: string; name: string; data: IChartData };

export type INodeStateMap = {
  diceGenerator: number[];
  histogram: IChartData;
  dicePool: number[][];
  dicePoolSum: number[];
  diceSuccess: number[];
  diceBetweenInterval: number[];
  diceCountRepetition: number[];
  diceExplode: number[];
  bagPullWithoutRepetition: string[][];
  drawWithoutReplacement: string[];
  symbolicGenerator: string[];
  symbolicPool: string[];
  symbolicGeneratorPool: string[][];
  diceMath: number[];
  diceAbsolute: number[];
  diceLogical: number[];
  valueIsEven: number[];
  valueIsOdd: number[];
  integerValue: number[];
  andLogical: number[];
  orLogical: number[];
  selectRandomDice: number[];
  selectRandomSymbol: string[];
  mergeDicePools: number[][];
  selectHighestDice: number[];
};

export type INodeType = keyof INodeStateMap;
export type INodeState<N extends INode = INode> = N extends { type: infer T } ? (T extends INodeType ? INodeStateMap[T] : never) : never;
export type INodeStateType = "numericGenerator" | "numeric" | "symbolic" | "symbolicGenerator" | "symbolicPool" | "boolean" | "numericPool" | "symbolicGeneratorPool" | "any";
export type INodeStatus = "IDLE" | "FINISHED" | "ERROR" | "MISSING_DATA" | "LOADING";
export type IEdge = Edge;
export type IFlowInstance = ReactFlowInstance<INode, IEdge>;
export type IDiceMathOperation = "sum" | "subtract" | "multiply" | "divide (floor)" | "divide (ceil)";
export type IDiceLogicalOperation = "A >= B" | "A <= B" | "A = B";
export type INodeService<N extends INode> = {
  new: (flow: ReactFlowInstance<INode, IEdge>, defaultValue: Pick<N, "id" | "position">) => N;
  run: (payload: { node: N; inputs: { node: INode; state: INodeState }[]; iterations: number }) => INodeState<N>;
};

type IBaseNode<NodeData extends Record<string, unknown> = Record<string, unknown>, NodeType extends INodeType = INodeType> = Node<
  NodeData,
  NodeType
> & {
  type: INodeType;
  data: {
    name: string;
    status: INodeStatus;
    errorMessage?: string;
    inputType?: INodeStateType;
    outputType?: INodeStateType;
  };
};

export type IDiceGeneratorNode = IBaseNode<{ min: number; max: number }, "diceGenerator">;
export type IHistogramNode = IBaseNode<{ sortDirection: "asc" | "desc" }, "histogram">;
export type IDicePoolNode = IBaseNode<{ quantity: number }, "dicePool">;
export type IDicePoolSumNode = IBaseNode<{}, "dicePoolSum">;
export type IDiceSuccessNode = IBaseNode<{ face: number }, "diceSuccess">;
export type IDiceBetweenIntervalNode = IBaseNode<{ min: number; max: number }, "diceBetweenInterval">;
export type IDiceCountRepetitionNode = IBaseNode<{ face: string }, "diceCountRepetition">;
export type IDiceExplodeNode = IBaseNode<{ explodeFace: number }, "diceExplode">;
export type IBagPullWithoutRepetitionNode = IBaseNode<{ pulls: number }, "bagPullWithoutRepetition">;
export type IDrawWithoutReplacementNode = IBaseNode<{ drawAmount: number; orderMatters: boolean }, "drawWithoutReplacement">;
export type ISymbolicGeneratorNode = IBaseNode<{ faces: string[] }, "symbolicGenerator">;
export type ISymbolicPoolNode = IBaseNode<{ symbols: [string, number][] }, "symbolicPool">;
export type ISymbolicGeneratorPoolNode = IBaseNode<{ quantity: number }, "symbolicGeneratorPool">;
export type IDiceAbsoluteNode = IBaseNode<{}, "diceAbsolute">;
export type IDiceMathNode = IBaseNode<{ operation: IDiceMathOperation }, "diceMath">;
export type IDiceLogicalNode = IBaseNode<{ operation: IDiceLogicalOperation }, "diceLogical">;
export type IValueIsEvenNode = IBaseNode<{}, "valueIsEven">;
export type IValueIsOddNode = IBaseNode<{}, "valueIsOdd">;
export type IIntegerValueNode = IBaseNode<{ value: number }, "integerValue">;
export type IAndLogicalNode = IBaseNode<{}, "andLogical">;
export type IOrLogicalNode = IBaseNode<{}, "orLogical">;
export type ISelectRandomDiceNode = IBaseNode<{}, "selectRandomDice">;
export type ISelectRandomSymbolNode = IBaseNode<{}, "selectRandomSymbol">;
export type IMergeDicePoolsNode = IBaseNode<{}, "mergeDicePools">;
export type ISelectHighestDiceNode = IBaseNode<{}, "selectHighestDice">;

export type INode =
  | IDiceGeneratorNode
  | IHistogramNode
  | IDicePoolNode
  | IDicePoolSumNode
  | IDiceSuccessNode
  | IDiceBetweenIntervalNode
  | IDiceCountRepetitionNode
  | IDiceExplodeNode
  | IBagPullWithoutRepetitionNode
  | IDrawWithoutReplacementNode
  | ISymbolicGeneratorNode
  | ISymbolicPoolNode
  | ISymbolicGeneratorPoolNode
  | IDiceMathNode
  | IDiceAbsoluteNode
  | IDiceLogicalNode
  | IValueIsEvenNode
  | IValueIsOddNode
  | IIntegerValueNode
  | IAndLogicalNode
  | IOrLogicalNode
  | ISelectRandomDiceNode
  | ISelectRandomSymbolNode
  | IMergeDicePoolsNode
  | ISelectHighestDiceNode;
