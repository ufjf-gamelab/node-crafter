import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { ISelectRandomSymbolNode } from "@/config/types";
import { GiRollingDices } from "react-icons/gi";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { VscSymbolString } from "react-icons/vsc";
import { LiaRandomSolid } from "react-icons/lia";

type IProps = NodeProps<ISelectRandomSymbolNode>;

export const SelectRandomSymbolicNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      icon={
        <>
          <GiRollingDices className="text-5xl" />
          <div className="flex flex-col justify-center items-center">
            <VscSymbolString className="text-2xl" />
            <LiaRandomSolid className="text-xl " />
          </div>
        </>
      }>
      <NodeHandle id={"success-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"success-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
