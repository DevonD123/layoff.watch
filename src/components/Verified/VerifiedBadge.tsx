import React from "react";
import { Badge } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

export default function VerifiedBadge(props: any) {
  if (typeof props.verified !== "boolean" || !props.verified) {
    return null;
  }
  return (
    <Badge
      color="green"
      //   style={{
      //     textTransform: "none",
      //     position: "absolute",
      //     left: 5,
      //     top: 5,
      //   }}
      leftSection={<IconCheck size={10} />}
    >
      Verified
    </Badge>
  );
}
