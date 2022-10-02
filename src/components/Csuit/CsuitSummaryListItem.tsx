import React, { PropsWithChildren } from "react";
import { Avatar, Table, Text, ScrollArea } from "@mantine/core";
import getImage from "@h/getImage";
import { ListItem } from "@c/List";

type Props = {
  filter?: string;
  id: string;
  name: String;
  img_url?: string;
  csuit_role?: {
    id: string;
    role: string;
    start: Date;
    end: Date;
    company?: {
      id: string;
      name: string;
      ticker?: string;
    };
  }[];
};

function CsuitSummaryListItem({
  id,
  img_url,
  name,
  csuit_role,
  filter,
}: Props) {
  const roleIndex =
    csuit_role && csuit_role.length >= 1
      ? csuit_role.findIndex((x) => !x.end)
      : -1;

  if (filter) {
    if (!name.toLowerCase().includes(filter)) {
      if (roleIndex === -1) {
        return null;
      }

      if (!csuit_role![roleIndex].role.toLowerCase().includes(filter)) {
        if (!csuit_role![roleIndex].company) {
          return null;
        }

        if (
          !csuit_role![roleIndex].company?.name
            .toLowerCase()
            .includes(filter) &&
          (!csuit_role![roleIndex].company?.ticker ||
            !csuit_role![roleIndex].company?.ticker
              ?.toLowerCase()
              .includes(filter))
        ) {
          return null;
        }
      }
    }
  }
  return (
    <ListItem
      avatar={
        <Avatar
          size={40}
          src={img_url ? getImage({ fallbackUrl: img_url }) : ""}
          radius={40}
        />
      }
      left={
        <div>
          <Text size="sm" weight={500}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            Exec name
          </Text>
        </div>
      }
      rightTop={
        roleIndex === -1
          ? "Unknown"
          : `${csuit_role![roleIndex].role}${
              csuit_role![roleIndex]?.company
                ? ` @ ${
                    csuit_role![roleIndex].company?.ticker ||
                    csuit_role![roleIndex].company?.name
                  }`
                : ""
            }`
      }
      rightBottom={"Current role"}
      link={`/exec/${id}`}
    />
  );
}

export const CsuitListWrapper = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ScrollArea>
      <Table sx={{ minWidth: 300 }} verticalSpacing="md">
        {children}
      </Table>
    </ScrollArea>
  );
};

export default CsuitSummaryListItem;
