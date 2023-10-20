import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  defaultRadius: 0,
  components: {
    TextInput: {
      styles: (theme, params) => ({
        input:
          params.variant === 'filled'
            ? {
                backgroundColor: 'var(--input-bg)',
                boxShadow: theme.shadows.sm,
                '::placeholder': {
                  color: 'var(--qm-primary)',
                },
              }
            : {},
      }),
    },
    Textarea: {
      styles: (theme, params) => ({
        input:
          params.variant === 'filled'
            ? {
                backgroundColor: 'var(--input-bg)',
                boxShadow: theme.shadows.sm,
                '::placeholder': {
                  color: 'var(--qm-primary)',
                },
              }
            : {},
      }),
    },
    Button: {
      styles: (theme, params) => ({
        root: { borderRadius: params.radius ? undefined : 8, ...getButtonCss(params) },
      }),
    },
    Tabs: {
      styles: (theme, params) => ({
        tab: getTabStyle(theme, params),
        tabsList: params.variant === 'pills' ? { gap: 0 } : {},
      }),
    },
    Checkbox: {
      styles: (theme, params) => ({
        input: params.color
          ? {}
          : {
              backgroundColor: 'var(--checkbox-bg)',
              borderColor: 'var(--qm-primary)',

              '&:checked': {
                backgroundColor: 'var(--checkbox-bg)',
                borderColor: 'var(--qm-primary)',
              },
            },
        icon: params.color
          ? {}
          : {
              color: 'var(--qm-primary) !important',
            },
      }),
    },
    Radio: {
      styles: (theme, params) => ({
        radio: {
          backgroundColor: 'white',
          borderColor: 'var(--qm-primary)',

          '&:checked': {
            backgroundColor: 'white',
            borderColor: 'var(--qm-primary)',
          },
        },
        icon: {
          color: 'var(--qm-primary)',
        },
      }),
    },
  },
};

function getButtonCss(params) {
  if (params.color) {
    return {};
  } else {
    switch (params.variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--qm-primary)',

          '&:hover': {
            backgroundColor: 'var(--primary-button-bg-hover)',
          },
        };
      case 'default':
        return {
          backgroundColor: 'var(--default-button-bg)',
          border: 'none',

          '&:hover': {
            backgroundColor: 'var(--default-button-bg-hover)',
          },
        };
      case 'outline':
        return {
          color: 'var(--qm-primary)',
          borderColor: 'var(--qm-primary)',
          fontSize: 'bold',
        };
      case 'light':
        return {
          color: 'var(--qm-primary)',
          fontSize: 'bold',
        };
      case 'subtle':
        return {
          padding: '3px',

          '&:hover': {
            backgroundColor: 'transparent',
          },
        };
      default:
        return {};
    }
  }
}

function getTabStyle(theme, params) {
  switch (params.variant) {
    case 'pills':
      return {
        ...theme.fn.focusStyles(),
        fontWeight: 'bold',
        color: 'var(--qm-primary)',
        border: '1px solid var(--qm-primary)',

        '&:hover': {
          backgroundColor: 'transparent',
        },

        '&[data-active]': {
          backgroundColor: 'var(--qm-primary)',
          color: theme.white,

          '&:hover': {
            backgroundColor: 'var(--qm-primary)',
          },
        },
      };
    case 'default':
      return {
        ...theme.fn.focusStyles(),
        fontWeight: 500,
        fontSize: '16px',

        '&[data-active]': {
          backgroundColor: theme.white,
          color: 'var(--qm-primary)',
          borderColor: 'var(--qm-primary)',

          '&:hover': {
            backgroundColor: 'var(--qm-primary)',
            color: theme.white,
            borderColor: theme.white,
          },
        },
      };
    default:
      return {};
  }
}

export default theme;
