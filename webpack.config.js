const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/public/index.html',
  filename: 'index.html',
  inject: 'body',
  hash: true,
});

const { ENVIRONMENT } = process.env;

function getPlugins() {
  const plugins = [];
  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = `${currentPath}/.env.${ENVIRONMENT.trim()}`;

  // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: envPath }).parsed;

  // reduce it to a nice object, the same as before (but with the variables from the file)
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  plugins.push(
    HtmlWebpackPluginConfig,
    new webpack.ProvidePlugin({ jQuery: 'jquery' }),
    new webpack.DefinePlugin({ ...envKeys }),
  );

  plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /es/));
  plugins.push(new webpack.SourceMapDevToolPlugin({}));
  return plugins;
}

module.exports = {
  entry: [ 'babel-polyfill', './src/index.js' ],
  output: {
    path: path.resolve('build'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  optimization: {
    nodeEnv: ENVIRONMENT,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [],
  },
  mode: ENVIRONMENT,
  resolve: {
    modules: [ path.join(__dirname, './src'), 'node_modules' ],
    extensions: [ '.js', '.jsx', '.css', '.scss' ],
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(gif|svg|jpg|png|woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(css|scss|sass)$/,
        include: [ path.resolve(__dirname, 'src/') ],
        exclude: [ path.resolve(__dirname, 'node_modules/') ],
        use: [
          {
            loader: 'style-loader',
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
  },
  plugins: getPlugins(),
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
