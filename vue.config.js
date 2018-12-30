module.exports = {
  baseUrl: '/',
  configureWebpack: {
    plugins: [],
    resolve: {
      alias: {
        '@assets': `${__dirname}/src/assets`,
        '@components': `${__dirname}/src/components`,
        '@pages': `${__dirname}/src/pages`,
        '@services': `${__dirname}/src/services`,
        '@utils': `${__dirname}/src/utils`,
        '@routes': `${__dirname}/src/routes`,
      }
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {}
      }
    }
  }
}