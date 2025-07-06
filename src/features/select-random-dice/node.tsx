import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { ISelectRandomDiceNode } from "@/config/types";
import { GiRollingDices } from "react-icons/gi";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { LiaRandomSolid } from "react-icons/lia";

type IProps = NodeProps<ISelectRandomDiceNode>;

export const SelectRandomDiceNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
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
            <LiaRandomSolid className="text-xl " />
          </div>
        </>
      }>
      <NodeHandle id={"success-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
