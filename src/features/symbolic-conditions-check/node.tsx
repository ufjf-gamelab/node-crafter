/// <reference types="vite-plugin-svgr/client" />
import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import SymbolicConditionsCheckIcon from "@/assets/icons/svg/draw-symbols.svg?react"
import { GiGearStickPattern } from "react-icons/gi";
import { ISymbolicConditionsCheckNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";

type IProps = NodeProps<ISymbolicConditionsCheckNode>;

export const SymbolicConditionsCheckNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  return (
      <BaseNode
          id={id}
          selected={selected}
          name={data.name}
          label={data.conditions[0] ? `${data.conditions[0].symbol} ${data.conditions[0].type} ${data.conditions[0].count}` : "No Conditions"}
          status={data.status}
          icon={
              <>
                  <SymbolicConditionsCheckIcon className="w-14 h-14 mb-3" />
                  <GiGearStickPattern className="text-2xl -ml-1" />
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
