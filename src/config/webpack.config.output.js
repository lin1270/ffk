const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.config.common')
const cleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽取样式文件
const uglify = require('uglifyjs-webpack-plugin');

module.exports = function() {
  return webpackMerge(webpackCommonConfig(), {
    plugins: [
      new cleanWebpackPlugin(['output/*'], {
          root: process.cwd()
      }),
      new ExtractTextPlugin('assets/css/[name][hash:8].css'),
      new uglify()
    ]
  })
}