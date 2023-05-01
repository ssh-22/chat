const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new InjectManifest({
        swSrc: './src/service-worker.ts',
        swDest: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      }),
    );
  }

  return config;
};
