import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { GiDiceTarget, GiRollingDiceCup } from "react-icons/gi";
import { TiArrowLoop } from "react-icons/ti";
import { IDiceExplodeNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDiceExplodeNode>;

export const DiceExplodeNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.explodeFace}
      icon={
        <>
          <GiDiceTarget />
          <div className="flex flex-col text-2xl -ml-1">
            <GiRollingDiceCup />
            <TiArrowLoop />
          </div>
        </>
      }>
      <NodeHandle id={"explode-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"explode-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
