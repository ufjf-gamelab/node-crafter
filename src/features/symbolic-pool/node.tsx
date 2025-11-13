/// <reference types="vite-plugin-svgr/client" />
import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { ISymbolicPoolNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { useTranslation } from "react-i18next";
import SymbolicPoolIcon from "@/assets/icons/svg/symbolic-pool.svg?react"

type IProps = NodeProps<ISymbolicPoolNode>;

export const SymbolicPoolNode: React.ComponentType<IProps> = ({ data, isConnectable, selected, id }) => {
  const { t } = useTranslation();

  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={data.symbols.length + " " + t("nodeProperties.symbols")}
      icon={
        <>
          <SymbolicPoolIcon className="w-14 h-14"/>
        </>
      }>
      <NodeHandle id={"symbolic-pool-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
