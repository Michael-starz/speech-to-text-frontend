import { Box, HStack, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box background="teal" py="5" px={20} color="white">
      <HStack justifyContent="space-between" alignItems="center">
        <Box>Speech to Text</Box>
        <Box display={{ base: "none", md: "block" }}>
            <HStack gap={4}>
                <Text>About</Text>
                <Text>Login</Text>
                <Text>Powered by OpenAI</Text>
            </HStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default Header;

