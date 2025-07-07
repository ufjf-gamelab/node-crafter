import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IMergeDicePoolsNode } from "@/config/types";
import { GiRollingDices } from "react-icons/gi";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IMergeDicePoolsNode>;

export const MergeDicePoolsNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      icon={
        <>
          <GiRollingDices />
          <div className="flex flex-col justify-center items-center">
            <span className="text-3xl mb-2">{"}"}</span>
          </div>
        </>
      }>
      <NodeHandle
        id={"success-target1-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-6"
      />
      <NodeHandle
        id={"success-target2-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-16"
      />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
