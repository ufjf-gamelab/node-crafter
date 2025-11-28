import React from "react";
import { useDebounce } from "react-use";
import { useReactFlow } from "@xyflow/react";
import { NumberInput, Text, Select, Button, Tooltip, TextInput, ActionIcon} from "@mantine/core";
import { BiPlus, BiTrash } from "react-icons/bi";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { ISymbolicConditionsCheckNode, ISymbolicConditionsCheckType } from "@/config/types";
import { useTranslation } from "react-i18next";

export const SymbolicConditionsCheckProperties: React.FunctionComponent<{ node: ISymbolicConditionsCheckNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [conditions, setConditions] = React.useState(node.data.conditions);

  function handleChangeConditionSymbol(value: string, index: number) {
    const updatedConditions = [...conditions];
    updatedConditions[index].symbol = value;
    setConditions(updatedConditions);
    node.data.conditions = updatedConditions;
  }

  function handleChangeConditionType(value: ISymbolicConditionsCheckType, index: number) {
    const updatedConditions = [...conditions];
    updatedConditions[index].type = value;
    setConditions(updatedConditions);
    node.data.conditions = updatedConditions;
  }

  function handleChangeConditionCount(value: number, index: number) {
    const updatedConditions = [...conditions];
    updatedConditions[index].count = value;
    setConditions(updatedConditions);
    node.data.conditions = updatedConditions;
  }

  function addNewCondition() {
    const updatedConditions = [...conditions, { symbol: "", type: ">=" as ISymbolicConditionsCheckType, count: 1 }];
    setConditions(updatedConditions);
    node.data.conditions = updatedConditions;
  }

  function removeCondition(index: number) {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
    node.data.conditions = updatedConditions;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, conditions }), 500, [conditions]);

  return (
      <BaseNodeProperties
          node={node}
          children={
              <>
                  <Text>{t("nodeProperties.conditions")}</Text>
                  {conditions.map((_item, index) => (
                      <div
                          className="border-b py-2 w-full flex flex-col gap-2"
                          key={"ball" + index}
                      >
                          <div className="w-full flex-col items-center justify-between gap-2">
                            <div className="mt-2 flex flex-row gap-2 w-full">
                              <label
                                  className="w-18 mt-3 font-medium flex items-center gap-2"
                                  htmlFor={"symbol_" + index}
                              >
                                  <Tooltip
                                      variant=""
                                      label={t("nodeProperties.removeSymbol")}
                                  >
                                      <ActionIcon
                                          variant="light"
                                          color="red"
                                          onClick={() => removeCondition(index)}
                                          disabled={
                                              index === 0 &&
                                              conditions.length === 1
                                          }
                                      >
                                          <BiTrash />
                                      </ActionIcon>
                                  </Tooltip>
                              </label>

                              <TextInput
                                  type="text"
                                  id={"symbol_" + index}
                                  label={t("nodeProperties.symbol")}
                                  value={conditions[index].symbol}
                                  placeholder={t(
                                      "nodeProperties.symbolPlaceholder"
                                  )}
                                  onChange={(e) =>
                                      handleChangeConditionSymbol(
                                          e.target.value,
                                          index
                                      )
                                  }
                              />
                              </div>

                              <div className="mt-2 flex flex-row gap-2 w-full">
                                  <Select
                                      label={t("nodeProperties.conditionType")}
                                      data={[">=", "=", "<="]}
                                      value={conditions[index].type}
                                      onChange={(value) =>
                                          handleChangeConditionType(
                                              value as ISymbolicConditionsCheckType,
                                              index
                                          )
                                      }
                                  />

                                  <NumberInput
                                      label={t("nodeProperties.quantity")}
                                      value={conditions[index].count}
                                      min={1}
                                      onChange={(value) =>
                                          handleChangeConditionCount(
                                              Number(value),
                                              index
                                          )
                                      }
                                  />
                              </div>
                          </div>
                      </div>
                  ))}

                  <Button
                      color="blue"
                      variant="light"
                      leftSection={<BiPlus className="text-lg " />}
                      size="sm"
                      onClick={addNewCondition}
                  >
                      {t("nodeProperties.addNewCondition")}
                  </Button>
              </>
          }
      />
  );
};
