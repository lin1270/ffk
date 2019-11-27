'use strict'
const styleUtils = require('./styleUtils')
const px2rem = require('postcss-px2rem')
const config = require('./config')

module.exports = function () {
  return {
    loaders: styleUtils.cssLoaders({
      minimize: !global.IS_DEV,
      sourceMap: !!global.IS_DEV,
      extract: !global.IS_DEV,
      css: 'vue-style-loader!css-loader',
      less: 'vue-style-loader!css-loader!less-loader',
      sass: 'vue-style-loader!css-loader!sass-loader',
      scss: 'vue-style-loader!css-loader!sass-loader'
    }),
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