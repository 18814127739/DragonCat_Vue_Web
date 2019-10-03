const context = require.context('./', false, /\.js$/);
const obj = {};
context.keys().filter(item => item !== './index.js').forEach((key) => {
  Object.keys(context(key).default).forEach((method) => {
    obj[method] = context(key).default[method];
  });
});
export default obj;
