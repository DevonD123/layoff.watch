import React from "react";
import { Box } from "@mantine/core";

interface Props {
  label: string;
  subLabel?: string;
  startIcon?: React.ReactElement;
  onClick?: () => void;
}

export default function StandAloneTag({
  onClick,
  label,
  startIcon,
  subLabel,
}: Props) {
  const isClickable = typeof onClick === "function";
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        cursor: "default",
        alignItems: "center",
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.white,
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[4]
        }`,
        paddingTop: subLabel ? 2 : 5,
        paddingBottom: subLabel ? 2 : 5,
        paddingLeft: startIcon ? 2 : 10,
        paddingRight: 4,
        borderRadius: 4,
        "&:hover": {
          transition: "300ms",
          opacity: isClickable ? 0.65 : 1,
          cursor: isClickable ? "pointer" : "default",
        },
      })}
      onClick={
        isClickable
          ? (e: any) => {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
    >
      {startIcon}
      <Box sx={{ lineHeight: 1, fontSize: 12 }}>
        <div>{label}</div>
        {subLabel && (
          <Box
            sx={(theme) => ({
              lineHeight: 1,
              fontSize: 9,
              color: theme.colors.gray[5],
              marginTop: "3px",
            })}
          >
            {subLabel}
          </Box>
        )}
      </Box>
    </Box>
  );
}
