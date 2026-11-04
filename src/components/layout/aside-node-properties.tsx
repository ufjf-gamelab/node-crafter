import React from "react";
import { NodeManager } from "@/utils/node-manager";
import { useOnSelectionChange, useNodes } from "@xyflow/react";
import { useLayoutContext } from "@/contexts/layout-context";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { INode } from "@/config/types";

export const AsideNodeProperties: React.FunctionComponent = () => {
  const layoutContext = useLayoutContext();
  const nodes = useNodes<INode>();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const selectedNode = React.useMemo(
    () => (selectedIds.length === 1 ? nodes.find((node) => node.id === selectedIds[0]) : undefined),
    [nodes, selectedIds]
  );

  useOnSelectionChange({
    onChange: React.useCallback(({ nodes: selectedNodes }) => setSelectedIds(selectedNodes.map((node) => node.id)), []),
  });

  React.useEffect(() => {
    layoutContext.setAsidePropertiesOpen(selectedIds.length === 1);
  }, [selectedIds]);

  if (!selectedNode) return null;
  return (
    <div className="fixed right-0 top-[100px] h-[calc(100vh-100px)] bg-white z-20 border-l text-sm overflow-y-auto" style={{ width: layoutContext.asidePropertiesWidth + "px" }}>
      {renderNodeProperties(selectedNode)}
    </div>
  );
};

function renderNodeProperties(node: INode) {
  const Component = (NodeManager.getProperties(node) || BaseNodeProperties) as React.FunctionComponent<{ node: INode }>;
  return <Component node={node} key={node.id} />;
}
