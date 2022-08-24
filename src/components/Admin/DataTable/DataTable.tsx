import React, { useMemo } from "react";
import { Table, ActionIcon, Tooltip, Group } from "@mantine/core";
import {
  IconCheck,
  IconTrash,
  IconEditCircle,
  IconArrowRight,
  IconCircleX,
} from "@tabler/icons";
import Link from "next/link";

type Props = {
  heading: React.ReactNode[];
  /*
     return a tr in a fragment
  */
  rowmapper: (el: any, index: number) => { elList: React.ReactNode[]; el: any };
  data?: any[];
  onEditClicked?: (el: any) => void;
  onApproveClicked?: (el: any) => void;
  onDenyClicked?: (el: any) => void;
  onDeleteClicked?: (el: any) => void;
  getLinkUrl: (el: any) => string;
};

export default function DataTable({
  data,
  rowmapper,
  heading,
  onApproveClicked,
  onDenyClicked,
  onDeleteClicked,
  onEditClicked,
  getLinkUrl,
}: Props) {
  const rows = useMemo(
    () =>
      data?.map(rowmapper).map(({ el, elList }, index) => (
        <tr key={`row_${index}`}>
          {elList}
          <td>
            <Group position="right">
              {el.is_draft ? (
                <>
                  {typeof onApproveClicked === "function" && (
                    <Tooltip label="Approve">
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => onApproveClicked(el)}
                      >
                        <IconCheck />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {typeof onDenyClicked === "function" && (
                    <Tooltip label="Deny">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => onDenyClicked(el)}
                      >
                        <IconCircleX />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </>
              ) : (
                typeof onDeleteClicked === "function" && (
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => onDeleteClicked(el)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                )
              )}

              {onEditClicked && (
                <Tooltip label="Edit">
                  <ActionIcon
                    onClick={() => onEditClicked(el)}
                    variant="light"
                    color="blue"
                  >
                    <IconEditCircle />
                  </ActionIcon>
                </Tooltip>
              )}

              <Tooltip label="View Pg.">
                <Link href={getLinkUrl(el)} passHref>
                  <ActionIcon variant="transparent" component="a">
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Tooltip>
            </Group>
          </td>
        </tr>
      )),
    [data, rowmapper]
  );

  return (
    <Table striped style={{ width: "100%" }}>
      <thead>
        <tr>
          {heading}
          <th style={{ textAlign: "right", paddingRight: 20 }}>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
