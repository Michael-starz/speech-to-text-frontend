import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  HStack,
  Icon,
  Alert,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FiUpload, FiFile } from "react-icons/fi";
import LanguageSelect from "./LanguageSelect";
import RecordAudio from "./RecordAudio";
import { toaster } from "./ui/toaster";
import { BsSend } from "react-icons/bs";

interface FileUploadProps {
  selectedLanguage: string[];
  onLanguageChange: (language: string[]) => void;
  setTranscribedText: (text: string) => void;
  setTranslatedText: (text: string) => void;  
  isProcessingBackend: boolean;              
  setIsProcessingBackend: (isProcessing: boolean) => void;
}

const FileUpload = ({ 
  selectedLanguage, 
  onLanguageChange,
  setTranscribedText,
  setTranslatedText,
  isProcessingBackend,
  setIsProcessingBackend,
 }: FileUploadProps ) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);

  const acceptedFormats = [
    ".mp3",
    ".wav",
    ".m4a", 
    ".mp4", 
    ".webm", 
    ".mpga", 
    ".mpeg"
  ];
  const maxFileSize = 25 * 1024 * 1024; // 25MB in bytes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");
    setRecordedAudioBlob(null); 

    if (!file) {
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      toaster.create({
              title: 'Invalid file size',
              description: 'File size exceeds 25MB limit. Please choose a smaller file.',
              type: "error",
              duration: 3000,
              closable: true,
            });
      setSelectedFile(null);
      // --- Clear the input value on validation failure ---
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      toaster.create({
              title: 'Invalid file format',
              description: `Please select a file with one of these formats: ${acceptedFormats.join(
          ", "
        )}`,
              type: "error",
              duration: 3000,
              closable: true,
            });
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    // setRecordedAudioBlob(null);
    setSelectedFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


// --- Handle recorded audio from RecordAudio component ---
  const handleAudioRecorded = (audioBlob: Blob) => {
    setRecordedAudioBlob(audioBlob);
    
    const recordedFile = new File([audioBlob], `recorded_audio_${Date.now()}.webm`, {
      type: audioBlob.type,
      lastModified: Date.now(),
    });

    setSelectedFile(recordedFile);
    setError(""); 
    toaster.create({
      title: 'Audio recorded successfully',
      description: `Size: ${formatFileSize(audioBlob.size)}. Ready for transcription.`,
      type: "success",
      duration: 3000,
      closable: true,
    });
  };


  const processAudio = async () => {
    if (!selectedFile) {
      toaster.create({
        title: 'No audio selected',
        description: 'Please upload or record an audio file first.',
        type: "warning",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (selectedLanguage.length === 0) {
      toaster.create({
        title: 'No target language selected',
        description: 'Please choose a language for translation.',
        type: "warning",
        duration: 3000,
        closable: true,
      });
      return;
    }

    setIsProcessingBackend(true); 
    setTranscribedText(""); 
    setTranslatedText("");  

    toaster.create({
      title: 'Processing Audio',
      description: 'Sending audio for transcription and translation...',
      type: "info",
      duration: 3000,
      closable: true,
    });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('target_language', selectedLanguage[0]);

    try {
      const response = await fetch('http://localhost:8000/v1/transcribe-and-translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const api_response = await response.json();
      const result = api_response.data
      console.log('Backend response:', result);

      setTranscribedText(result.transcription || "No transcription available.");
      setTranslatedText(result.translation || "No translation available.");

      toaster.create({
        title: 'Processing Complete',
        description: 'Audio transcribed and translated successfully!',
        type: "success",
        duration: 3000,
        closable: true,
      });

    } catch (err) {
      console.error('Error processing audio:', err);
      toaster.create({
        title: 'Processing Failed',
        description: `An error occurred: ${err instanceof Error ? err.message : String(err)}`,
        type: "error",
        duration: 5000,
        closable: true,
      });
      setTranscribedText("Error during transcription/translation.");
      setTranslatedText("Error during transcription/translation.");
    } finally {
      setIsProcessingBackend(false); // End processing indicator
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box maxWidth="600px" mx="auto" p={6}>
      <VStack gap={3} align="stretch">
        <Box mt={-4}>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Upload Audio File
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Select an audio file to transcribe or translate. Supported formats:{" "}
            {acceptedFormats.join(", ")}
          </Text>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Maximum file size: 25MB
          </Text>
        </Box>

        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          display="none"
        />

        <HStack justifyContent="space-between" mt={-6}>
        <Button
          onClick={handleUploadClick}
          variant="outline"
          size="lg"
          colorScheme="teal"
          borderStyle="dashed"
          borderWidth={2}
          py={8}
          w="180px"
          _hover={{
            borderColor: "teal.500",
            backgroundColor: "teal.50",
          }}
          disabled={isProcessingBackend}
        >
          <FiUpload />
          Upload audio file
        </Button>
        <RecordAudio 
        onAudioRecorded={handleAudioRecorded}
        isLoading={isProcessingBackend}
        />
            <LanguageSelect 
            value={selectedLanguage}
            onValueChange={(details) => onLanguageChange(details.value)}
            placeholder="Choose a language"
            // label="Target language"
            />
        </HStack>

        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Box>
              <Alert.Title>Upload Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Box>
          </Alert.Root>
        )}

        {selectedFile && (
          <Box mt={-4}>
            <Alert.Root status="success">
              <Alert.Indicator />
              <Box>
                <Alert.Title>File Selected</Alert.Title>
                <Alert.Description>
                  <HStack gap={2} mt={1}>
                    <Icon as={FiFile} />
                    <Text>{selectedFile.name}</Text>
                    <Text color="gray.500">
                      ({formatFileSize(selectedFile.size)})
                    </Text>
                  </HStack>
                </Alert.Description>
                {/* --- Display audio player for recorded audio --- */}
                {recordedAudioBlob && (
                  <audio controls src={URL.createObjectURL(recordedAudioBlob)} style={{ width: '100%', marginTop: '10px' }} />
                )}
              </Box>
            </Alert.Root>
          </Box>
        )}

        {selectedFile && (
          <HStack gap={4} justify="center">
            <Button
              onClick={processAudio}
              colorScheme="blue"
              size="lg"
              flex={1}
              disabled={isProcessingBackend}
            >
              <BsSend /> Process
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default FileUpload;
