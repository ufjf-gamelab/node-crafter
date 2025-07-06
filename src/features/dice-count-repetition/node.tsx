import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IDiceCountRepetitionNode } from "@/config/types";
import { GiDiceTarget } from "react-icons/gi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceCountRepetitionNode>;

export const DiceCountRepetitionNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.face}
      icon={
        <>
          <AiOutlineFieldNumber className="text-xl" />
          <GiDiceTarget />
        </>
      }>
      <NodeHandle id={"count-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"count-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
