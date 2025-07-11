// utils/errorHandler.ts
export class CalculatorError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = "CalculatorError";
  }
}

export const handleApiError = (error: any): string => {
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error instanceof CalculatorError) {
    return error.message;
  }

  return "An unexpected error occurred";
};
