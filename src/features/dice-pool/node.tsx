import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiRollingDices } from "react-icons/gi";
import { IDicePoolNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDicePoolNode>;

export const DicePoolNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <BaseNode id={id} selected={selected} name={data.name} status={data.status} label={data.quantity} icon={<GiRollingDices />}>
      <NodeHandle id={"pool-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"pool-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
