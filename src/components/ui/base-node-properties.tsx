import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { useElementSize } from "@mantine/hooks";
import { useDocumentationContext } from "@/contexts/documentation-context";
import { Button, ScrollArea, TextInput } from "@mantine/core";
import { BiSolidCog, BiSolidHelpCircle } from "react-icons/bi";
import { INode } from "@/config/types";

type IProps = {
  node: INode;
  children?: React.ReactNode;
};

export const BaseNodeProperties: React.FunctionComponent<IProps> = ({ node, children }) => {
  const flow = useReactFlow();
  const { t } = useTranslation();
  const { ref: titleElRef, height: titleHeight } = useElementSize();
  const [name, setName] = React.useState(node.data.name);
  const { openDoc } = useDocumentationContext();

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, name }), 500, [name]);

  const scrollAreaHeight = React.useMemo(() => {
    if (!titleHeight) return 0;
    return window.innerHeight - (titleHeight + 10);
  }, [titleHeight]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b-1 px-2 py-4 text-center text-xl" ref={titleElRef}>
        <h2>{t(`nodeFullName.${node.type}`)}</h2>
      </div>

      <ScrollArea type="hover" h={scrollAreaHeight}>
        <Button
          variant="default"
          className="w-full border-x-0 pointer-events-none"
          radius="0"
          tabIndex={-1}
          leftSection={<BiSolidCog className="text-slate-700 text-[22px]" />}>
          {t("nodeProperties.properties")}
        </Button>

        <div className="flex flex-col gap-2 px-3 pt-2 pb-4">
          <TextInput label={t("nodeProperties.nodeId")} value={node.id} readOnly />
          <TextInput label={t("nodeProperties.status")} value={t(`nodeStatus.${node.data.status}`)} readOnly />
          <TextInput
            label={t("nodeProperties.name")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              node.data.name = e.target.value;
            }}
          />
          {children}
        </div>

        <Button
          variant="default"
          className="w-full border-x-0 focus:outline-1 outline-offset-0"
          radius="0"
          onClick={() => openDoc(node.type)}
          leftSection={<BiSolidHelpCircle className="text-slate-700 text-[22px]" />}>
          {t("nodeProperties.help")}
        </Button>
      </ScrollArea>
    </div>
  );
};
