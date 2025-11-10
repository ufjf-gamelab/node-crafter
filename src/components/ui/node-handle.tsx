import React from "react";
import { useTranslation } from "react-i18next";
import { cls } from "@/utils/cls";
import { connectionHasLoop } from "@/utils/connectionHasLoop";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Tooltip } from "@mantine/core";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { IoMdSwitch } from "react-icons/io";
import { BiText } from "react-icons/bi";
import { GrEmergency } from "react-icons/gr";
import { IEdge, INode, INodeStateType } from "@/config/types";
import { PiRectangleDashedLight } from "react-icons/pi";

type IProps = {
  type: "source" | "target";
  dataType?: INodeStateType;
  id: string;
  position: Position;
  isConnectable: boolean;
  isValidConnection?: (targetId: string) => boolean;
  className?: string;
};

const NodeHandle: React.FunctionComponent<IProps> = ({ type, dataType = "any", ...props }) => {
  const { t } = useTranslation();
  const flow = useReactFlow<INode, IEdge>();

  function handleValidConnection(sourceId: string, targetId: string) {
    if (targetId === sourceId) return false;

    const hasLoop = connectionHasLoop(flow.getEdges(), sourceId, targetId);
    if (hasLoop) return false;

    const targetNode = flow.getNode(targetId);
    if (!targetNode) return false;

    if (props?.isValidConnection) return props.isValidConnection(targetId);

    if (type !== "source" || !targetNode.data.inputType) return false;
    return isValidTypeConnection({ inputType: targetNode.data.inputType, outputType: dataType });
  }

  function isValidTypeConnection({ inputType, outputType }: { inputType: INodeStateType; outputType: INodeStateType }) {
    if (inputType === "any") return true;
    if (inputType === "numeric" && outputType === "numericGenerator") return true;
    if (inputType === "symbolic" && outputType === "symbolicGenerator") return true;
    return inputType === outputType;
  }

  return (
    <Tooltip label={t(`nodeHandleTooltip.${type}.${dataType}`)} className="pointer-events-none">
      <Handle
        id={props.id}
        type={type}
        position={props.position}
        isConnectable={props.isConnectable}
        isValidConnection={(connection) => handleValidConnection(connection.source, connection.target)}
        isConnectableStart={type === "source"}
        className={cls("pointer-events-auto", props.className)}>
        <div className="flex items-center justify-center text-white pointer-events-none w-full h-full">
          {dataType === "numeric" && <AiOutlineFieldNumber className="w-3" />}
          {dataType === "numericGenerator" && (
            <div className="flex flex-col items-center justify-center">
              <AiOutlineFieldNumber className="w-3" />
              <span className="text-[5px] -mt-1">Gen</span>
            </div>
          )}
          {dataType === "numericPool" && (
            <div className="w-full relative flex items-center">
              <span className="absolute text-[9px] top-[1px] font-mono left-1/2 -translate-x-1/2">N</span>
              <PiRectangleDashedLight className="w-full rotate-90 mx" />
            </div>
          )}
          {dataType === "boolean" && <IoMdSwitch className="w-3" />}
          {dataType === "symbolic" && <BiText className="w-[11px]" />}
          {dataType === "symbolicGenerator" && (
            <div className="flex flex-col items-center justify-center">
              <BiText className="w-[11px]" />
              <span className="text-[5px] -mt-1">Gen</span>
            </div>
          )}
          {dataType === "symbolicGeneratorPool" && (
            <div className="w-full relative flex items-center">
              <BiText className="absolute w-[8px] ml-[0.5px] left-1/2 -translate-x-1/2" />
              <PiRectangleDashedLight className="w-full rotate-90" />
            </div>
          )}
          {dataType === "any" && <GrEmergency className="w-2" />}
        </div>
      </Handle>
    </Tooltip>
  );
};

export { NodeHandle };
