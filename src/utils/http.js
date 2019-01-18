import Cookies from 'js-cookie';
import { Message } from 'element-ui';
// import vueRouter from '@router';

function request(url, params, type) {
  let newUrl = url;
  let options = {
    method: type,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`, // 头部统一加tocken
    },
  };
  if (type === 'post' || type === 'put' || type === 'delete') {
    options = Object.assign(options, {
      body: JSON.stringify(params),
    });
  }
  if (type === 'get') {
    let queryStr = '';
    if (params) {
      queryStr = '?';
      Object.keys(params).forEach((key) => {
        queryStr += `${key}=${params[key]}&`;
      });
      newUrl = (newUrl + queryStr).slice(0, (newUrl + queryStr).length - 1);
    }
  }

  // fetch本身不支持设置请求超时时间
  // 通过Promise.race()比较两个Promise谁先改变状态来达到请求超时的效果
  return Promise.race([
    window.fetch(newUrl, options).then((res) => {
      if (res.ok) {
        return res;
      }
      return Promise.reject(`${res.status}(${res.statusText})`);
    }).catch(error => Promise.reject(String(error))),
    new Promise(((resolve, reject) => {
      setTimeout(() => {
        reject('请求超时');
      }, 20000);
    }))])
    .then(response => response.json())
    .then((data) => {
      if (Number(data.code) === 0) {
        return data.data;
      }
      if (Number(data.code) === 100) {
        const errMsg = '登录超时，请重新登录';
        return Promise.reject(errMsg);
      }
      return Promise.reject(data.message);
    }).catch((error) => {
      Message.error(error);
      return Promise.reject(error);
    });
}

const methods = ['get', 'post', 'put', 'delete'];
const Fetch = {};
methods.forEach((n) => {
  Fetch[n] = (url, params) => request(url, params, n);
});

export default Fetch;
