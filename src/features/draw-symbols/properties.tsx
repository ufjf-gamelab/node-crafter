import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput, Checkbox} from "@mantine/core";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { IDrawSymbolsNode } from "@/config/types";
import { useTranslation } from "react-i18next";

export const DrawSymbolsProperties: React.FunctionComponent<{ node: IDrawSymbolsNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [drawAmount, setDrawAmount] = React.useState(node.data.drawAmount);
  const [orderMatters, setOrderMatters] = React.useState(node.data.orderMatters);

  function handleChangeDrawAmount(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setDrawAmount(newValue);
    node.data.drawAmount = newValue;
  }

  function handleChangeOrderMatters(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.currentTarget.checked;
    setOrderMatters(checked)
    node.data.orderMatters = checked;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, drawAmount }), 500, [drawAmount]);

  return (
      <BaseNodeProperties
          node={node}
          children={
              <>
                  <NumberInput
                      label={t("nodeProperties.drawAmount")}
                      value={drawAmount}
                      min={1}
                      onChange={handleChangeDrawAmount}
                  />
                  <Checkbox label={t("nodeProperties.orderMatters")} checked={orderMatters} onChange={handleChangeOrderMatters} />
              </>
          }
      />
  );
};
