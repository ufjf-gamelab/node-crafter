import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiGearStickPattern, GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { IDiceLogicalNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceLogicalNode>;

export const DiceLogicalNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }: IProps) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.operation}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne className="text-5xl" />
          <GiGearStickPattern className="text-2xl -ml-1" />
        </>
      }>
      <NodeHandle
        id={"logical-target-1-" + id}
        type="target"
        dataType={data.inputType}
        className="top-6"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        id={"logical-target-2-" + id}
        type="target"
        dataType={data.inputType}
        className="top-16"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <NodeHandle id={"logical-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
