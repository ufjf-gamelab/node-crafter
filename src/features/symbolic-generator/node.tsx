import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { ISymbolicGeneratorNode } from "@/config/types";
import { VscSymbolString } from "react-icons/vsc";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<ISymbolicGeneratorNode>;

export const SymbolicGeneratorNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.faces.length + " faces"}
      icon={
        <>
          <GiPerspectiveDiceSixFacesRandom />
          <VscSymbolString className="text-3xl -ml-1" />
        </>
      }>
      <NodeHandle id={"symbolic-gen-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
