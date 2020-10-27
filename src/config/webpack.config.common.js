'use strict'
const os = require('os');
const path = require('path')
const styleUtils = require('./styleUtils')
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽取样式文件
const config = require('./config')
const process = require('process')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const utils = require('../utils')
const fs = require('fs')

function resolve (dir) {
  return path.join(process.cwd(), '..', dir)
}

const cwd = function (cwd, ...args) {
  return path.resolve(cwd || process.cwd(), ...args)
}

const ownDir = function (...args) {
  return path.join(__dirname, '../../', ...args)
}

module.exports = function() { 
  const fullCfg = {
    context: path.resolve(process.cwd(), '../'),
    entry: config.entries(),
    output: {
      path: path.resolve(process.cwd(), './output'),
      filename: 'assets/js/[name].[hash:8].js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': cwd('src/'),
        'vue': 'vue/dist/vue.esm.js',
      },
      modules: [
        cwd('node_modules'),
        ownDir('node_modules')
      ],
    },
    resolveLoader: {
      modules: [
        cwd('node_modules'),
        ownDir('node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig()
        },
        {
          test: /\.js$/,
          use: [
            {
                loader: require.resolve('babel-loader'),
                options: { 
                  babelrc: false,
                  presets: [
                    [require.resolve('babel-preset-env'), require.resolve("babel-preset-stage-2")]
                  ],
                  "plugins": [
                    require.resolve("babel-plugin-transform-runtime"), 
                    require.resolve('babel-plugin-transform-decorators-legacy'),
                    require.resolve('babel-plugin-transform-class-properties'),
                    // require.resolve('babel-macros'),
                    [require.resolve('babel-plugin-transform-object-rest-spread'), {
                      useBuiltIns: true
                    }],
                    require.resolve('babel-plugin-syntax-dynamic-import'),
                  ]
                }
            }
          ],
          exclude: [cwd('node_modules'), ownDir('node_modules')],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: styleUtils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: styleUtils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: styleUtils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.ejs$/,
          use: ['ejs-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.less$/,
            use: global.IS_DEV 
              ? ['css-loader','postcss-loader', 'less-loader']
              : ExtractTextPlugin.extract({
                use: ['css-loader?minimize','postcss-loader', 'less-loader'],
                fallback: 'style-loader'
            }),
        },
        {
          test: /\.sass$/,
          use: global.IS_DEV
            ? ['css-loader','postcss-loader', 'sass-loader']
            : ExtractTextPlugin.extract({
                use: ['css-loader?minimize','postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
            }),
        },
        {
          test: /\.scss$/,
          use: global.IS_DEV
            ? ['css-loader','postcss-loader', 'sass-loader']
            : ExtractTextPlugin.extract({
                use: ['css-loader?minimize','postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
            }),
        },
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
          {
              from: cwd('src/data'),
              to: 'assets/data'
          }
      ]), 

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: global.IS_DEV ? '"development"' : '"production"'
        }
      }),
      
    ].concat(config.htmlPlugins()),
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }

  if (config.project.eslint) {
    const localESLintPath = cwd('node_modules/eslint') // 项目本地的 ESLint 路径
    fullCfg.module.rules.push({
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: "pre",
      include: [path.join(process.cwd(), 'src')], // 指定检查的目录
      options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
        eslintPath: fs.existsSync(localESLintPath) ? localESLintPath : 'eslint',
        formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      },
      
    })
  }
  

  if (!global.IS_DEV && config.project.cdn && config.project.cdn.length) {
    const randomValue = utils.getRandomNum(0, config.project.cdn.length - 1)
    fullCfg.output.publicPath = config.project.cdn[randomValue]
  }

  return fullCfg
}