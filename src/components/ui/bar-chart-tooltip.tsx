import React from "react";
import { Paper, Text } from "@mantine/core";

type IProps = {
    label: React.ReactNode;
    payload: Record<string, any>[] | undefined;
    total: number;
};

const Tooltip: React.ComponentType<IProps> = ({ label, payload, total }) => {
    console.log(payload);
    return (
        <Paper>
            <Text size="sm" className="p-2">
                {label}
            </Text>
            {payload && payload.length > 0 && (
                <div className="px-2 pb-2">
                    {payload.map((entry, index) => (
                        <div
                            key={`item-${index}`}
                            className="flex items-center"
                        >
                            <div
                                className="w-3 h-3 mr-2 rounded-full"
                                style={{
                                    backgroundColor: entry.fill || entry.color,
                                }}
                            ></div>
                            <Text size="sm">Results: {entry.value} ({((entry.value / total) * 100).toFixed(2)}%)</Text>
                        </div>
                    ))}
                </div>
            )}
        </Paper>
    );
};

export { Tooltip as Tooltip };
