import React, { PropsWithChildren } from "react";
import { Card as MCard, Title } from "@mantine/core";

type Props = {
  isDark?: boolean;
  title?: string;
};

function Card({ children, isDark, title }: PropsWithChildren<Props>) {
  return (
    <MCard
      sx={(theme) => ({
        minHeight: 200,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing.xl,
        background: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        color: isDark ? theme.colors.gray[2] : theme.colors.gray[8],
        borderRadius: theme.radius.xl,
        position: "relative",
      })}
    >
      {title && (
        <Title
          order={3}
          align="left"
          sx={{
            marginTop: 0,
            marginRight: 15,
          }}
        >
          {title}
        </Title>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {children}
      </div>
    </MCard>
  );
}

export default Card;
