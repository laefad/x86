import * as path from 'path'
import * as webpack from 'webpack'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
  target: 'node',
  entry: {
    extension: './src/extension.ts',
    webview: './src/webview/main.ts',
    vscodeUI: './node_modules/@vscode-elements/elements/dist/vscode-tree/vscode-tree.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    // The vscode-module is created on-the-fly and must be excluded.
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      // Plugin for using aliases from tsconfig paths
      new TsconfigPathsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'node_modules/@vscode/codicons/dist', 
          to: './',
          filter: (path) => (/.*(\.ttf|\.css)/gm).test(path)
        },
        { from: 'node_modules/@vscode-elements/elements/dist/bundled.js', to: 'vscodeUI.js'}
      ]
    })
  ]
}

export default config
