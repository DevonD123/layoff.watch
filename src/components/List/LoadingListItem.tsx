import React from "react";
import { Skeleton } from "@mantine/core";
import { StyledListItem } from "./styles";

function LoadingListItem() {
  return (
    <StyledListItem
      icon={<Skeleton radius="xl" width={50} height={50} />}
      isLoading
    >
      <Skeleton width="100%" height={50} />
    </StyledListItem>
  );
}

export default LoadingListItem;
