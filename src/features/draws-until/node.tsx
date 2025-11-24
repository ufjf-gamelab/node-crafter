/// <reference types="vite-plugin-svgr/client" />
import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import DrawsUntilIcon from "@/assets/icons/svg/draw-symbols.svg?react"
import HaltIcon from "@/assets/icons/svg/halt.svg?react"
import { IDrawsUntilNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDrawsUntilNode>;

export const DrawsUntilNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
      <BaseNode
          id={id}
          selected={selected}
          name={data.name}
          label={data.drawAmount}
          status={data.status}
          icon={
              <>
                  <DrawsUntilIcon className="w-14 h-14 mb-3" />
                  <HaltIcon className="w-7 h-7 -ml-2 mt-1" />
              </>
          }
      >
          <NodeHandle
              id={"draw-target-" + id}
              type="target"
              dataType={data.inputType}
              position={Position.Left}
              isConnectable={isConnectable}
          />
          <NodeHandle
              id={"draw-source-" + id}
              type="source"
              dataType={data.outputType}
              position={Position.Right}
              isConnectable={isConnectable}
          />
      </BaseNode>
  );
};
