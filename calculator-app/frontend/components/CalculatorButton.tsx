import { Button } from "@chakra-ui/react";
import { memo } from "react";

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  colorScheme?: string;
  span?: number;
  isLoading?: boolean;
  loadingText?: string;
}

// components/CalculatorButton.tsx
const CalculatorButton = memo(
  ({
    label,
    onClick,
    colorScheme = "gray",
    span,
    isLoading = false,
    loadingText,
    ariaLabel,
  }: CalculatorButtonProps & { ariaLabel?: string }) => {
    return (
      <Button
        onClick={onClick}
        colorScheme={colorScheme}
        size="lg"
        h="60px"
        fontSize="lg"
        fontWeight="bold"
        gridColumn={span ? `span ${span}` : undefined}
        isLoading={isLoading}
        loadingText={loadingText || label}
        aria-label={ariaLabel || `${label} button`}
        _hover={{
          transform: "scale(1.05)",
          transition: "transform 0.1s",
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        _focus={{
          outline: "2px solid",
          outlineColor: "blue.500",
          outlineOffset: "2px",
        }}
      >
        {label}
      </Button>
    );
  }
);

CalculatorButton.displayName = "CalculatorButton";

export default CalculatorButton;
