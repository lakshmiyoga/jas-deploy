module.exports = {
    // Other webpack configurations...
    module: {
      rules: [
        {
          test: /\.mjs$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/@react-aria\/ssr/, // Ignore missing source maps from @react-aria/ssr
          ],
        },
      ],
    },
  };
  