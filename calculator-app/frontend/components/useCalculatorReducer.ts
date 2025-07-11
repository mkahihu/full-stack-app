// hooks/useCalculatorReducer.ts
type CalculatorState = {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewNumber: boolean;
  lastResult: number | null;
  error: string | null;
};

type CalculatorAction =
  | { type: "INPUT_NUMBER"; payload: string }
  | { type: "INPUT_OPERATOR"; payload: string }
  | { type: "CALCULATE" }
  | { type: "CLEAR" }
  | { type: "BACKSPACE" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_RESULT"; payload: number };

const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case "INPUT_NUMBER":
      return {
        ...state,
        display: state.waitingForNewNumber
          ? action.payload
          : state.display === "0" && action.payload !== "."
          ? action.payload
          : state.display + action.payload,
        waitingForNewNumber: false,
        error: null,
      };
    // ... other cases
    default:
      return state;
  }
};
