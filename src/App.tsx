import React from "react";
import { Background, BackgroundVariant, Connection, ReactFlow, addEdge, useEdgesState, useNodesState, useReactFlow, MarkerType } from "@xyflow/react";
import { NodeManager } from "@/utils/node-manager";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskBar } from "./components/layout/task-bar";
import { AsideNodeProperties } from "@/components/layout/aside-node-properties";
import "@/config/i18n";

import { INode, IEdge, IIntegerValueNode } from "@/config/types";

function App() {
  const flow = useReactFlow<INode, IEdge>();
  const [edges, setEdges, onEdgesChange] = useEdgesState<IEdge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);

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
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: "#00a63e",
              },
              style: { strokeWidth: 2 },
            },
            eds
          )
        );
      }
    },
    [edges, setEdges]
  );

  React.useEffect(() => {
    const dice = NodeManager.new("diceGenerator", flow);
    dice.position.x = 20;
    dice.position.y = -40;

    const diceMath = NodeManager.new("diceMath", flow);
    diceMath.position.x = 200;
    diceMath.position.y = 20;

    const integerValue = NodeManager.new("integerValue", flow) as IIntegerValueNode;
    integerValue.position.x = 20;
    integerValue.position.y = 80;
    integerValue.data.value = 4;

    const histogram = NodeManager.new("histogram", flow);
    histogram.position.x = 360;
    histogram.position.y = 20;
    setNodes([dice, diceMath, integerValue, histogram]);
    onConnect({ source: dice.id, target: diceMath.id, sourceHandle: null, targetHandle: "math-target-1-" + diceMath.id });
    onConnect({ source: integerValue.id, target: diceMath.id, sourceHandle: null, targetHandle: "math-target-2-" + diceMath.id });
    onConnect({ source: diceMath.id, target: histogram.id, sourceHandle: null, targetHandle: null });
  }, []);

  return (
    <div className="relative">
      <Sidebar />
      <AsideNodeProperties />
      <TaskBar />

      <main className="w-screen h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NodeManager.getNodeTypes()}
          deleteKeyCode={["Backspace", "Delete"]}
          className="react-flow-board"
          fitView>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </main>
    </div>
  );
}

export default App;
