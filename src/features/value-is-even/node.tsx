import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IValueIsEvenNode } from "@/config/types";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IValueIsEvenNode>;

export const ValueIsEvenNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne />
          <div className="flex flex-col justify-center items-center -ml-1 ">
            <span className="text-lg -mb-2 font-bold">%</span>
            <span className="text-lg font-semibold">0</span>
          </div>
        </>
      }>
      <NodeHandle id={"success-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
