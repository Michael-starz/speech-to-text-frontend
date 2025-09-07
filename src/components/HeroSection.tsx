import { Box, Text, Heading, Stack, Highlight } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <Box padding={{ base: 3.5, md: 10 }}>
      <Stack alignItems="center" textAlign="center">
        <Heading size={{ base: "3xl", md: "5xl" }}>
          Turn Your Voice into Text
        </Heading>
        <Heading size={{ base: "2xl", md: "4xl" }}>
          <Highlight
            query="Instantly & Accurately"
            styles={{ color: "teal.600" }}
          >
            Instantly & Accurately
          </Highlight>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} mt={4} px={{ base: "20", lg: "0"}}>
          Stop Typing. Start Talking. Let Your Voice Do the Work. Fast, easy,
          and perfect for notes, dictation, and accessibility.
        </Text>
        {/* <Text fontSize={{ base: "md", md: "lg" }}>
          Fast, easy, and perfect for notes, dictation, and accessibility.
        </Text> */}
      </Stack>
    </Box>
  );
};

export default HeroSection;
