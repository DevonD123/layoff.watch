import React, { PropsWithChildren } from "react";
import {
  Avatar,
  Table,
  Group,
  Text,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { IconCaretRight } from "@tabler/icons";
import Link from "next/link";
import getImage from "@h/getImage";

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
    <tr
      style={{
        display: "flex",
        width: "100%",
        marginBottom: 15,
      }}
    >
      <td style={{ flexGrow: 1, width: "50%" }}>
        <Group spacing="sm">
          <Avatar
            size={40}
            src={img_url ? getImage({ fallbackUrl: img_url }) : ""}
            radius={40}
          />
          <div>
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Text color="dimmed" size="xs">
              Exec name
            </Text>
          </div>
        </Group>
      </td>
      <td style={{ flexGrow: 1, width: "45%" }}>
        <Text size="sm">
          {roleIndex === -1
            ? "Unknown"
            : `${csuit_role![roleIndex].role}${
                csuit_role![roleIndex]?.company
                  ? ` @ ${
                      csuit_role![roleIndex].company?.ticker ||
                      csuit_role![roleIndex].company?.name
                    }`
                  : ""
              }`}
        </Text>
        <Text size="xs" color="dimmed">
          Current role
        </Text>
      </td>
      <td
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexGrow: 0,
          width: "5%",
        }}
      >
        <Group spacing={0} position="right">
          {/* <ActionIcon>
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon> */}
          <Link href={`/exec/${id}`} passHref>
            <ActionIcon color="blue" size="sm">
              <IconCaretRight size={20} />
            </ActionIcon>
          </Link>
        </Group>
      </td>
    </tr>
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
