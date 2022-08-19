import React from "react";
import RootTag from "./RootTag";
import Link from "next/link";
import { IconDownload } from "@tabler/icons";
import { ActionIcon } from "@mantine/core";
type Props = {
  isAdmin?: boolean;
  isDraft?: boolean;
  url: string;
  title: string;
  onRemove?: () => void;
};

function AttachmentTag({ title, url, isAdmin, isDraft, onRemove }: Props) {
  return (
    <RootTag
      startIcon={
        <Link href={url} passHref>
          <ActionIcon
            variant="light"
            component="a"
            target="__blank"
            color="green"
            style={{ marginRight: 5 }}
          >
            <IconDownload />
          </ActionIcon>
        </Link>
      }
      label={title}
      value={url}
      onRemove={((isAdmin || isDraft) && onRemove) || undefined}
    />
  );
}

export default AttachmentTag;
