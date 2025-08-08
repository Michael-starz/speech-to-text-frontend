import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FileUpload from "./components/FileUpload";
import { HStack, Box, Flex } from "@chakra-ui/react";
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
      <HStack px={20} flex={1} as="main">
        <Box gap={4} w="50%" >
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
        <Box h="80vh" w="50%" borderLeft="1px solid">
          <TranscriptionDisplay 
          transcribedText={transcribedText}
          translatedText={translatedText}
          targetLanguage={selectedLanguage.length > 0 ? selectedLanguage[0] : "English"}
          isTranscribing={isProcessingBackend} // Using isProcessingBackend for both states
          isTranslating={isProcessingBackend} // Using isProcessingBackend for both states
          />
        </Box>
      </HStack>
      <Footer />
      </Flex>
    </>
  );
}

export default App;
