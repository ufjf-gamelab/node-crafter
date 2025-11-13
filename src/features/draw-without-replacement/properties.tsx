import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput } from "@mantine/core";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { IDrawWithoutReplacementNode } from "@/config/types";
import { useTranslation } from "react-i18next";

export const DrawWithoutReplacementProperties: React.FunctionComponent<{ node: IDrawWithoutReplacementNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [draws, setDraws] = React.useState(node.data.draws);

  function handleChangeExplodeFace(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setDraws(newValue);
    node.data.draws = newValue;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, draws }), 500, [draws]);

  return (
    <BaseNodeProperties
      node={node}
      children={<NumberInput label={t("nodeProperties.draws")} value={draws} min={1} onChange={handleChangeExplodeFace} />}
    />
  );
};
