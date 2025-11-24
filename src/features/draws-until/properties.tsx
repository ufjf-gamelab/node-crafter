import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput, Text, Checkbox, Button, Tooltip, TextInput, ActionIcon} from "@mantine/core";
import { BiPlus, BiTrash } from "react-icons/bi";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { IDrawsUntilNode } from "@/config/types";
import { useTranslation } from "react-i18next";

export const DrawsUntilProperties: React.FunctionComponent<{ node: IDrawsUntilNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [drawAmount, setDrawAmount] = React.useState(node.data.drawAmount);
  const [replacement, setReplacement] = React.useState(node.data.replacement);
  const [objectives, setObjectives] = React.useState(node.data.objectives);

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

  function handleChangeObjectiveSymbol(value: string, index: number) {
    const newObjectives = [...objectives];
    newObjectives[index].symbol = value;
    setObjectives(newObjectives);
    node.data.objectives = newObjectives;
  }

  function handleChangeObjectiveCount(value: number, index: number) {
    const newObjectives = [...objectives];
    newObjectives[index].count = value;
    setObjectives(newObjectives);
    node.data.objectives = newObjectives;
  }

  function removeObjective(index: number) {
    const newObjectives = [...objectives];
    newObjectives.splice(index, 1);
    setObjectives(newObjectives);
    node.data.objectives = newObjectives;
  }

  function addNewObjective() {
    const newObjectives = [...objectives, { symbol: "A", count: 1 }];
    setObjectives(newObjectives);
    node.data.objectives = newObjectives;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, drawAmount, replacement, objectives }), 500, [drawAmount, replacement, objectives]);

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
                  <div className="mt-2">
                  <Text>{t("nodeProperties.objectives")}</Text>
                  {objectives.map((_item, index) => (
                              <div className="border-b py-2 w-full flex flex-col gap-2" key={"ball" + index}>
                                <div className="w-full flex items-center justify-between gap-2">
                                  <label className="w-18 mt-3 font-medium flex items-center gap-2" htmlFor={"symbol_" + index}>
                                    <Tooltip variant="" label={t("nodeProperties.removeSymbol")}>
                                      <ActionIcon variant="light" color="red" onClick={() => removeObjective(index)} disabled={index === 0 && objectives.length === 1}>
                                        <BiTrash />
                                      </ActionIcon>
                                    </Tooltip>
                                  </label>
                  
                                  <TextInput
                                    type="text"
                                    id={"symbol_" + index}
                                    label={t("nodeProperties.symbol") + " " + (index + 1)}
                                    value={objectives[index].symbol}
                                    placeholder={t("nodeProperties.symbolPlaceholder")}
                                    onChange={(e) => handleChangeObjectiveSymbol(e.target.value, index)}
                                  />
                  
                                  <NumberInput label={t("nodeProperties.quantity")} value={objectives[index].count} min={1} onChange={(value) => handleChangeObjectiveCount(Number(value), index)} />
                                </div>
                              </div>
                            ))}
                  
                            <Button color="blue" variant="light" leftSection={<BiPlus className="text-lg " />} size="sm" onClick={addNewObjective}>
                              {t("nodeProperties.addNewObjective")}
                            </Button>
                            </div>
              </>
          }
      />
  );
};
