import React from "react";
import { ResponsiveContainer } from "recharts";
import { BarChart } from "@mantine/charts";
import { IChartData } from "@/config/types";
import { Tooltip } from "./bar-chart-tooltip";

type IProps = {
  data: IChartData;
};

const Chart: React.ComponentType<IProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="w-full min-h-[200px] h-max max-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" maxHeight={300} aspect={2}>
        <BarChart
          h="300"
          data={data}
          dataKey="label"
          tickLine="y"
          tooltipProps={
            {
              content: ({ label, payload }) => <Tooltip label={label} payload={payload} total={total} />
            }
          }
          series={[{ name: "value", color: "blue.6", label: "Results" }]}
        />
      </ResponsiveContainer>
    </div>
  );
};

export { Chart as BarChart };
