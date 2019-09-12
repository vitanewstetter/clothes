const webpack = require('webpack');
const path = require('path');
const entries = require('./webpack.entries');

const JS_DIR_PATH = path.resolve('source/js');
const NODE_MODULES_PATH = path.resolve('node_modules');

module.exports = (env = {}) => {
  const isDev = env.config === 'development';
  const plugins = [
    new webpack.DefinePlugin({
      env: JSON.stringify(env),
    }),
  ];

  let devtool;
  let mode;
  const distDir = path.resolve('assets/js');

  if (isDev) {
    devtool = 'cheap-module-source-map';
    mode = 'development';
  } else {
    devtool = 'source-map';
    mode = 'production';
  }

  return {
    mode: mode,
    entry: entries.entries,
    output: {
      path: distDir,
      filename: '[name].bundle.js',
      publicPath: '/assets/js/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [JS_DIR_PATH],
          use: [
            {
              loader: 'babel-loader',
              query: {
                presets: ['env', 'stage-2'],
              },
            },
          ],
        },
      ],
    },
    devtool: devtool,
    plugins: plugins,
    resolve: {
      modules: [JS_DIR_PATH, NODE_MODULES_PATH],
      alias: {
        '@app': JS_DIR_PATH,
      },
    },
    watchOptions: {
      poll: 500,
      ignored: /node_modules/,
    },
  };
};