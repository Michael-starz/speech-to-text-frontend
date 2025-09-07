import {
  Box,
  HStack,
  Text,
  Menu,
  Button,
  Portal,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";

const Header = () => {
  return (
    <Box background="teal" py="5" px={{ base: 4, md: 20 }} color="white">
      <HStack justifyContent="space-between" alignItems="center">
        <Box>Speech to Text</Box>
        <Box display={{ base: "none", md: "block" }}>
          <HStack gap={4}>
            <Text>About</Text>
            <Text>Login</Text>
            <Text>Powered by OpenAI</Text>
          </HStack>
        </Box>

        <Box display={{ base: "block", md: "none" }}>
          <Menu.Root>
            <Menu.Trigger>
              <Button
                // as={IconButton}
                aria-label="Options"
                variant="outline"
                colorScheme="whiteAlpha"
                border={"none"}
              >
                <HiMenu color="white"/>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="about">About</Menu.Item>
                  <Menu.Item value="login">Login</Menu.Item>
                  <Menu.Item value="powered-by">Powered by OpenAI</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </HStack>
    </Box>
  );
};

export default Header;
