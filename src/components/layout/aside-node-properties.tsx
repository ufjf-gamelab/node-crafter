import React from "react";
import { NodeManager } from "@/utils/node-manager";
import { useOnSelectionChange, useNodes } from "@xyflow/react";
import { useLayoutContext } from "@/contexts/layout-context";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { INode } from "@/config/types";

export const AsideNodeProperties: React.FunctionComponent = () => {
  const layoutContext = useLayoutContext();
  const nodes = useNodes<INode>();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selectedNode = React.useMemo(() => nodes.find((node) => node.id === selectedId), [nodes, selectedId]);
  useOnSelectionChange({ onChange: React.useCallback(({ nodes }) => setSelectedId(nodes[0]?.id || null), []) });

  React.useEffect(() => {
    layoutContext.setAsidePropertiesOpen(!!selectedId);
  }, [selectedId]);

  if (!selectedNode) return null;
  return (
    <div className="fixed right-0 top-10 h-[calc(100vh-2.5rem)] bg-white z-20 border-l text-sm" style={{ width: layoutContext.asidePropertiesWidth + "px" }}>
      {renderNodeProperties(selectedNode)}
    </div>
  );
};

function renderNodeProperties(node: INode) {
  const Component = (NodeManager.getProperties(node) || BaseNodeProperties) as React.FunctionComponent<{ node: INode }>;
  return <Component node={node} key={node.id} />;
}
