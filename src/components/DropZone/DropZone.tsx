import {
  ActionIcon,
  Group,
  Image,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import {
  Dropzone as MDropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { useState } from "react";

const DropZone = (props: Partial<DropzoneProps>) => {
  const [files, setFiles] = useState<File[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index} style={{ position: "relative" }}>
        <ActionIcon
          color="dark"
          style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}
          variant="filled"
          onClick={() => setFiles(files.filter((_, i) => i !== index))}
          radius="xl"
        >
          <IconX />
        </ActionIcon>
        <Image
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          alt={"uploaded image"}
        />
      </div>
    );
  });

  const theme = useMantineTheme();
  return (
    <>
      {(!files ||
        files.length <= 0 ||
        !props.maxFiles ||
        props.maxFiles < files.length) && (
        <MDropzone
          onDrop={(newFile) => setFiles([...files, ...newFile])}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...props}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 100, pointerEvents: "none" }}
          >
            <MDropzone.Accept>
              <IconUpload
                size={25}
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </MDropzone.Accept>
            <MDropzone.Reject>
              <IconX
                size={25}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </MDropzone.Reject>
            <MDropzone.Idle>
              <IconPhoto size={25} stroke={1.5} />
            </MDropzone.Idle>

            <div>
              <Text size="md" inline>
                Drag or click to upload
              </Text>
              <Text size="xs" color="dimmed" inline mt={7}>
                {!props.maxFiles
                  ? "Attach as many files as you like (max 5mb ea)"
                  : props.maxFiles > 1
                  ? `Attach up to ${props.maxFiles} files (max 5mb ea)`
                  : "(max 5mb)"}
              </Text>
            </div>
          </Group>
        </MDropzone>
      )}
      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt={previews.length > 0 ? "xl" : 0}
      >
        {previews}
      </SimpleGrid>
    </>
  );
};

export default DropZone;
