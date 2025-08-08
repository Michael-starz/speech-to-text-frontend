import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Text, Spinner } from '@chakra-ui/react';
import { toaster } from './ui/toaster';

interface RecordAudioProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  isLoading?: boolean; // Prop to show loading state from parent (e.g., while backend processes)
}

const MAX_AUDIO_SIZE_MB = 25;
const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024; // 25 MB in bytes
const SIZE_THRESHOLD_BYTES = MAX_AUDIO_SIZE_BYTES * 0.98; // Stop recording at 98% of max size

const RecordAudio: React.FC<RecordAudioProps> = ({ onAudioRecorded, isLoading }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioSize, setAudioSize] = useState<number>(0); // Current size of recorded audio in bytes
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicrophoneLoading, setIsMicrophoneLoading] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
    
  // Function to request microphone access and start recording
  const startRecording = async () => {
    setErrorMessage(null); // Clear previous errors
    setAudioSize(0); // Reset audio size for new recording
    audioChunksRef.current = []; // Clear previous chunks

    setIsMicrophoneLoading(true);
    try {
      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store the stream to stop tracks later

      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      // Event listener for when audio data is available
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setAudioSize((prevSize) => {
            const newSize = prevSize + event.data.size;
            // Check if the current size is approaching the maximum limit
            if (newSize >= SIZE_THRESHOLD_BYTES && mediaRecorderRef.current?.state === 'recording') {
              toaster.create({
                title: 'Recording stopped automatically',
                description: `Audio size approaching ${MAX_AUDIO_SIZE_MB}MB limit.`,
                type: 'info',
                duration: 3000,
                closable: true,
              });
              mediaRecorderRef.current?.stop(); // Automatically stop recording
            }
            return newSize;
          });
        }
      };

      // Event listener for when recording stops
      mediaRecorder.onstop = () => {
        setIsRecording(false);
        // Combine all recorded audio chunks into a single Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAudioRecorded(audioBlob); // Pass the audio Blob to the parent component

        // Stop all tracks on the media stream to release microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Event listener for errors during recording
      mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage(`Recording error: Recording failed due to an unknown error.`);
        setIsRecording(false);
        // Ensure stream tracks are stopped on error
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Start recording, collecting data every 1 second
      setIsRecording(true);
      toaster.create({
        title: 'Recording started',
        description: 'Microphone is active.',
        type: 'success',
        duration: 3000,
        closable: true,
      });
    } catch (err) {
      console.error('Error accessing microphone:', err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          toaster.create({
            title: "Microphone access denied",
            description: 'Please allow microphone access in your browser settings.',
            type: "error",
            duration: 3000,
            closable: false
        });
        } else if (err.name === 'NotFoundError') {
            toaster.create({
            title: "No microphone found",
            description: 'Please ensure a microphone is connected.',
            type: "error",
            duration: 3000,
            closable: false
        });
        } else {
            toaster.create({
            title: "Error accessing microphone",
            description: `${err.message}`,
            type: "error",
            duration: 3000,
            closable: false
        });
        }
      } else {
        toaster.create({
            title: "Unknown Error",
            description: "An unknown error occurred while accessing the microphone.",
            type: "error",
            duration: 3000,
            closable: false
        });
      }
      setIsRecording(false);
    } finally {
      setIsMicrophoneLoading(false);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      toaster.create({
        title: 'Recording stopped',
        description: 'Audio saved.',
        type: 'info',
        duration: 3000,
        closable: true,
      });
    }
  };

  // Cleanup effect: stop recording and release microphone if component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Helper to format audio size for display
  const formatAudioSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box textAlign="center" p={4}>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        variant="outline"
        size="lg"
        py={8}
        px={6}
        borderStyle="dashed"
        borderWidth={2}
        borderColor={isRecording ? 'red.500' : 'gray.300'} // Red border when recording
        _hover={{
          borderColor: isRecording ? 'red.600' : 'gray.500',
          backgroundColor: isRecording ? 'red.50' : 'gray.50',
        }}
        disabled={isLoading || isMicrophoneLoading} // Disable if parent is loading or microphone is being accessed
      >
        {isMicrophoneLoading ? (
          <Spinner size="md" mr={2} />
        ) : isRecording ? (
          <Box display="flex" alignItems="center">
            <Box
              as="span"
              w="10px"
              h="10px"
              borderRadius="full"
              bg="red.500"
              mr={2}
              animation="pulse 1s infinite"
              css={{
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.8)', opacity: 0.7 },
                  '50%': { transform: 'scale(1)', opacity: 1 },
                  '100%': { transform: 'scale(0.8)', opacity: 0.7 },
                },
              }}
            />
            Stop Recording
          </Box>
        ) : (
          'Start Recording'
        )}
      </Button>

      {isRecording && (
        <Text mt={4} fontSize="sm" color="gray.600">
          Recording... Current size: {formatAudioSize(audioSize)} / {MAX_AUDIO_SIZE_MB} MB
        </Text>
      )}

      {errorMessage && (
        <Text mt={4} color="red.500" fontSize="sm">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
};

export default RecordAudio;
