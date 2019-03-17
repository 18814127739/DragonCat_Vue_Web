/*
    workbox的5种缓存策略：
    1、Stale While Revalidate: 
    如果请求可用，此策略将使用缓存的响应，并在后台使用来自网络的响应更新缓存。(如果没有缓存，它将等待网络响应并使用它)。
    这是一个相当安全的策略，因为这意味着用户定期更新缓存。这种策略的缺点是，它总是从网络请求资源，耗尽了用户的带宽。
    2、Network First
    这将尝试首先从网络获取一个请求。如果它接收到响应，它将把响应传递给浏览器，并将其保存到缓存中。
    如果网络请求失败，将使用最后一个缓存的响应。
    3、Cache First
    此策略将首先检查缓存是否有响应，如果有可用的响应，则使用该缓存。
    如果请求不在缓存中，则将使用网络，在将任何有效响应传递到浏览器之前，都将添加到缓存中。
    4、Network Only
    强制使用来自网络的响应。
    5、Cache Only
    强制使用来自缓存的响应。
*/

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js');

// 不打印日志
workbox.setConfig({
    debug: false
});

workbox.precaching.precacheAndRoute([]);

// html的缓存策略
workbox.routing.registerRoute(
    // /\.html$/,
    'http://localhost:8083/',
    new workbox.strategies.NetworkFirst({
        cacheName: 'html-cache',
    })
);

workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'js-cache',
    })
);

workbox.routing.registerRoute(
    '/resize.js',
    new workbox.strategies.CacheFirst({
        cacheName: 'js-cache',
    })
);

workbox.routing.registerRoute(
    /\.css$/,
    // Use cache but update in the background.
    new workbox.strategies.NetworkFirst({
        // Use a custom cache name.
        cacheName: 'css-cache',
    })
);

// 通过回调函数来匹配请求路由将会让策略更加灵活,匹配本地图片资源路径
const matchLocalImgsFunction = ({
    url,
}) => {
    // 如果请求路由匹配了就返回 true，也可以返回一个参数对象以供 handler 接收处理
    if (/^\/img\/.*\.(?:png|jpg|jpeg|svg|gif)$/.test(url.pathname)) {
        return true;
    }
    return false;
};

workbox.routing.registerRoute(
    matchLocalImgsFunction,
    new workbox.strategies.CacheFirst({
        cacheName: 'local-image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 20 images.
                maxEntries: 20, // indexDB中cache-entries的缓存最大数量
                // Cache for a maximum of a week.
                maxAgeSeconds: 30 * 24 * 60 * 60,
            })
        ],
    })
);

// 匹配服务器上的图片资源路径
const matchServerImgsFunction = ({
    url,
}) => {
    if (/^\/static\/.*\.(?:png|jpg|jpeg|svg|gif)$/.test(url.pathname)) {
        return true;
    }
    return false;
};

workbox.routing.registerRoute(
    matchServerImgsFunction,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'server-image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 150,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            })
        ],
    })
);

workbox.routing.registerRoute(
    // Cache api request files.
    /\/api\//,
    new workbox.strategies.NetworkFirst({
        // Use a custom cache name.
        cacheName: 'api-cache',
    })
);