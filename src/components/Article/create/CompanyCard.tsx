import { PropsWithChildren } from "react";
import { Avatar, CloseButton, Box, ActionIcon } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import Link from "next/link";

interface IProps extends PropsWithChildren<{}> {
  name: string;
  id: string;
  ticker?: string;
  logo_url?: string;
  isDraft?: string;
  isAdmin?: string;
  onRemove?: () => void;
  linkTo?: string;
}

function CompanyCard({
  id,
  name,
  onRemove,
  children,
  ticker,
  logo_url,
  linkTo,
}: IProps) {
  return (
    <Box
      id={"company_car_" + id}
      sx={(theme) => ({
        padding: 5,
        borderRadius: 4,
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.white,
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[4]
        }`,
      })}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            cursor: "default",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{ marginRight: 10 }}
            src={logo_url && `${logo_url}?size=${30}&format=png`}
            alt={name}
            size={30}
          >
            {name.charAt(0)}
          </Avatar>

          <Box sx={{ lineHeight: 1, fontSize: 12 }}>
            <div>{name}</div>
            {ticker && (
              <Box
                sx={(theme) => ({
                  lineHeight: 1,
                  fontSize: 9,
                  color: theme.colors.gray[5],
                  marginTop: "3px",
                })}
              >
                {ticker}
              </Box>
            )}
          </Box>
        </div>
        {typeof onRemove === "function" ? (
          <CloseButton
            onMouseDown={onRemove}
            variant="transparent"
            size={22}
            iconSize={14}
            tabIndex={-1}
          />
        ) : linkTo ? (
          <Link href={linkTo} passHref>
            <ActionIcon component="a">
              <IconLink size="18" />
            </ActionIcon>
          </Link>
        ) : null}
      </div>
      <div style={{ width: "100%", paddingLeft: "1em" }}>{children}</div>
    </Box>
  );
}

export default CompanyCard;
