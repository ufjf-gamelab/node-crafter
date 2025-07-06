import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IIntegerValueNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IIntegerValueNode>;

export const IntegerValueNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.value}
      icon={<span className="font-semibold">&#8484;</span>}>
      <NodeHandle id={"dice-gen-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
