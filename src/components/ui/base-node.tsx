import { IEdge, INode, INodeStatus } from "@/config/types";
import React, { ReactNode } from "react";
import { NodeStatus } from "./node-status";
import { ActionIcon, Tooltip } from "@mantine/core";
import { ReactFlowState, useReactFlow, useStore } from "@xyflow/react";
import { NodeManager } from "@/utils/node-manager";
import { TbX } from "react-icons/tb";
import { BiCopy } from "react-icons/bi";
import { useTranslation } from "react-i18next";

type IProps = {
  name: string;
  icon: ReactNode;
  status: INodeStatus;
  id: string;
  children?: ReactNode;
  selected?: boolean;
  label?: ReactNode;
};

export const BaseNode: React.FC<IProps> = ({ children, selected, name, label, icon, status, id, ...restProps }) => {
  const flow = useReactFlow<INode, IEdge>();
  const { unselectAll } = useStore((state: ReactFlowState) => ({ unselectAll: state.unselectNodesAndEdges }));
  const { t } = useTranslation();

  function handleDuplicateNode(e: React.MouseEvent) {
    e.stopPropagation();
    NodeManager.duplicate(flow, id);
  }
  function handleDeleteNode(e: React.MouseEvent) {
    e.stopPropagation();
    unselectAll();
    flow.deleteElements({ nodes: [{ id }] });
  }

  return (
    <div
      className={"w-[95px] h-[95px] rounded-sm border border-gray-400/80 cursor-move relative " + `${selected ? "bg-blue-200" : "bg-white"}`}
      {...restProps}>
      {children}

      {selected && (
        <>
          <Tooltip label={t("common.duplicate")}>
            <ActionIcon
              variant="filled"
              size="14px"
              className="absolute -top-[17px] right-[18px] text-[9px] flex justify-center items-center z-10"
              draggable={false}
              onMouseDownCapture={handleDuplicateNode}>
              <BiCopy />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t("common.delete")}>
            <ActionIcon
              variant="filled"
              color="red"
              size="14px"
              className="absolute -top-[17px] right-[2px] text-[9px] flex justify-center items-center z-10"
              draggable={false}
              onMouseDownCapture={handleDeleteNode}>
              <TbX />
            </ActionIcon>
          </Tooltip>
        </>
      )}

      <div className="flex flex-col items-center justify-center w-full h-full">
        <NodeStatus status={status} className="absolute top-1 left-1/2 -translate-x-1/2" />

        <div className="flex justify-center items-center text-5xl">{icon}</div>

        {label && <span className="w-full text-center text-[11px] absolute bottom-1 left-1/2 -translate-x-1/2">{label}</span>}

        <span className="absolute top-0 translate-y-[95px] w-full max-[110px] text-sm leading-tight break-words text-center">{name}</span>
      </div>
    </div>
  );
};
