import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ICreateEntityDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  isLoading?: boolean;
  acceptDisabled?: boolean;
  title: string | React.ReactNode;
  body?: string | React.ReactNode;
  errorList?: { msg: string; sev?: "error" | "warning" }[];
}

function CreateEntityDialog({
  open,
  onClose,
  onAccept,
  title,
  body,
  children,
  isLoading,
  acceptDisabled,
  errorList,
}: React.PropsWithChildren<ICreateEntityDialogProps>) {
  function closeWithHoldForLoading() {
    if (isLoading) {
      return;
    }
    onClose();
  }
  const errors = React.useMemo(() => {
    if (!errorList || errorList.length <= 0) {
      return <></>;
    }
    const errors = errorList.filter((li) => li.sev || "error" === "error");
    if (errors.length <= 0) {
      return <></>;
    }
    return (
      <Alert severity="error" style={{ marginBottom: "2px" }}>
        {errors.map(({ msg }) => (
          <React.Fragment key={msg}>
            {msg}
            <br />
          </React.Fragment>
        ))}
      </Alert>
    );
  }, [errorList]);

  const warnings = React.useMemo(() => {
    if (!errorList || errorList.length <= 0) {
      return <></>;
    }
    const warnings = errorList.filter((li) => li.sev === "warning");
    if (warnings.length <= 0) {
      return <></>;
    }
    return (
      <Alert severity="warning">
        {warnings.map(({ msg }) => (
          <React.Fragment key={msg}>
            {msg}
            <br />
          </React.Fragment>
        ))}
      </Alert>
    );
  }, [errorList]);

  return (
    <Dialog
      open={open}
      onClose={closeWithHoldForLoading}
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ paddingTop: ".5em" }}>
        <DialogContentText>{body}</DialogContentText>
        {errors}
        {warnings}
        {children}
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
          onClick={onAccept}
          color="info"
          variant="contained"
          disabled={acceptDisabled || isLoading}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateEntityDialog;
