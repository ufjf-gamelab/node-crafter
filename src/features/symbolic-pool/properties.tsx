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
  const [faces, setFaces] = React.useState(node.data.faces);

  function handleChangeFaceName(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const newValue = e.target.value || "";
    const newFaces = [...faces];
    newFaces[index][0] = newValue;
    setFaces(newFaces);
    node.data.faces = newFaces;
  }

  function handleChangeFaceWeight(value: number | undefined, index: number) {
    const newValue = isNaN(Number(value)) || value === undefined ? 1 : Number(value);
    const newFaces = [...faces];
    newFaces[index][1] = newValue;
    setFaces(newFaces);
    node.data.faces = newFaces;
  }

  function addNewFace() {
    const newFace: [string, number] = ["", 1];
    const newFaces = [...faces, newFace];
    setFaces(newFaces);
    node.data.faces = newFaces;
  }

  function removeFace(index: number) {
    const newFaces = faces.filter((_item, sourceIndex) => sourceIndex !== index);
    setFaces(newFaces);
    node.data.faces = newFaces;
  }

  useDebounce(() => flow.updateNodeData(node.id, { ...node.data, faces }), 500, [faces]);

  return (
    <BaseNodeProperties
      node={node}
      children={
        <>
          {faces.map((_item, index) => (
            <div className="border-b py-2 w-full flex flex-col gap-2" key={"ball" + index}>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="w-32 mt-3 font-medium flex items-center gap-2" htmlFor={"face_" + index}>
                  <Tooltip variant="" label={t("nodeProperties.removeFace")}>
                    <ActionIcon variant="light" color="red" onClick={() => removeFace(index)} disabled={index === 0 && faces.length === 1}>
                      <BiTrash />
                    </ActionIcon>
                  </Tooltip>
                </label>

                <TextInput
                  type="text"
                  id={"face_" + index}
                  label={t("nodeProperties.face") + " " + (index + 1)}
                  value={faces[index][0]}
                  placeholder={t("nodeProperties.facePlaceholder")}
                  onChange={(e) => handleChangeFaceName(e, index)}
                />

                <NumberInput label={t("nodeProperties.quantity")} value={faces[index][1]} onChange={(value) => handleChangeFaceWeight(Number(value), index)} />
              </div>
            </div>
          ))}

          <Button color="blue" variant="light" leftSection={<BiPlus className="text-lg " />} size="sm" onClick={addNewFace}>
            {t("nodeProperties.addNewFace")}
          </Button>
        </>
      }
    />
  );
};
