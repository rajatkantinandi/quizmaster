const path = require('path');

module.exports = {
  process(source, filename) {
    return {
      code: `
        const React = require('react');
        module.exports = {
          __esModule: true,
          default: ${JSON.stringify(path.basename(filename))},
          ReactComponent: React.forwardRef((props, ref) => React.createElement('svg', { ...props, ref })),
        };
      `,
    };
  },
};
