import React from "react";
import { useReactFlow } from "@xyflow/react";
import { waitAsync } from "@/utils/waitAsync";
import { IChart, IEdge, IHistogramNode, INode, INodeState } from "@/config/types";
import { NodeManager } from "@/utils/node-manager";
import { notifications } from "@mantine/notifications";
import { i18n } from "@/config/i18n";

interface UIStateContextProps {
  loading: boolean;
  runSimulation: () => Promise<void>;
  clearSimulation: () => void;
  charts: IChart[];
  iterations: number;
  setIterations: (iterations: number) => void;
}

interface UIStateProviderProps {
  children: React.ReactNode;
}

const LayoutContent = React.createContext<UIStateContextProps | undefined>(undefined);
const nodesStateMap = new Map<string, INodeState>();

export const SimulationProvider: React.ComponentType<UIStateProviderProps> = ({ children }) => {
  const flow = useReactFlow<INode, IEdge>();
  const [charts, setCharts] = React.useState<IChart[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [iterations, setIterations] = React.useState(10000);

  async function runSimulation() {
    setLoading(true);
    nodesStateMap.clear();
    const nodes = flow.getNodes();
    nodes.forEach((node) => flow.updateNodeData(node.id, { ...node.data, status: "LOADING" }));
    await waitAsync(200);

    const newCharts: IChart[] = [];
    const histogramsNode = nodes.filter((node) => node.type === "histogram") as IHistogramNode[];

    histogramsNode.forEach((histogram) => {
      try {
        const chartData = runIterativeFromHistogram(histogram);
        newCharts.push({ id: "chart_" + histogram.id, name: histogram.data.name, data: chartData });
      } catch (error) {
        notifications.show({
          message: (
            <>
              <p className="font-semibold">{i18n.t("errors.tryingToRunSimulationsTitle")}</p>
              <span>{error?.message}</span>
            </>
          ),
          color: "red",
        });
        console.log("Error building chart", error);
        setLoading(false);
      }
    });

    await waitAsync(500);

    flow
      .getNodes()
      .filter((node) => node.data.status === "LOADING" && node.type !== "histogram")
      .forEach((node) => flow.updateNodeData(node.id, { ...node.data, status: "IDLE" }));

    nodesStateMap.clear();
    setCharts(newCharts);
    setLoading(false);
  }

  function runIterativeFromHistogram(histogramNode: IHistogramNode): INodeState<IHistogramNode> {
    const stack: INode[] = [histogramNode];
    const visited = new Set<string>();
    let index = 0;

    while (stack.length > 0) {
      if (++index > 10000) {
        throw new Error("Execution aborted: possible infinite loop detected.");
      }

      const currentNode = stack[stack.length - 1];
      const nodeEdges = flow.getEdges().filter((edge) => edge.target === currentNode.id);
      const sourceNodes = nodeEdges.map((edge) => flow.getNode(edge.source)).filter(Boolean) as INode[];
      const inputs: { node: INode; state: INodeState }[] = [];

      let allInputsReady = true;
      for (const sourceNode of sourceNodes) {
        const resultState = nodesStateMap.get(sourceNode.id);
        if (!resultState) {
          if (!visited.has(sourceNode.id)) {
            stack.push(sourceNode);
            visited.add(sourceNode.id);
          }
          allInputsReady = false;
          break;
        }
        inputs.push({ node: sourceNode, state: resultState });
      }

      if (!allInputsReady) continue;

      try {
        const resultState = NodeManager.runIterative(currentNode, inputs, iterations);
        nodesStateMap.set(currentNode.id, resultState);
        flow.updateNodeData(currentNode.id, { ...currentNode.data, status: "FINISHED" });
        stack.pop();
      } catch (error) {
        flow.updateNodeData(currentNode.id, { ...currentNode.data, status: "ERROR", errorMessage: error?.message });
        throw error;
      }
    }

    const finalState = nodesStateMap.get(histogramNode.id) as INodeState<IHistogramNode> | undefined;
    if (!finalState) throw new Error(i18n.t("errors.histogramStateNotFound", { name: histogramNode.data.name }));
    return finalState;
  }

  function clearSimulation() {
    setCharts([]);
    nodesStateMap.clear();
    const nodes = flow.getNodes();
    nodes.forEach((node) => flow.updateNodeData(node.id, { ...node.data, status: "IDLE" }));
  }

  return (
    <LayoutContent.Provider value={{ loading, runSimulation, clearSimulation, charts, iterations, setIterations }}>{children}</LayoutContent.Provider>
  );
};

export const useSimulationContext = (): UIStateContextProps => {
  const context = React.useContext(LayoutContent);
  if (context === undefined) {
    throw new Error("useUIState must be used within a SimulationProvider");
  }
  return context;
};
