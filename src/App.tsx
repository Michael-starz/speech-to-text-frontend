import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FileUpload from "./components/FileUpload";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./components/Footer";
import TranscriptionDisplay from "./components/TranscriptionDisplay";
import { Toaster } from "./components/ui/toaster";
import { useState } from "react";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isProcessingBackend, setIsProcessingBackend] = useState<boolean>(false);

  return (
    <>
      <Toaster />
      <Flex direction="column" minH="100vh">
        <Header />
        <Flex
          px={{ base: 4, lg: 20 }}
          py={0}
          flex={1}
          as="main"
          direction={{ base: "column", lg: "row" }}
        >
          <Box gap={4} w={{ base: "100%", lg: "50%" }} mb={{ base: 8, lg: 0 }}>
            <HeroSection />
            <FileUpload
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              setTranscribedText={setTranscribedText}
              setTranslatedText={setTranslatedText}
              isProcessingBackend={isProcessingBackend}
              setIsProcessingBackend={setIsProcessingBackend}
            />
          </Box>
          <Box
            h={{ base: "40vh", lg: "80vh" }}
            w={{ base: "100%", lg: "50%" }}
            borderTop={{ base: "1px solid", lg: "none" }}
            borderLeft={{ base: "none", lg: "1px solid" }}
            pt={{ base: 4, lg: 0 }}
            pl={{ base: 0, lg: 4 }}
          >
            <TranscriptionDisplay
              transcribedText={transcribedText}
              translatedText={translatedText}
              targetLanguage={selectedLanguage.length > 0 ? selectedLanguage[0] : "English"}
              isTranscribing={isProcessingBackend}
              isTranslating={isProcessingBackend}
            />
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}

export default App;
