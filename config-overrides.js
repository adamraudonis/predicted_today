const webpack = require('webpack');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = function override(config, env) {
  // Enable only in development mode
  const isDevelopment = env !== 'production';

  // Add the ProvidePlugin to shim the process module
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);

  // Add ReactRefreshWebpackPlugin in development mode
  // if (isDevelopment) {
  //   config.plugins.push(new ReactRefreshWebpackPlugin());
  // }

  // Modify the babel-loader to include react-refresh/babel plugin in development mode
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.includes('babel-loader')) {
          oneOfRule.options = oneOfRule.options || {};
          oneOfRule.options.plugins = oneOfRule.options.plugins || [];
          // if (isDevelopment) {
          //   oneOfRule.options.plugins.push(require.resolve('react-refresh/babel'));
          // }
        }
      });
    }
  });

  return config;
};
