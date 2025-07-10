/**
 * Component for toggling between different display modes
 */
"use client";

import {
  Box,
  Button,
  HStack,
  Text,
  useColorModeValue,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface ToggleDisplayProps {
  showFraction: boolean;
  onToggleFraction: () => void;
}

export default function ToggleDisplay({
  showFraction,
  onToggleFraction,
}: ToggleDisplayProps) {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      boxShadow="md"
      maxW="400px"
      w="full"
    >
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="fraction-toggle" mb="0" flex={1}>
          <HStack>
            <Text>Display Mode:</Text>
            <Text
              fontWeight="bold"
              color={showFraction ? "purple.500" : "blue.500"}
            >
              {showFraction ? "Fraction" : "Decimal"}
            </Text>
          </HStack>
        </FormLabel>
        <Switch
          id="fraction-toggle"
          colorScheme="purple"
          isChecked={showFraction}
          onChange={onToggleFraction}
        />
      </FormControl>
    </Box>
  );
}
