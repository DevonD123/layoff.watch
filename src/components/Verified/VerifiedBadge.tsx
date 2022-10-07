import React from 'react';
import { Badge, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons';

export default function VerifiedBadge(props: any) {
  if (typeof props.verified !== 'boolean' || !props.verified) {
    return null;
  }
  if (props.isSmall) {
    return (
      <ThemeIcon
        size={15}
        radius="xl"
        mr="xs"
        ml="xs"
        color="green"
        variant="light"
        title="Verified"
      >
        <IconCheck size={15} />
      </ThemeIcon>
    );
  }
  return (
    <Badge color="green" leftSection={<IconCheck size={10} />}>
      Verified
    </Badge>
  );
}
