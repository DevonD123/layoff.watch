import { PropsWithChildren } from "react";
import SlideTransition from "./SlideTransition";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PreviewDialog({
  open,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      style={{ paddingTop: 25 }}
    >
      <IconButton
        size="small"
        title="Close"
        aria-label="Close"
        onClick={onClose}
        style={{ position: "fixed", top: 25, right: 5 }}
      >
        <CloseIcon />
      </IconButton>
      {children}
    </Dialog>
  );
}
