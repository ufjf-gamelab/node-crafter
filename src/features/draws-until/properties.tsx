import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput, Checkbox} from "@mantine/core";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { IDrawsUntilNode } from "@/config/types";
import { useTranslation } from "react-i18next";

export const DrawsUntilProperties: React.FunctionComponent<{ node: IDrawsUntilNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [drawAmount, setDrawAmount] = React.useState(node.data.drawAmount);
  const [replacement, setReplacement] = React.useState(node.data.replacement);

  function handleChangeDrawAmount(value: string | number) {
    const newValue = isNaN(Number(value)) ? 1 : Number(value);
    setDrawAmount(newValue);
    node.data.drawAmount = newValue;
  }

  function handleChangeReplacement(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.currentTarget.checked;
    setReplacement(checked);
    node.data.replacement = checked;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, drawAmount, replacement }), 500, [drawAmount, replacement]);

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
                  <Checkbox label={t("nodeProperties.replacement")} checked={replacement} onChange={handleChangeReplacement} />
              </>
          }
      />
  );
};
