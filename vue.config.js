const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // important extra layer for less-loader^6.0.0
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
  }
}
