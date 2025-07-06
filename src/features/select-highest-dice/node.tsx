import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { ISelectHighestDiceNode } from "@/config/types";
import { GiRollingDices } from "react-icons/gi";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { LiaArrowUpSolid } from "react-icons/lia";

type IProps = NodeProps<ISelectHighestDiceNode>;

export const SelectHighestDiceNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      icon={
        <>
          <GiRollingDices />
          <LiaArrowUpSolid className="text-2xl -ml-1" />
        </>
      }>
      <NodeHandle id={"success-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
