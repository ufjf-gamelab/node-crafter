import React from "react";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { ISymbolicGeneratorPoolNode } from "@/config/types";
import { useReactFlow } from "@xyflow/react";
import { useDebounce } from "react-use";
import { NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const SymbolicGeneratorPoolProperties: React.FunctionComponent<{ node: ISymbolicGeneratorPoolNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [quantity, setQuantity] = React.useState(node.data.quantity);

  function handleChangeQuantity(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setQuantity(newValue);
    node.data.quantity = newValue;
  }

  React.useEffect(() => {
    setQuantity(node.data.quantity);
  }, [node]);

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, quantity }), 500, [quantity]);

  return (
    <BaseNodeProperties
      node={node}
      children={<NumberInput label={t("nodeProperties.quantity")} value={quantity} onChange={handleChangeQuantity} min={1} />}
    />
  );
};
