import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  IconButton,
  Badge,
  Button,
  useClipboard,
  Flex,
  Spinner,
  Menu,
  Portal,
  // MenuButton,
  // MenuList,
  // MenuItem,
} from "@chakra-ui/react";
import {
  FaCopy,
  FaDownload,
  FaVolumeUp,
  FaLanguage,
  FaEdit,
  FaCheck,
  FaChevronDown 
} from "react-icons/fa";
import { useState, useEffect } from "react";

interface TranscriptionDisplayProps {
  transcribedText?: string;
  translatedText?: string;
  isTranscribing?: boolean;
  isTranslating?: boolean;
  sourceLanguage?: string;
  targetLanguage?: string;
  onClear?: () => void;
  onEdit?: (text: string, type: "transcription" | "translation") => void;
  onTextToSpeech?: (text: string) => void;
  onDownload?: (text: string, type: "transcription" | "translation") => void;
  className?: string;
}

const TranscriptionDisplay = ({
  transcribedText = "",
  translatedText ="",
  isTranscribing = false,
  isTranslating = false,
  sourceLanguage = "English",
  targetLanguage = "",
  onEdit,
  onTextToSpeech,
  onDownload,
  className,
}: TranscriptionDisplayProps) => {
  const [currentView, setCurrentView] = useState<"translation" | "transcription">("translation");
  const [isEditingTranslation, setIsEditingTranslation] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState(translatedText);
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState(transcribedText);
  
  // Determine which text is currently active based on currentView
  const displayedText = currentView === "translation" ? translatedText : transcribedText;
  const mainClipboard = useClipboard({ value: displayedText, timeout: 2000 });

  // --- useEffect to update editedTranslation/editedTranscription when props change ---
  useEffect(() => {
    setEditedTranslation(translatedText);
  }, [translatedText]);

  useEffect(() => {
    setEditedTranscription(transcribedText);
  }, [transcribedText]);


  const handleEditSave = (type: "transcription" | "translation") => {
    if (type === "translation") {
      onEdit?.(editedTranslation, "translation");
      setIsEditingTranslation(false);
    } else if (type === "transcription") {
      onEdit?.(editedTranscription, "transcription");
      setIsEditingTranscription(false);
    }
  };

  const handleEditCancel = (type: "transcription" | "translation") => {
    if (type === "translation") {
      setEditedTranslation(translatedText);
      setIsEditingTranslation(false);
    } else if (type === "transcription") {
      setEditedTranscription(transcribedText);
      setIsEditingTranscription(false);
    }
  };

  const getPlaceholderText = () => {
    if (isTranslating) {
      return "🔄 Translating your audio file...";
    }
    if (isTranscribing) {
      return "🎤 Processing your audio file and transcribing...";
    }
    if (currentView === "translation") {
      return "📁 Upload an audio file to get started...\n\n🎵 Supported formats: MP3, WAV, M4A, OGG\n🌐 Your translated text will appear here\n⚡ Fast and accurate AI translation\n🎯 High-quality results in your chosen language";
    } else {
      return "📁 Upload an audio file to get started...\n\n🎵 Supported formats: MP3, WAV, M4A, OGG\n🇬🇧 Your English transcription will appear here\n⚡ Fast and accurate AI transcription\n";
    }
  };


  const isEditing = currentView === "translation" ? isEditingTranslation : isEditingTranscription;

  return (
    <Box className={className} w="100%" h="100%" minH="100%">
      {/* Translation/Transcription Section */}
      <Box
        h="100%"
        // border="0.5px solid"
        borderColor="teal.200"
        borderRadius="xl"
        p={6}
        bg="white"
        // shadow="sm"
        // _hover={{ shadow: "md" }}
        transition="all 0.2s"
        display="flex"
        flexDirection="column"
      >
        <VStack gap={4} align="stretch" flex={1}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <HStack gap={2}>
              <FaLanguage color="teal" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                {currentView === "translation" ? "Translated Text" : "Transcribed Text"}
              </Text>
              <Badge colorScheme="teal" size="sm">
                {currentView === "translation" ? targetLanguage : sourceLanguage}
              </Badge>
              {(isTranscribing || isTranslating) && (
                <HStack gap={1}>
                  <Spinner size="sm" color="teal.500" />
                  <Text fontSize="sm" color="teal.500">
                    {isTranscribing ? "Processing..." : "Translating..."}
                  </Text>
                </HStack>
              )}
            </HStack>

            <HStack gap={2}>
              <Menu.Root>
                <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Select view"
                  disabled={isTranscribing || isTranslating}
                >
                  View<FaChevronDown />
                </Button>
                </Menu.Trigger>
                <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                  <Menu.Item value="translated-text" onSelect={() => setCurrentView("translation")}>
                    Translated Text ({targetLanguage})
                  </Menu.Item>
                  <Menu.Item value="transcribed-text" onSelect={() => setCurrentView("transcription")}>
                    Transcribed Text (English)
                  </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
                </Portal>
              </Menu.Root>

              {!isEditing && (
                <>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={currentView === "translation" ? "Edit translation" : "Edit transcription"}
                    onClick={() => {
                      if (currentView === "translation") {
                        setIsEditingTranslation(true);
                      } else {
                        setIsEditingTranscription(true);
                      }
                    }}
                    disabled={!displayedText || isTranscribing || isTranslating}
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={mainClipboard.copied ? "Copied!" : "Copy text"}
                    onClick={mainClipboard.copy}
                    disabled={!displayedText || isTranscribing || isTranslating}
                    colorPalette={mainClipboard.copied ? "green" : "gray"}
                  >
                    {mainClipboard.copied ? <FaCheck /> : <FaCopy /> }
                    
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Play text"
                    onClick={() => onTextToSpeech?.(displayedText)}
                    disabled={!displayedText || isTranscribing || isTranslating}
                  >
                    <FaVolumeUp />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Download text"
                    onClick={() => onDownload?.(displayedText, currentView)}
                    disabled={!displayedText || isTranscribing || isTranslating}
                  >
                    <FaDownload />
                  </IconButton>
                </>
              )}
            </HStack>
          </Flex>

          {/* Content */}
          {isEditing ? (
            <VStack gap={3} flex={1}>
              <Textarea
                value={currentView === "translation" ? editedTranslation : editedTranscription}
                onChange={(e) => {
                  if (currentView === "translation") {
                    setEditedTranslation(e.target.value);
                  } else {
                    setEditedTranscription(e.target.value);
                  }
                }}
                placeholder={currentView === "translation" ? "Edit your translation..." : "Edit your transcription..."}
                resize="vertical"
                flex={1}
              />
              <HStack gap={2} alignSelf="flex-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditCancel(currentView)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => handleEditSave(currentView)}
                >
                  Save
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Textarea
              value={displayedText}
              placeholder={getPlaceholderText()}
              resize="none"
              readOnly
              textAlign="justify"
            //   bg="gray.50"
              border="none"
              _focus={{ border: "none", boxShadow: "none" }}
              _focusVisible={{ outline: "none" }}
              fontSize="md"
              lineHeight="1.6"
              flex={1}
              // maxH="200px"
              // maxHeight="500px"
            />
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default TranscriptionDisplay;