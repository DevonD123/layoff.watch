/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Group,
  Image,
  SimpleGrid,
  Text,
  useMantineTheme,
  Modal,
  Button,
  Box,
  Slider,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone as MDropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Cropper from "react-easy-crop";
import { getCroppedImg, ICropData } from "./helpers";
import showMsg from "@h/msg";

export enum AspectRatio {
  Square = 1,
  Landscape = 16 / 9,
}

interface IProps {
  files: File[];
  onChange: (files: File[]) => void;
  doCrop?: boolean;
  maxFiles?: number;
  aspectRatio?: AspectRatio;
  maxFileSize?: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
}

const DropZone = ({
  maxFiles,
  onChange,
  doCrop = true,
  files,
  maxFileSize = 3 * 1024 ** 2,
  aspectRatio = AspectRatio.Square,
  maxHeight = 200,
  maxWidth = 200,
}: IProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICropData>({
    x: 0,
    y: 0,
    width: maxWidth,
    height: maxHeight,
  });

  const [cropOpen, setCropOpen] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);

  const onCropComplete = useCallback((_, croppedAreaPixels: ICropData) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImg = useCallback(async () => {
    const tempUrl = tempFile ? URL.createObjectURL(tempFile) : "";
    try {
      const croppedImage = await getCroppedImg(
        tempUrl,
        croppedAreaPixels,
        tempFile?.name,
        rotation,
        tempFile?.type
      );
      if (!croppedImage) {
        return showMsg("Error transforming image", "error");
      }
      onChange([...files, croppedImage]);
      setCropOpen(false);
    } catch (e) {
      console.error(e);
      return showMsg("Error transforming image", "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels, rotation, tempFile]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index} style={{ position: "relative" }}>
        <ActionIcon
          color="dark"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 997 }}
          variant="filled"
          onClick={() => onChange(files.filter((_, i) => i !== index))}
          radius="xl"
        >
          <IconX />
        </ActionIcon>
        <Image
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          alt={"uploaded image"}
          width={maxWidth}
          height={maxHeight}
          fit="contain"
        />
      </div>
    );
  });

  function handleDrop(newFile: File[]) {
    if (!doCrop) {
      return onChange([...files, ...newFile]);
    }

    if (newFile && newFile.length >= 1) {
      setTempFile(newFile[0]);
      setCropOpen(true);
    }
  }

  useEffect(() => {
    if (!cropOpen) {
      setRotation(0);
      setZoom(1);
      setTempFile(null);
      setCroppedAreaPixels((old) => ({ ...old, x: 0, y: 0 }));
    }
  }, [cropOpen]);

  const theme = useMantineTheme();
  return (
    <>
      {(!files ||
        files.length <= 0 ||
        !maxFiles ||
        maxFiles < files.length) && (
        <MDropzone
          onDrop={handleDrop}
          onReject={(files) => {
            const msg = files
              .map((x) => x.errors.map((e) => e.message).join(", "))
              .join(", ");
            showMsg(msg, "error");
          }}
          maxSize={maxFileSize}
          accept={IMAGE_MIME_TYPE}
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
                {!maxFiles
                  ? "Attach as many files as you like (max 5mb ea)"
                  : maxFiles > 1
                  ? `Attach up to ${maxFiles} files (max 5mb ea)`
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
      {doCrop && cropOpen && tempFile && (
        <Modal
          opened={cropOpen}
          title="Crop image"
          onClose={() => setCropOpen(false)}
        >
          <Box
            sx={{
              padding: 10,
              width: "100%",
              minHeight: 200,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Cropper
              image={URL.createObjectURL(tempFile)}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Box
            sx={{
              padding: 10,
              width: "100%",
            }}
          >
            <Text size="sm" align="left">
              Zoom
            </Text>
            <Slider value={zoom} onChange={setZoom} min={0.5} max={2.5} />
            <br />
            <Text size="sm" align="left">
              Rotate
            </Text>
            <Slider value={rotation} onChange={setRotation} min={0} max={360} />
          </Box>
          <Group position="right">
            <Button
              sx={{ marginRight: 25 }}
              variant="outline"
              onClick={() => setCropOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={createCroppedImg}>Done</Button>
          </Group>
        </Modal>
      )}
    </>
  );
};

export default DropZone;
