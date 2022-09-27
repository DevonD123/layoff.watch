import React from "react";
import { Text } from "@mantine/core";
import { StyledList, StyledListContainer } from "./styles";

type Props = {
  title?: string;
  id?: string;
  paged?: boolean;
  hasNext?: boolean;
};

function List({
  title,
  children,
  id,
  paged,
  hasNext,
}: React.PropsWithChildren<Props>) {
  return (
    <StyledListContainer>
      {title && (
        <Text size="xl" id={id} align="center">
          {title}
        </Text>
      )}
      <StyledList spacing="md">{children}</StyledList>
      {paged && !hasNext && (
        <Text align="center" color="dimmed" size="sm" mt={15} mb={25}>
          No more results
        </Text>
      )}
    </StyledListContainer>
  );
}

export default List;
