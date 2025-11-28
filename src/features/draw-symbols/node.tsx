/// <reference types="vite-plugin-svgr/client" />
import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import DrawSymbolsIcon from "@/assets/icons/svg/draw-symbols.svg?react"
import RecycleIcon from "@/assets/icons/svg/recycle.svg?react"
import { IDrawSymbolsNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<IDrawSymbolsNode>;

export const DrawSymbolsNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
      <BaseNode
          id={id}
          selected={selected}
          name={data.name}
          label={data.drawAmount}
          status={data.status}
          icon={
              <>
                  <DrawSymbolsIcon className="w-14 h-14 mb-3" />
                  {data.replacement && (
                      <RecycleIcon className="w-5 h-5 absolute right-2 top-2" />
                  )}
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
