import React from "react";
import { Background, BackgroundVariant, Connection, MarkerType, ReactFlow, addEdge, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { NodeManager } from "@/utils/node-manager";
import { generateHash } from "@/utils/generate-hash";
import { useSimulationContext } from "@/contexts/simulation-context";
import { useWorkspace } from "./workspace-provider.tsx";
import type { IEdge, INode, IIntegerValueNode } from "@/config/types";

export const DiagramCanvas: React.ComponentType = () => {
  const flow = useReactFlow<INode, IEdge>();
  const { workspace, pendingExampleSeed, markExampleSeeded, updateActiveContent, updateViewport } = useWorkspace();
  const { loading, clearSimulation } = useSimulationContext();

  const activeId = workspace.activeDiagramId;
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<IEdge>([]);
  const hydratedDiagramIdRef = React.useRef<string | null>(null);
  const hydratingRef = React.useRef(false);
  const seededRef = React.useRef(false);

  React.useEffect(() => {
    if (!pendingExampleSeed || seededRef.current) return;
    seededRef.current = true;
    hydratedDiagramIdRef.current = workspace.activeDiagramId;

    const dice = NodeManager.new("diceGenerator", flow);
    dice.position = { x: 20, y: -40 };

    const diceMath = NodeManager.new("diceMath", flow);
    diceMath.position = { x: 200, y: 20 };

    const integerValue = NodeManager.new("integerValue", flow) as IIntegerValueNode;
    integerValue.position = { x: 20, y: 80 };
    integerValue.data.value = 4;

    const histogram = NodeManager.new("histogram", flow);
    histogram.position = { x: 360, y: 20 };

    const exampleEdges: IEdge[] = [
      {
        id: generateHash(),
        source: dice.id,
        target: diceMath.id,
        targetHandle: `math-target-1-${diceMath.id}`,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
      {
        id: generateHash(),
        source: integerValue.id,
        target: diceMath.id,
        targetHandle: `math-target-2-${diceMath.id}`,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
      {
        id: generateHash(),
        source: diceMath.id,
        target: histogram.id,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
    ];

    setNodes([dice, diceMath, integerValue, histogram]);
    setEdges(exampleEdges);
    markExampleSeeded();
  }, [pendingExampleSeed, workspace, flow, markExampleSeeded, setNodes, setEdges]);

  React.useEffect(() => {
    const diagram = workspace.diagrams[activeId];
    if (!diagram) return;
    if (hydratedDiagramIdRef.current === activeId) return;
    hydratedDiagramIdRef.current = activeId;

    hydratingRef.current = true;
    setNodes(diagram.nodes);
    setEdges(diagram.edges);

    window.requestAnimationFrame(() => {
      flow.setViewport(diagram.viewport);
      clearSimulation();
      window.requestAnimationFrame(() => {
        hydratingRef.current = false;
      });
    });
  }, [activeId, workspace, flow, clearSimulation, setNodes, setEdges]);

  React.useEffect(() => {
    if (hydratingRef.current || loading) return;

    const timer = window.setTimeout(() => {
      if (hydratingRef.current || loading) return;
      updateActiveContent({ nodes, edges }, flow.getViewport());
    }, 500);

    return () => window.clearTimeout(timer);
  }, [nodes, edges, activeId, loading, flow, updateActiveContent]);

  const onConnect = React.useCallback(
    (params: Connection) => {
      const targetAlreadyConnected = edges.some((edge) => edge.target === params.target && edge.targetHandle === params.targetHandle);
      if (targetAlreadyConnected) return;

      const existingEdges = edges.filter((edge) => edge.target === params.target && edge.targetHandle === params.targetHandle);
      if (existingEdges.length === 0) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
              style: { strokeWidth: 2 },
            },
            eds
          )
        );
      }
    },
    [edges, setEdges]
  );

  const handleMoveEnd = React.useCallback(
    (_event: unknown, viewport: { x: number; y: number; zoom: number }) => {
      updateViewport({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
    },
    [updateViewport]
  );

  return (
    <main className="absolute left-48 top-[92px] right-0 bottom-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMoveEnd={handleMoveEnd}
        nodeTypes={NodeManager.getNodeTypes()}
        deleteKeyCode={["Backspace", "Delete"]}
        className="react-flow-board"
        fitView={false}>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};
