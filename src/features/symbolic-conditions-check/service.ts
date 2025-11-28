import { i18n } from "@/config/i18n";
import {
    ISymbolicConditionsCheckType,
    ISymbolicConditionsCheckNode,
    INodeService,
} from "@/config/types";

export const SymbolicConditionsCheckService: INodeService<ISymbolicConditionsCheckNode> =
    {
        new(_flow, { id, position }) {
            return {
                id,
                position,
                type: "symbolicConditionsCheck",
                data: {
                    name: i18n.t("nodeShortName.symbolicConditionsCheck"),
                    status: "IDLE",
                    inputType: "symbolicPool",
                    outputType: "boolean",
                    conditions: [{ symbol: "A", type: ">=", count: 1 }],
                },
            };
        },

        run({ node, inputs }) {
            const [source] = inputs;
            if (!source) throw new Error("Source connection state not found!");

            const sourceState = source.state as string[];

            const resultState = checkConditions(
                sourceState,
                node.data.conditions
            );
            return resultState;
        },
    };

function checkConditions(
    symbols: string[],
    conditions: {
        symbol: string;
        type: ISymbolicConditionsCheckType;
        count: number;
    }[]
) {
    const result: number[] = [];

    for (let i = 0; i < symbols.length; i++) {
      let allConditionsMet = true;
        for (const condition of conditions) {
            let conditionMet = false;
            const symbolCount = symbols[i].split(", ").filter(
                (s) => s === condition.symbol
            ).length;

            switch (condition.type) {
                case ">=":
                    conditionMet = symbolCount >= condition.count;
                    break;
                case "<=":
                    conditionMet = symbolCount <= condition.count;
                    break;
                case "=":
                    conditionMet = symbolCount === condition.count;
                    break;
            }
            if (conditionMet === false) {
                allConditionsMet = false;
                break;
            }
        }
        if (allConditionsMet) {
            result.push(1);
        } else {
            result.push(0);
        }
    }

    return result;
}
