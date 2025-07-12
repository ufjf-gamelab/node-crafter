import { IEdge, INode, INodeType } from "@/config/types";
import { useDocumentationContext } from "@/contexts/documentation-context";
import { NodeManager } from "@/utils/node-manager";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { ReactFlowState, useReactFlow, useStore } from "@xyflow/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { BiSolidHelpCircle } from "react-icons/bi";

type IProps = {
  nodeType: INodeType;
  fullName?: boolean;
};

const SidebarItem: React.FC<IProps> = ({ nodeType, fullName }) => {
  const flow = useReactFlow<INode, IEdge>();
  const { openDoc } = useDocumentationContext();
  const { t } = useTranslation();
  const { hovered, ref } = useHover();
  const unselectAllNodes = useStore((state: ReactFlowState) => state.unselectNodesAndEdges);

  function addNode(e: React.MouseEvent) {
    e.stopPropagation();
    unselectAllNodes();

    const newNode = NodeManager.new(nodeType, flow);
    newNode.selected = true;
    flow.addNodes([newNode]);
  }

  function openNodeDoc(e: React.MouseEvent) {
    e.stopPropagation();
    openDoc(nodeType);
  }

  return (
    <li ref={ref} className="sidebar-item relative overflow-hidden" onClick={addNode}>
      <span>{fullName ? t(`nodeFullName.${nodeType}`) : t(`nodeShortName.${nodeType}`)}</span>

      {hovered && (
        <Tooltip label={t("sidebar.helpTooltip")}>
          <ActionIcon
            color="dark"
            variant="subtle"
            onClick={openNodeDoc}
            size="sm"
            className="absolute top-0 right-0 !w-[25px] !h-[30px] text-slate-600 rounded-none">
            <BiSolidHelpCircle />
          </ActionIcon>
        </Tooltip>
      )}
    </li>
  );
};

export { SidebarItem };
