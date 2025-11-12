import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { ISymbolicPoolNode } from "@/config/types";
import { VscSymbolString } from "react-icons/vsc";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { useTranslation } from "react-i18next";

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
          <GiPerspectiveDiceSixFacesRandom />
          <VscSymbolString className="text-3xl -ml-1" />
        </>
      }>
      <NodeHandle id={"symbolic-pool-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
