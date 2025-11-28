import React from "react";
import { BiDownload, BiNoSignal } from "react-icons/bi";
import { Menu, Button, Tooltip } from "@mantine/core";
import { BarChart } from "@/components/ui/bar-chart";
import { useLayoutContext } from "@/contexts/layout-context";
import { useTranslation } from "react-i18next";
import { downloadElementImage } from "@/utils/downloadElementImage";
import { downloadFile } from "@/utils/download-file";
import { formatters } from "@/utils/formatters";
import { IChart, IChartData } from "@/config/types";
import { i18n } from "@/config/i18n";

interface IProps {
    charts: IChart[];
}

export const SimulationCharts: React.FC<IProps> = ({ charts }) => {
    const { t } = useTranslation();
    const {
        simulationOpen,
        asidePropertiesOpen,
        sidebarWidth,
        asidePropertiesWidth,
    } = useLayoutContext();

    type DownloadFormat = "image" | "txt" | "csv";
    async function handleDownloadChart(
        chartId: string,
        chartName: string,
        chartData: IChartData,
        format: DownloadFormat
    ) {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) {
            alert(t("taskBar.alertChartNotFound"));
            return;
        }

        try {
            switch (format) {
                case "image":
                    await downloadElementImage(
                        chartElement,
                        "chart-" + chartName
                    );
                    break;
                case "txt": {
                    const txtContent = formatters.txt(chartData);
                    const blob = new Blob([txtContent], { type: "text/plain" });
                    downloadFile(
                        blob,
                        `chart-${chartName}.txt`,
                    );
                    break;
                }
                case "csv": {
                    const csvContent = formatters.csv(chartData);
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    downloadFile(
                        blob,
                        `chart-${chartName}.csv`,
                    );
                    break;
                }
            }
        } catch (error) {
            throw new Error(i18n.t("errors.downloadFailed") + ": " + (error as Error).message);
        }
    }

    const containerStyles: React.CSSProperties = {
        left: `calc(${sidebarWidth}px + (100vw - ${sidebarWidth}px - ${
            asidePropertiesOpen ? asidePropertiesWidth : 0
        }px) / 2)`,
        width: `calc(100vw - ${
            (asidePropertiesOpen ? asidePropertiesWidth : 0) + sidebarWidth + 64
        }px)`,
        top: simulationOpen ? "calc(100vh - 430px)" : "calc(100vh - 23px)",
    };

    return (
        <div
            className="absolute overflow-y-auto z-[10] transform -translate-x-1/2 h-[430px] max-w-[900px] bg-white border-t-4 border-blue-600 border-x border-x-gray-300 flex flex-col transition-all duration-200"
            style={containerStyles}
        >
            {!charts.length ? (
                <div className="flex flex-col h-full items-center justify-center text-gray-400">
                    <BiNoSignal className="text-7xl" />
                    <h2 className="text-center">
                        {t("taskBar.itemsNotFound")}
                    </h2>
                </div>
            ) : (
                <div id="charts-container">
                    {simulationOpen &&
                        charts.map((chart, index) => (
                            <React.Fragment key={chart.id}>
                                <div
                                    className="w-full flex flex-col items-center last-of-type:mb-16"
                                    id={chart.id}
                                >
                                    <div className="flex justify-center relative w-full">
                                        <h3 className="text-xl font-medium py-3">
                                            {chart.name}
                                        </h3>
                                        <Menu shadow="md" width={200}>
                                            <Menu.Target>
                                                <Tooltip
                                                    label={t(
                                                        "taskBar.downloadChartTooltip"
                                                    )}
                                                >
                                                    <Button
                                                        p="xs"
                                                        className="top-12 absolute right-1"
                                                    >
                                                        <BiDownload />
                                                    </Button>
                                                </Tooltip>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item>
                                                    <div
                                                        onClick={() =>
                                                            handleDownloadChart(
                                                                chart.id,
                                                                chart.name,
                                                                chart.data,
                                                                "image"
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            "taskBar.downloadChartImage"
                                                        )}
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <div
                                                        onClick={() =>
                                                            handleDownloadChart(
                                                                chart.id,
                                                                chart.name,
                                                                chart.data,
                                                                "txt"
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            "taskBar.downloadChartAsText"
                                                        )}
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <div
                                                        onClick={() =>
                                                            handleDownloadChart(
                                                                chart.id,
                                                                chart.name,
                                                                chart.data,
                                                                "csv"
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            "taskBar.downloadChartAsCSV"
                                                        )}
                                                    </div>
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </div>

                                    <div className="sm:px-4 lg:px-12 w-full">
                                        <BarChart
                                            data={chart.data}
                                            key={`chart_${chart.id}`}
                                        />
                                    </div>
                                </div>

                                {index !== charts.length - 1 && (
                                    <hr className="w-full border-2 border-gray-300 my-4" />
                                )}
                            </React.Fragment>
                        ))}
                </div>
            )}
        </div>
    );
};
