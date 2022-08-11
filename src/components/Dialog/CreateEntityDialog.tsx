import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { EntityType } from "@c/Editor/SearchSelect";

interface ICreateEntityDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: EntityType;
}

const dialogTextMap = {
  CSuit: {
    title: "Add a new c-suit exec to our database",
    body: "",
  },
  Company: {
    title: "Add a new company to our database",
    body: "",
  },
  Org: {
    title: "Add a new org to our database",
    body: "",
  },
  Position: {
    title: "Add a new position type to our database",
    body: "",
  },
};

function CreateEntityDialog({
  open,
  onClose,
  onAccept,
  type,
}: ICreateEntityDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<any>({});
  function validateAndSave() {
    try {
      setIsLoading(true);
      /* type based validation & insert into db */
      onAccept();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }
  function closeWithHoldForLoading() {
    if (isLoading) {
      return;
    }
    onClose();
  }
  return (
    <Dialog
      open={open}
      onClose={closeWithHoldForLoading}
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>{dialogTextMap[type].title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogTextMap[type].body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeWithHoldForLoading}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={validateAndSave}
          color="info"
          variant="contained"
          disabled={isLoading}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateEntityDialog;
