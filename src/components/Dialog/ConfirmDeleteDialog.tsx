import { Modal, Button, Group, Text } from "@mantine/core";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  msg: string;
};

function ConfirmDeleteDialog({ msg, onClose, onDelete, open }: Props) {
  return (
    <Modal opened={open} onClose={onClose} title={msg}>
      <Group position="center">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} color="red">
          Delete
        </Button>
      </Group>
    </Modal>
  );
}

export default ConfirmDeleteDialog;
