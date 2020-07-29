module.exports = {
  css: {
    loaderOptions: {
      less: { // 配置less
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8984,
    proxy: 'http://127.0.0.1:7001'
  },
  productionSourceMap: false
}
