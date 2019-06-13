const {
  GenerateSW
} = require('workbox-webpack-plugin');

// 匹配本地图片资源路径
// const matchLocalImgsFunction = ({
//   url,
// }) => {
//   if (/^\/img\/.*\.(?:png|jpg|jpeg|svg|gif)$/.test(url.pathname)) {
//     return true;
//   }
//   return false;
// };

// 匹配服务器上的图片资源路径
const matchServerImgsFunction = ({
  url,
}) => {
  if (/^\/static\/.*\.(?:png|jpg|jpeg|svg|gif)$/.test(url.pathname)) {
    return true;
  }
  return false;
};

module.exports = {
  configureWebpack: {
    plugins: [
      new GenerateSW({
        cacheId: 'webpack-pwa', // 设置前缀
        skipWaiting: true, // 强制等待中的 Service Worker 被激活
        clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
        swDest: `${__dirname}/dist/service-worker.js`, // 输出 Service worker 文件
        runtimeCaching: [
          // 插件打包后会生成precache-manifest文件，存放了打包后的姿态资源列表
          // 然后通过workbox.precaching.precacheAndRoute(self.__precacheManifest, {});缓存起来
          // 因此不需要额外处理

          // {
          //   urlPattern: 'http:locahost:8083/',
          //   handler: 'NetworkFirst',
          //   options: {
          //     networkTimeoutSeconds: 5, // NetworkFirst缓存策略下设置超时时长
          //     cacheName: 'html-cache',
          //     cacheableResponse: {
          //       statuses: [0, 200]
          //     }
          //   }
          // }, {
          //   urlPattern: /\.js$/,
          //   handler: 'CacheFirst',
          //   options: {
          //     cacheName: 'js-cache',
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   }
          // }, {
          //   urlPattern: /\.css$/,
          //   handler: 'CacheFirst',
          //   options: {
          //     cacheName: 'css-cache',
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   }
          // }, 
          // {
          //   urlPattern: matchLocalImgsFunction,
          //   handler: 'StaleWhileRevalidate',
          //   options: {
          //     cacheName: 'local-image-cache',
          //     expiration: {
          //       maxEntries: 50, // 最大缓存数
          //       maxAgeSeconds: 7 * 24 * 60 * 60, // 最大缓存时间
          //     },
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   }
          // }, 
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 8,
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }, {
            urlPattern: matchServerImgsFunction,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'server-image-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            }
          }
        ]
      }),
    ],
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
    externals: {
      echarts: 'echarts',
    },
  },
  productionSourceMap: false, // 生产环境不生成source-map
  devServer: {
    // https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        secure: false,
        changeOrigin: true,
      },
    }
  }
}