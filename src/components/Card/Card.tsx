import React, { PropsWithChildren } from 'react';
import { Card as MCard, Title } from '@mantine/core';

type Props = {
  isDark?: boolean;
  title?: string;
  startIcon?: JSX.Element;
  isSmall?: boolean;
};

function Card({
  children,
  isDark,
  title,
  startIcon,
  isSmall,
}: PropsWithChildren<Props>) {
  return (
    <MCard
      sx={(theme) => ({
        minHeight: isSmall ? 50 : 200,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.xl,
        background: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        color: isDark ? theme.colors.gray[2] : theme.colors.gray[8],
        borderRadius: theme.radius.xl,
        position: 'relative',
      })}
    >
      {title && (
        <Title
          order={isSmall ? 5 : 3}
          align="left"
          sx={{
            marginTop: 0,
            marginRight: 15,
            whiteSpace: 'nowrap',
          }}
        >
          {startIcon}
          {title}
        </Title>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        {children}
      </div>
    </MCard>
  );
}

export default Card;
