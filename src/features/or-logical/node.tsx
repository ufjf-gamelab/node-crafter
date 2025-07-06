import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiGearStickPattern, GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { IOrLogicalNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IOrLogicalNode>;

export const OrLogicalNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }: IProps) => {
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
            <span className="text-base">&or;</span>
          </div>
        </>
      }>
      <NodeHandle
        id={"or-target-1-" + id}
        type="target"
        dataType={data.inputType}
        className="top-6"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        id={"or-target-2-" + id}
        type="target"
        dataType={data.inputType}
        className="top-16"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <NodeHandle id={"or-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
