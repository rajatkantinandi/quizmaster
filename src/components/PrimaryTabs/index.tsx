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
          color: theme.colors['qm-primary'][0],
          border: `2px solid ${theme.colors['qm-primary'][0]}`,
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
            backgroundColor: theme.colors['qm-primary'][0],
            borderColor: theme.colors['qm-primary'][0],
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
