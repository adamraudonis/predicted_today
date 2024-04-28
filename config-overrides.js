const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add the ProvidePlugin to shim the process module
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);

  // Modify the babel-loader to include react-refresh/babel plugin in development mode
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.includes('babel-loader')) {
          oneOfRule.options = oneOfRule.options || {};
          oneOfRule.options.plugins = oneOfRule.options.plugins || [];
        }
      });
    }
  });

  return config;
};
