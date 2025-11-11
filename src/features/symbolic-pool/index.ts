import { SymbolicPoolProperties } from "./properties";
import { SymbolicPoolNode } from "./node";
import { SymbolicPoolService } from "./service";

export const SymbolicPool = {
  component: SymbolicPoolNode,
  service: SymbolicPoolService,
  properties: SymbolicPoolProperties,
};
