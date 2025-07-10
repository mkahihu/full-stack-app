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
  ScrollArea,
  Badge,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useCalculator } from "../hooks/useCalculator";

export default function History() {
  const { history, isLoading, clearHistory, loadHistory } = useCalculator();

  const bgColor = useColorModeValue("white", "gray.800");
  const itemBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
            <Badge colorScheme="blue">{history.length}</Badge>
            <Tooltip label="Refresh history">
              <IconButton
                aria-label="Refresh"
                icon={<span>🔄</span>}
                size="sm"
                onClick={loadHistory}
                isLoading={isLoading}
              />
            </Tooltip>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={clearHistory}
              isLoading={isLoading}
            >
              Clear
            </Button>
          </HStack>
        </HStack>

        <Divider />

        {/* History List */}
        <Box flex={1} w="full" overflowY="auto">
          {history.length === 0 ? (
            <Text color="gray.500" textAlign="center" mt={8}>
              No calculations yet
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {history.map((calc) => (
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
