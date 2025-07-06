import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiGearStickPattern, GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { IAndLogicalNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IAndLogicalNode>;

export const AndLogicalNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }: IProps) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne className="text-5xl" />
          <div className="flex flex-col items-center justify-center text-center -ml-1">
            <GiGearStickPattern className="text-xl " />
            <span className="text-base">&and;</span>
          </div>
        </>
      }>
      <NodeHandle
        id={"and-target-1-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-7"
      />
      <NodeHandle
        id={"and-target-2-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-16"
      />

      <NodeHandle id={"and-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
