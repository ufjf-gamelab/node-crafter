import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiRollingDices } from "react-icons/gi";
import { VscSymbolString } from "react-icons/vsc";
import { ISymbolicPoolNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<ISymbolicPoolNode>;

export const SymbolicPoolNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.quantity}
      icon={
        <>
          <GiRollingDices className="text-5xl" />
          <VscSymbolString className="text-2xl" />
        </>
      }>
      <NodeHandle id={"symbolic-pool-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />

      <NodeHandle
        id={"symbolic-pool-source-" + id}
        type="source"
        dataType={data.outputType}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </BaseNode>
  );
};
