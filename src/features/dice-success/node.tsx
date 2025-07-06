import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IDiceSuccessNode } from "@/config/types";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { BsChevronBarUp, BsFillQuestionSquareFill } from "react-icons/bs";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceSuccessNode>;

export const DiceSuccessNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.face}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne />
          <div className="flex flex-col justify-center items-center -ml-1">
            <BsChevronBarUp className="text-2xl" />
            <BsFillQuestionSquareFill className="text-lg" />
          </div>
        </>
      }>
      <NodeHandle id={"success-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
