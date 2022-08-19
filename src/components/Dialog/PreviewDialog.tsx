import { PropsWithChildren } from "react";
import { Modal } from "@mantine/core";
const PreviewDialog = ({
  open,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; onClose: () => void }>) => (
  <Modal
    fullScreen
    opened={open}
    onClose={onClose}
    title="Preview"
    padding="md"
  >
    {children}
  </Modal>
);

export default PreviewDialog;
