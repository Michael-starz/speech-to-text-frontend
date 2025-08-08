import { Box, Text, Heading, Stack, Highlight } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <Box padding={4}>
      <Stack alignItems="center">
        <Heading size="5xl">Turn Your Voice into Text</Heading>
        <Heading size="4xl">
          <Highlight
            query="Instantly & Accurately"
            styles={{ color: "teal.600" }}
          >
            Instantly & Accurately
          </Highlight>
        </Heading>
        <Text textStyle="lg">
          Stop Typing. Start Talking. Let Your Voice Do the Work.
        </Text>
        <Text textStyle="lg">
          Fast, easy, and perfect for notes, dictation, and accessibility.
        </Text>
      </Stack>
    </Box>
  );
};

export default HeroSection;
