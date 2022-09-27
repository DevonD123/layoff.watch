import VerifiedBadge from "@c/Verified/VerifiedBadge";
import { ActionIcon, Text } from "@mantine/core";
import { IconCaretRight } from "@tabler/icons";
import Link from "next/link";
import React from "react";
import { StyledListItem } from "./styles";

type Props = {
  title?: string;
  link?: string;
  left: string | JSX.Element;
  rightTop?: string | JSX.Element;
  rightBottom: string | JSX.Element;
  avatar?: JSX.Element;
  id?: string;
  verified?: boolean;
};

function ListItem({
  title,
  link,
  left,
  rightTop,
  rightBottom,
  avatar,
  id,
  verified,
}: Props) {
  return (
    <StyledListItem icon={avatar} id={id}>
      <div className="item">
        <div className="itemRow">
          {title && (
            <Text
              title={title}
              color="dark"
              size="lg"
              className="w100 ellipsis"
            >
              <b>{title}</b>
              <VerifiedBadge verified={verified} />
            </Text>
          )}
          <div className="spaceBetween">
            <Text
              color="dark"
              size="lg"
              className={`ellipsis alignTop w50`}
              align="left"
              title={typeof left === "string" ? left : ""}
            >
              {left}
            </Text>
            <div className="inlinetwo">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <div className="rows">
                  {rightTop && (
                    <Text
                      color="dark"
                      size="xs"
                      className="ellipsis"
                      align="right"
                      title={typeof rightTop === "string" ? rightTop : ""}
                    >
                      {rightTop}
                    </Text>
                  )}

                  <Text
                    color="dimmed"
                    size="xs"
                    className="ellipsis"
                    align="right"
                    title={typeof rightBottom === "string" ? rightBottom : ""}
                  >
                    {rightBottom}
                  </Text>
                </div>
                {link && (
                  <Link href={link} passHref>
                    <ActionIcon color="blue" size="sm">
                      <IconCaretRight size={20} />
                    </ActionIcon>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledListItem>
  );
}

export default ListItem;
