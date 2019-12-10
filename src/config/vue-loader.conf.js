'use strict'
const styleUtils = require('./styleUtils')
const px2rem = require('postcss-px2rem')
const config = require('./config')

module.exports = function () {
  const loaders = styleUtils.cssLoaders({
    minimize: !global.IS_DEV,
    sourceMap: !!global.IS_DEV,
    extract: !global.IS_DEV,
    css: 'vue-style-loader!css-loader',
    less: 'vue-style-loader!css-loader!less-loader',
    sass: 'vue-style-loader!css-loader!sass-loader',
    scss: 'vue-style-loader!css-loader!sass-loader'
  })
  loaders.js = `babel-loader?${JSON.stringify({
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
  })}`
  return {
    loaders: loaders,
    cssSourceMap: !!global.IS_DEV,
    cacheBusting: false,
    transformToRequire: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    },
    postcss: function () {
      return config.project.px2rem ? [px2rem({rootValue:75})] : [];
    },
    postLoaders: {
        html: 'babel-loader'
    }
  }
}