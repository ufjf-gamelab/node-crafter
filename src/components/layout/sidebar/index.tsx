import { FunctionComponent } from "react";
import { Accordion, ActionIcon, Select, Tooltip } from "@mantine/core";
import { GiGearStickPattern, GiPerspectiveDiceOne, GiPerspectiveDiceSixFacesRandom, GiSwapBag } from "react-icons/gi";
import { IoBarChartSharp, IoFilterSharp } from "react-icons/io5";
import { VscTrash } from "react-icons/vsc";
import { BiMath, BiWorld } from "react-icons/bi";
import { useReactFlow } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { IEdge, INode } from "@/config/types";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { SidebarItem } from "./sidebar-item";

const Sidebar: FunctionComponent = () => {
  const flow = useReactFlow<INode, IEdge>();
  const { t, i18n } = useTranslation();

  function clearBoard() {
    flow.setEdges([]);
    flow.setNodes([]);
  }

  function changeLanguage(lang: string | null) {
    if (!lang) return;
    i18n.changeLanguage(lang);
  }

  return (
    <aside className="text-[14px] text-slate-900 fixed z-20 left-0 top-0 bg-white h-screen w-48 flex flex-col border-r select-none">
      <div className="px-4 mt-2 mb-2">
        <img src="logo/md.png" alt="Node Crafter logo" className="w-full pointer-events-none" draggable={false} />
      </div>

      <Accordion
        variant="contained"
        chevronPosition="right"
        defaultValue={["dice", "output"]}
        classNames={{ content: "p-0", item: "border-x-0" }}
        multiple>
        <Accordion.Item value="dice">
          <Accordion.Control icon={<GiPerspectiveDiceOne className="text-[22px]" />}>{t("common.dice")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="diceGenerator" fullName />
              <SidebarItem nodeType="diceExplode" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="symbolic">
          <Accordion.Control icon={<GiPerspectiveDiceSixFacesRandom className="text-[22px]" />}>{t("common.symbolic")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="symbolicGenerator" fullName />
              <SidebarItem nodeType="bagPullWithoutRepetition" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="operations">
          <Accordion.Control icon={<BiMath className="text-[22px]" />}>{t("common.operations")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="diceMath" />
              <SidebarItem nodeType="diceAbsolute" />
              <SidebarItem nodeType="diceCountRepetition" />
              <SidebarItem nodeType="dicePoolSum" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="parameters">
          <Accordion.Control icon={<HiOutlineAdjustmentsHorizontal className="text-[22px]" />}>{t("common.parameters")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="integerValue" />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="logical">
          <Accordion.Control icon={<GiGearStickPattern className="text-[22px]" />}>{t("common.logical")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="diceLogical" />
              <SidebarItem nodeType="andLogical" />
              <SidebarItem nodeType="orLogical" />
              <SidebarItem nodeType="diceSuccess" />
              <SidebarItem nodeType="diceBetweenInterval" />
              <SidebarItem nodeType="valueIsEven" />
              <SidebarItem nodeType="valueIsOdd" />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pools">
          <Accordion.Control icon={<GiSwapBag className="text-[22px]" />}>{t("common.pools")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="dicePool" fullName />
              <SidebarItem nodeType="mergeDicePools" fullName />
              <SidebarItem nodeType="symbolicGeneratorPool" fullName />
              <SidebarItem nodeType="symbolicPool" fullName />
              <SidebarItem nodeType="drawSymbols" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="filters">
          <Accordion.Control icon={<IoFilterSharp className="text-[22px]" />}>{t("common.filters")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="selectRandomDice" fullName />
              <SidebarItem nodeType="selectHighestDice" fullName />
              <SidebarItem nodeType="selectRandomSymbol" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="output">
          <Accordion.Control icon={<IoBarChartSharp className="text-[22px]" />}>{t("common.output")}</Accordion.Control>

          <Accordion.Panel className="bg-white">
            <ul className="flex flex-col">
              <SidebarItem nodeType="histogram" fullName />
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <div className="flex justify-between gap-4 items-end h-full pb-2 px-2">
        <Tooltip label={t("sidebar.clearTooltip")}>
          <ActionIcon variant="filled" color="red" onClick={clearBoard}>
            <VscTrash />
          </ActionIcon>
        </Tooltip>

        <Select
          size="xs"
          leftSection={<BiWorld className="text-[18px]" />}
          value={i18n.language}
          onChange={changeLanguage}
          data={[
            { label: t("sidebar.english"), value: "en" },
            { label: t("sidebar.portuguese"), value: "pt-BR" },
          ]}
        />
      </div>
    </aside>
  );
};

export { Sidebar };
