const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);

  // Add an alias for 'react-refresh/runtime' to resolve the import path issue
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-refresh/runtime': path.resolve(__dirname, 'node_modules/react-refresh/runtime.js'),
    },
  };

  return config;
};
