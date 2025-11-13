/// <reference types="vite-plugin-svgr/client" />
import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import DrawWithoutReplacementIcon from "@/assets/icons/svg/draw-without-replacement.svg?react"
import { IDrawWithoutReplacementNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDrawWithoutReplacementNode>;

export const DrawWithoutReplacementNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <BaseNode id={id} selected={selected} name={data.name} label={data.drawAmount} status={data.status} icon={<DrawWithoutReplacementIcon className="w-14 h-14 mb-3" />}>
      <NodeHandle id={"draw-target-" + id} type="target" dataType={data.inputType} position={Position.Left} isConnectable={isConnectable} />
      <NodeHandle id={"draw-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
