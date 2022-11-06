import React from 'react';
import { LoadingOverlay } from '@mantine/core';

function PageLoader() {
  return (
    <LoadingOverlay
      visible
      loaderProps={{
        variant: 'bars',
        size: 'xl',
        sx: (theme) => ({
          fill: theme.colors['qm-primary'][0],
        }),
      }}
    />
  );
}

export default PageLoader;
