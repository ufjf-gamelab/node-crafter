import React from "react";
import { NodeProps, Position } from "@xyflow/react";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { BiMath } from "react-icons/bi";
import { IDiceMathNode } from "@/config/types";
import { BaseNode } from "@/components/ui/base-node";
import { NodeHandle } from "@/components/ui/node-handle";
import { useTranslation } from "react-i18next";

type IProps = NodeProps<IDiceMathNode>;

export const DiceMathNode: React.ComponentType<IProps> = ({ data, selected, isConnectable, id }: IProps) => {
  const { t } = useTranslation();
  return (
    <BaseNode
      id={id}
      selected={selected}
      name={data.name}
      status={data.status}
      label={t(`nodeProperties.${data.operation}`)}
      icon={
        <>
          <GiPerspectiveDiceSixFacesOne className="text-5xl" />
          <BiMath className="text-2xl -ml-1" />
        </>
      }>
      <NodeHandle
        id={"math-target-1-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-6"
      />
      <NodeHandle
        id={"math-target-2-" + id}
        type="target"
        dataType={data.inputType}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-16"
      />

      <NodeHandle id={"math-source-" + id} type="source" dataType={data.outputType} position={Position.Right} isConnectable={isConnectable} />
    </BaseNode>
  );
};
