/**
 * History component to display and manage calculation history
 */
"use client";

import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Badge,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect } from "react";
import {
  useHistory,
  useClearHistory,
} from "@/api/endpoints/calculator/apiQueries";
import { CALCULATOR_CONSTANTS } from "@/constants/calculator";

export default function History() {
  const {
    data: historyData,
    isLoading,
    refetch,
  } = useHistory(CALCULATOR_CONSTANTS.HISTORY_PAGE_SIZE, 0);

  const clearHistoryMutation = useClearHistory();

  const calculations = historyData?.calculations || [];
  const bgColor = useColorModeValue("white", "gray.800");
  const itemBg = useColorModeValue("gray.50", "gray.700");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      maxW="400px"
      w="full"
      h="600px"
    >
      <VStack spacing={4} h="full">
        {/* Header */}
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold">
            History
          </Text>
          <HStack>
            <Badge colorScheme="blue">{calculations.length}</Badge>
            <Tooltip label="Refresh history">
              <IconButton
                aria-label="Refresh"
                icon={<span>🔄</span>}
                size="sm"
                onClick={() => refetch()}
                isLoading={isLoading}
              />
            </Tooltip>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={handleClearHistory}
              isLoading={clearHistoryMutation.isPending}
            >
              Clear
            </Button>
          </HStack>
        </HStack>

        <Divider />

        {/* History List */}
        <Box flex={1} w="full" overflowY="auto">
          {calculations.length === 0 ? (
            <Text color="gray.500" textAlign="center" mt={8}>
              No calculations yet
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {calculations.map((calc) => (
                <Box
                  key={calc.id}
                  bg={itemBg}
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <VStack align="stretch" spacing={1}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontFamily="mono">
                        {calc.expression}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        #{calc.id}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="bold" color="green.500">
                        = {calc.result}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatDate(calc.created_at)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
