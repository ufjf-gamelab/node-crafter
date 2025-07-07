import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput } from "@mantine/core";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { IBagPullWithoutRepetitionNode } from "@/config/types";
import { useTranslation } from "react-i18next";

export const BagPullWithoutRepetitionProperties: React.FunctionComponent<{ node: IBagPullWithoutRepetitionNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [pulls, setPulls] = React.useState(node.data.pulls);

  function handleChangeExplodeFace(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setPulls(newValue);
    node.data.pulls = newValue;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, pulls }), 500, [pulls]);

  return (
    <BaseNodeProperties
      node={node}
      children={<NumberInput label={t("nodeProperties.pulls")} value={pulls} min={1} onChange={handleChangeExplodeFace} />}
    />
  );
};
