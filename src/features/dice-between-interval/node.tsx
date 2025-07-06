import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { AiOutlineVerticalAlignMiddle } from "react-icons/ai";
import { IDiceBetweenIntervalNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceBetweenIntervalNode>;

export const DiceBetweenIntervalNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={"[" + data.min + " , " + data.max + "]"}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne className="text-5xl" />
          <AiOutlineVerticalAlignMiddle className="text-2xl" />
        </>
      }>
      <NodeHandle id={"between-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"between-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
