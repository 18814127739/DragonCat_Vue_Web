module.exports = {
  publicPath: '/',
  configureWebpack: {
    plugins: [],
    resolve: {
      alias: {
        '@assets': `${__dirname}/src/assets`,
        '@components': `${__dirname}/src/components`,
        '@constants': `${__dirname}/src/constants`,
        '@pages': `${__dirname}/src/pages`,
        '@router': `${__dirname}/src/router`,
        '@services': `${__dirname}/src/services`,
        '@utils': `${__dirname}/src/utils`,
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