import React from "react";
import { Button, Divider, Modal } from "@mantine/core";
import { useLayoutContext } from "@/contexts/layout-context";
import { useSimulationContext } from "@/contexts/simulation-context";
import { useTranslation } from "react-i18next";
import { waitAsync } from "@/utils/waitAsync";
import { downloadElementImage } from "@/utils/downloadElementImage";

type IProps = {
  opened: boolean;
  close: () => unknown;
};

export const ModalExportCharts: React.ComponentType<IProps> = ({ opened, close }) => {
  const { t } = useTranslation();
  const { charts } = useSimulationContext();
  const { setSimulationOpen } = useLayoutContext();

  async function exportGraphImages() {
    setSimulationOpen(true);
    await waitAsync(300);
    const chartElement = document.getElementById("charts-container");
    if (!chartElement) {
      alert(t("modalImportExport.chartNotFound"));
      return;
    }

    await downloadElementImage(chartElement, "chart-graphs");
    close();
  }

  return (
    <Modal opened={opened} onClose={close} title={t("modalImportExport.modalTitle")} classNames={{ title: "text-xl font-medium" }} centered>
      <Divider mb="md" />

      <div className="flex flex-col gap-4 pb-4">
        <span>{t("modalImportExport.exportTitle")}</span>

        <Button leftSection={<span />} color="green" disabled={charts.length === 0} onClick={exportGraphImages}>
          {t("modalImportExport.downloadGraphs")} <span className="text-gray-400">(.png)</span>
        </Button>
      </div>
    </Modal>
  );
};

export { ModalExportCharts as ModalImportExport };
