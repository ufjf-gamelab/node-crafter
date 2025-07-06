import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { IDiceGeneratorNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceGeneratorNode>;

export const DiceGeneratorNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.min + "-" + data.max}
      icon={<GiPerspectiveDiceSixFacesOne className="text-5xl" />}>
      <NodeHandle id={"dice-gen-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
