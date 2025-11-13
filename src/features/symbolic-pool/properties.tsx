import React from "react";
import { BaseNodeProperties } from "@/components/ui/base-node-properties";
import { ISymbolicPoolNode } from "@/config/types";
import { useReactFlow } from "@xyflow/react";
import { useDebounce } from "react-use";
import { BiPlus, BiTrash } from "react-icons/bi";
import { ActionIcon, Button, TextInput, Tooltip, NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

type IProps = {
  node: ISymbolicPoolNode;
};

export const SymbolicPoolProperties: React.FunctionComponent<IProps> = ({ node }) => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const [symbols, setSymbols] = React.useState(node.data.symbols);

  function handleChangeSymbolName(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const newValue = e.target.value || "";
    const newSymbols = [...symbols];
    newSymbols[index][0] = newValue;
    setSymbols(newSymbols);
    node.data.symbols = newSymbols;
  }

  function handleChangeSymbolWeight(value: number | undefined, index: number) {
    const newValue = isNaN(Number(value)) || value === undefined ? 1 : Number(value);
    const newSymbols = [...symbols];
    newSymbols[index][1] = newValue;
    setSymbols(newSymbols);
    node.data.symbols = newSymbols;
  }

  function addNewSymbol() {
    const newSymbol: [string, number] = ["", 1];
    const newSymbols = [...symbols, newSymbol];
    setSymbols(newSymbols);
    node.data.symbols = newSymbols;
  }

  function removeSymbol(index: number) {
    const newSymbols = symbols.filter((_item, sourceIndex) => sourceIndex !== index);
    setSymbols(newSymbols);
    node.data.symbols = newSymbols;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, symbols }), 500, [symbols]);

  return (
    <BaseNodeProperties
      node={node}
      children={
        <>
          {symbols.map((_item, index) => (
            <div className="border-b py-2 w-full flex flex-col gap-2" key={"ball" + index}>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="w-32 mt-3 font-medium flex items-center gap-2" htmlFor={"symbol_" + index}>
                  <Tooltip variant="" label={t("nodeProperties.removeSymbol")}>
                    <ActionIcon variant="light" color="red" onClick={() => removeSymbol(index)} disabled={index === 0 && symbols.length === 1}>
                      <BiTrash />
                    </ActionIcon>
                  </Tooltip>
                </label>

                <TextInput
                  type="text"
                  id={"symbol_" + index}
                  label={t("nodeProperties.symbol") + " " + (index + 1)}
                  value={symbols[index][0]}
                  placeholder={t("nodeProperties.symbolPlaceholder")}
                  onChange={(e) => handleChangeSymbolName(e, index)}
                />

                <NumberInput label={t("nodeProperties.quantity")} value={symbols[index][1]} min={1} onChange={(value) => handleChangeSymbolWeight(Number(value), index)} />
              </div>
            </div>
          ))}

          <Button color="blue" variant="light" leftSection={<BiPlus className="text-lg " />} size="sm" onClick={addNewSymbol}>
            {t("nodeProperties.addNewSymbol")}
          </Button>
        </>
      }
    />
  );
};
