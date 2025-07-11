import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  calculator: {
    calculate: ["calculator", "calculate"],
    history: ["calculator", "history"],
    clearHistory: ["calculator", "clearHistory"],
  },
});
