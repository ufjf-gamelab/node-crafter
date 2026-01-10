import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { INumericValueNode } from "@/config/types";
import DrawSymbolsIcon from "@/assets/icons/svg/draw-symbols.svg?react"
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<INumericValueNode>;
export const NumericValueNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.valuesConversionDictionary ? Object.entries(data.valuesConversionDictionary)[0][0] + ": " + Object.entries(data.valuesConversionDictionary)[0][1] : ""}
      icon={<><DrawSymbolsIcon className="w-10 h-10 mb-4" /><span className="font-semibold text-2xl mt-4 mb-4">= &#8484;</span></>}>
      <NodeHandle id={"dice-gen-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
      <NodeHandle id={"dice-gen-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
    </BaseNode>
  );
};
