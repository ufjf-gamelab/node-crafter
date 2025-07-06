import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { IoBarChartSharp } from "react-icons/io5";
import { NodeHandle } from "@/components/ui/node-handle";
import { BaseNode } from "@/components/ui/base-node";
import { IHistogramNode } from "@/config/types";

type IProps = NodeProps<IHistogramNode>;

export const HistogramNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }) => {
  return (
    <BaseNode id={id} selected={selected} name={data.name} status={data.status} icon={<IoBarChartSharp className="text-5xl" />}>
      <NodeHandle type="target" id={"histogram-target-" + id} position={Position.Left} isConnectable={isConnectable} />
    </BaseNode>
  );
};
