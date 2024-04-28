const webpack = require('webpack');

module.exports = function override(config, env) {
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);

  // Removed the alias for 'react-refresh/runtime' and the unused 'path' module to prevent import outside of src/ directory

  return config;
};
