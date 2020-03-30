const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.config.common')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const webpack = require('webpack')
const portfinder = require('portfinder')
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽取样式文件

const getCfg = function() {
  return webpackMerge(webpackCommonConfig(), {
    devServer: {
      clientLogLevel: 'warning',
      hot: true,
      contentBase: './output', // since we use CopyWebpackPlugin.
      compress: false,
      host: 'localhost',
      port: global.port,
      open: true,
      overlay: { warnings: false, errors: true },
      publicPath: './',
      proxy: {},
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
        poll: false,
      },
      inline: true
    },
    plugins:[
      
      new webpack.HotModuleReplacementPlugin(),
      new OpenBrowserPlugin({
          url: `http://localhost:${global.port}`
      }),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin(),
      new ExtractTextPlugin('assets/css/[name][hash:8].css'),
    ]
  })
}

module.exports = function() {
  return  new Promise((resolve, reject) => {
    portfinder.basePort = global.port
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        global.port = port

        resolve(getCfg())
      }
    })
  })
}