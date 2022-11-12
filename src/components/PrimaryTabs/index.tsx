import React from 'react';
import { Tabs, TabsProps } from '@mantine/core';

function PrimaryTabs(props: TabsProps) {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor: 'transparent',
          color: 'var(--qm-primary)',
          border: '2px solid var(--qm-primary)',
          padding: '5px 5px',
          cursor: 'pointer',
          fontSize: theme.fontSizes.md,
          fontWeight: 'bold',
          minWidth: 200,

          '&:first-of-type': {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          '&:last-of-type': {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },

          '&[data-active]': {
            backgroundColor: 'var(--qm-primary)',
            borderColor: 'var(--qm-primary)',
            color: theme.white,
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: 'flex',
          alignItems: 'center',
        },

        tabsList: {
          display: 'flex',
        },
      })}
      {...props}
    />
  );
}

export default PrimaryTabs;
