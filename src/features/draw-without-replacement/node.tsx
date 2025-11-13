import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiRollingDiceCup } from "react-icons/gi";
import { IDrawWithoutReplacementNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDrawWithoutReplacementNode>;

export const DrawWithoutReplacementNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <BaseNode id={id} selected={selected} name={data.name} label={data.pulls} status={data.status} icon={<GiRollingDiceCup />}>
      <NodeHandle id={"pull-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"pull-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
