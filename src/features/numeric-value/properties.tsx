import React from "react";
import { useReactFlow } from "@xyflow/react";
import { useDebounce } from "react-use";
import { NumberInput, Tooltip, ActionIcon, TextInput, Button } from "@mantine/core";
import { INumericValueNode } from "@/config/types";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export const NumericValueProperties: React.FunctionComponent<{ node: INumericValueNode }> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [valueList, setValueList] = React.useState(Object.entries(node.data.valuesConversionDictionary));

  function updateValueAtIndex(index: number, key: string, value: number) {
    const newValueList = [...valueList];
    newValueList[index] = [key, value];
    setValueList(newValueList);
  }

  function addNewValue() {
    setValueList([...valueList, ["", 0]]);
  }

  function removeValueAtIndex(index: number) {
    const newValueList = [...valueList];
    newValueList.splice(index, 1);
    setValueList(newValueList);
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, valuesConversionDictionary: Object.fromEntries(valueList) }), 500, [valueList]);

  return (
      <BaseNodeProperties
        node={node}
        children={
          <>
            {valueList.map((_item, index) => (
              <div className="border-b py-2 w-full flex flex-col gap-2" key={"ball" + index}>
                <div className="w-full flex items-center justify-between gap-2">
                  <label className="w-32 mt-3 font-medium flex items-center gap-2" htmlFor={"symbol_" + index}>
                    <Tooltip variant="" label={t("nodeProperties.removeSymbol")}>
                      <ActionIcon variant="light" color="red" onClick={() => removeValueAtIndex(index)} disabled={index === 0 && valueList.length === 1}>
                        <BiTrash />
                      </ActionIcon>
                    </Tooltip>
                  </label>
  
                  <TextInput
                    type="text"
                    id={"symbol_" + index}
                    label={t("nodeProperties.symbol")}
                    value={valueList[index][0]}
                    placeholder={t("nodeProperties.symbolPlaceholder")}
                    onChange={(e) => updateValueAtIndex(index, e.target.value, Number(valueList[index][1]))}
                  />
  
                  <NumberInput label={t("nodeProperties.value")} value={valueList[index][1]} onChange={(value) => updateValueAtIndex(index, String(valueList[index][0]), Number(value))} />
                </div>
              </div>
            ))}
  
            <Button color="blue" variant="light" leftSection={<BiPlus className="text-lg " />} size="sm" onClick={addNewValue}>
              {t("nodeProperties.addNewSymbol")}
            </Button>
          </>
        }
      />
    );
};
