import {
  Portal,
  Select,
  createListCollection,
  Popover,
  Button,
  usePopoverContext,
} from "@chakra-ui/react";

interface Language {
  label: string;
  value: string;
}

const languages: Language[] = [
{ label: "English", value: "English" },
{ label: "Spanish", value: "Spanish" },
{ label: "French", value: "French" },
{ label: "German", value: "German" },
{ label: "Italian", value: "Italian" },
{ label: "Portuguese", value: "Portuguese" },
{ label: "Russian", value: "Russian" },
{ label: "Japanese", value: "Japanese" },
{ label: "Korean", value: "Korean" },
{ label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
{ label: "Chinese (Traditional)", value: "Chinese (Traditional)" },
{ label: "Arabic", value: "Arabic" },
{ label: "Hindi", value: "Hindi" },
{ label: "Thai", value: "Thai" },
{ label: "Vietnamese", value: "Vietnamese" },
{ label: "Dutch", value: "Dutch" },
{ label: "Polish", value: "Polish" },
{ label: "Turkish", value: "Turkish" },
{ label: "Swedish", value: "Swedish" },
{ label: "Danish", value: "Danish" },
{ label: "Norwegian", value: "Norwegian" },
{ label: "Finnish", value: "Finnish" },
{ label: "Greek", value: "Greek" },
{ label: "Hebrew", value: "Hebrew" },
{ label: "Czech", value: "Czech" },
{ label: "Hungarian", value: "Hungarian" },
{ label: "Romanian", value: "Romanian" },
{ label: "Slovak", value: "Slovak" },
{ label: "Bulgarian", value: "Bulgarian" },
{ label: "Croatian", value: "Croatian" },
{ label: "Slovenian", value: "Slovenian" },
{ label: "Estonian", value: "Estonian" },
{ label: "Latvian", value: "Latvian" },
{ label: "Lithuanian", value: "Lithuanian" },
{ label: "Ukrainian", value: "Ukrainian" },
{ label: "Belarusian", value: "Belarusian" },
{ label: "Macedonian", value: "Macedonian" },
{ label: "Albanian", value: "Albanian" },
{ label: "Maltese", value: "Maltese" },
{ label: "Icelandic", value: "Icelandic" },
{ label: "Irish", value: "Irish" },
{ label: "Welsh", value: "Welsh" },
{ label: "Basque", value: "Basque" },
{ label: "Catalan", value: "Catalan" },
{ label: "Galician", value: "Galician" },
{ label: "Afrikaans", value: "Afrikaans" },
{ label: "Swahili", value: "Swahili" },
{ label: "Amharic", value: "Amharic" },
{ label: "Bengali", value: "Bengali" },
{ label: "Gujarati", value: "Gujarati" },
{ label: "Kannada", value: "Kannada" },
{ label: "Malayalam", value: "Malayalam" },
{ label: "Marathi", value: "Marathi" },
{ label: "Nepali", value: "Nepali" },
{ label: "Odia", value: "Odia" },
{ label: "Punjabi", value: "Punjabi" },
{ label: "Sinhala", value: "Sinhala" },
{ label: "Tamil", value: "Tamil" },
{ label: "Telugu", value: "Telugu" },
{ label: "Urdu", value: "Urdu" },
{ label: "Persian", value: "Persian" },
{ label: "Pashto", value: "Pashto" },
{ label: "Kurdish", value: "Kurdish" },
{ label: "Azerbaijani", value: "Azerbaijani" },
{ label: "Kazakh", value: "Kazakh" },
{ label: "Kyrgyz", value: "Kyrgyz" },
{ label: "Tajik", value: "Tajik" },
{ label: "Turkmen", value: "Turkmen" },
{ label: "Uzbek", value: "Uzbek" },
{ label: "Mongolian", value: "Mongolian" },
{ label: "Myanmar", value: "Myanmar" },
{ label: "Khmer", value: "Khmer" },
{ label: "Lao", value: "Lao" },
{ label: "Georgian", value: "Georgian" },
{ label: "Armenian", value: "Armenian" },
{ label: "Indonesian", value: "Indonesian" },
{ label: "Malay", value: "Malay" },
{ label: "Filipino", value: "Filipino" }
];

interface LanguageSelectProps {
  value?: string[];
  onValueChange: (details: { value: string[] }) => void;
  placeholder?: string;
  label?: string;
}

const SelectWithAutoClose = ({ 
  languageCollection, 
  value, 
  onValueChange, 
  placeholder 
}: {
  languageCollection: any;
  value?: string[];
  onValueChange: (details: { value: string[] }) => void;
  placeholder: string;
}) => {
  const popoverContext = usePopoverContext();

  const handleValueChange = (details: { value: string[] }) => {
    onValueChange(details);
    // Close the popover after selection
    setTimeout(() => {
      popoverContext.setOpen(false)
    }, 100);
  };

  return (
    <Select.Root
      collection={languageCollection}
      size="md"
      width="100%"
      value={value}
      onValueChange={handleValueChange}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {languages.map((language) => (
              <Select.Item item={language} key={language.label}>
                {language.value}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

const LanguageSelect = ({
  value,
  onValueChange,
  placeholder = "Select a language...",
}: LanguageSelectProps) => {
  const languageCollection = createListCollection({
    items: languages,
  });

  return (
    <Popover.Root size="xs">
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          size="lg"
          py={8}
          borderStyle="dashed"
          borderWidth={2}
          _hover={{
            borderColor: "gray.500",
            backgroundColor: "gray.50"
          }}
        >
          Select Language
        </Button>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Choose a Language</Popover.Header>
            <Popover.Body>
              <SelectWithAutoClose
                languageCollection={languageCollection}
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
              />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default LanguageSelect;





