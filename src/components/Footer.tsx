import {
  Box,
  // Container,
  HStack,
  // VStack,
  Text,
  Link,
  // IconButton,
  // Separator,
  // Grid,
  // GridItem,
} from "@chakra-ui/react";

interface FooterProps {
  companyName?: string;
  showSocialLinks?: boolean;
  showQuickLinks?: boolean;
  className?: string;
}

const Footer = ({
  companyName = "SpeechScribe",
  className,
}: FooterProps) => {

  return (
    <Box
      as="footer"
      bg="teal.600"
      color="white"
      py={5}
      px={20}
      mt="auto"
      className={className}
    >
        {/* Bottom Section */}
        <HStack
          justify="space-between"
          align="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
        >
          <Text fontSize="sm" opacity={0.8}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </Text>
          
          <HStack gap={6}>
            <Link
              href="/privacy"
              fontSize="sm"
              opacity={0.8}
              _hover={{ opacity: 1, textDecoration: "underline" }}
              color="white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              fontSize="sm"
              opacity={0.8}
              _hover={{ opacity: 1, textDecoration: "underline" }}
              color="white"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              fontSize="sm"
              opacity={0.8}
              _hover={{ opacity: 1, textDecoration: "underline" }}
              color="white"
            >
              Cookies
            </Link>
          </HStack>
        </HStack>
    </Box>
  );
};

export default Footer;