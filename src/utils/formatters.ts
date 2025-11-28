import { IChartData } from "@/config/types";

export const formatters = {
    txt: (chartData: IChartData): string => {
        let output = "";
        chartData.forEach(({label, value}) => {
            output += `${label}: ${value}\n`;
        });
        return output;
    },
    csv: (chartData: IChartData): string => {
        let output = "Label,Value\n";
        chartData.forEach(({label, value}) => {
            output += `"${label}",${value}\n`;
        });
        return output;
    }
};