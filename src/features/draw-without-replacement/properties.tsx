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
  const [drawAmount, setDrawAmount] = React.useState(node.data.drawAmount);

  function handleChangeExplodeFace(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setDrawAmount(newValue);
    node.data.drawAmount = newValue;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, drawAmount }), 500, [drawAmount]);

  return (
    <BaseNodeProperties
      node={node}
      children={<NumberInput label={t("nodeProperties.drawAmount")} value={drawAmount} min={1} onChange={handleChangeExplodeFace} />}
    />
  );
};
