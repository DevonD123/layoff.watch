import React from "react";
import { Modal, Button, Group, Alert } from "@mantine/core";

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
  children,
  isLoading,
  acceptDisabled,
  errorList,
}: React.PropsWithChildren<ICreateEntityDialogProps>) {
  console.log("dialog status ", open);
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
      <Alert color="red" title="Errors" style={{ marginBottom: "2px" }}>
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
      <Alert color="orange" title="Warnings">
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
    <Modal
      opened={open}
      onClose={closeWithHoldForLoading}
      closeOnEscape={!isLoading}
      padding="md"
      lockScroll
      fullScreen={false}
      title={title}
    >
      {errors}
      {warnings}
      {children}
      <br />
      <Group position="right" spacing="md">
        <Button
          onClick={closeWithHoldForLoading}
          color="error"
          variant="filled"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          color="dev-blue"
          variant="filled"
          disabled={acceptDisabled || isLoading}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
}

export default CreateEntityDialog;
