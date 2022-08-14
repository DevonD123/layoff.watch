import React from "react";
import Link from "next/link";
import { Chip, styled, IconButton } from "@mui/material";
import { Work } from "@mui/icons-material";
import { IPositionOption } from "./PositionSelect";

interface Props {
  showAbbreviation?: boolean;
  items: IPositionOption[];
  allowLink?: boolean;
}

const SpacedChip = styled(Chip)`
  margin: 5px;
`;
const LinkedChip = ({ title, link }: { title: string; link?: string }) => {
  if (link) {
    return (
      <Link href={link} passHref>
        <SpacedChip label={title} size="medium" clickable variant="outlined" />
      </Link>
    );
  }
  return (
    <SpacedChip
      label={title}
      size="medium"
      clickable={false}
      variant="outlined"
    />
  );
};
function createLink(tag: string | undefined) {
  if (!tag) {
    return undefined;
  }
  return `/position?q=${encodeURIComponent(tag)}`;
}
function PositionChipGroup({ showAbbreviation, items, allowLink }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {allowLink ? (
        <Link href="/position" passHref>
          <IconButton component="a">
            <Work />
          </IconButton>
        </Link>
      ) : (
        <Work />
      )}
      {items.map((itm) => (
        <LinkedChip
          key={itm.name}
          title={
            showAbbreviation && itm.abbreviation ? itm.abbreviation : itm.name
          }
          link={allowLink ? createLink(itm.name) : undefined}
        />
      ))}
    </div>
  );
}

export default PositionChipGroup;
