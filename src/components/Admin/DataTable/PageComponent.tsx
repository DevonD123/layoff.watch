import React from "react";
import { ActionIcon, Text } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons";
import { pgStatus } from "@h/pghelper";

type Props = {
  pg: number;
  total: number;
  onMove: (newPg: number) => void;
};

function PageComponent({ pg, total, onMove }: Props) {
  const { hasNext, hasBack, totalPgs, totalRecords, itemsPer } = pgStatus(
    pg,
    total
  );
  const onBackClicked = () => onMove(pg - 1);
  const onNextClicked = () => onMove((pg || 1) + 1);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "5px auto 10px auto",
        maxWidth: 200,
      }}
    >
      <ActionIcon
        onClick={onBackClicked}
        disabled={!hasBack}
        title="previous page"
      >
        <IconArrowNarrowLeft />
      </ActionIcon>
      <Text align="center" color="dimmed">
        pg {pg} of {totalPgs}
      </Text>
      <ActionIcon onClick={onNextClicked} disabled={!hasNext} title="next page">
        <IconArrowNarrowRight />
      </ActionIcon>
    </div>
  );
}

export default PageComponent;
