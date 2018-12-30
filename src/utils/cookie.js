function getsec(str) {
  if (!str) return 24 * 60 * 60 * 1000;
  const str1 = str.substring(1, str.length) * 1;
  const str2 = str.substring(0, 1);
  if (str2 === 's') {
    return str1 * 1000;
  }
  if (str2 === 'h') {
    return str1 * 60 * 60 * 1000;
  }
  if (str2 === 'd') {
    return str1 * 24 * 60 * 60 * 1000;
  }
  // 默认1天
  return 24 * 60 * 60 * 1000;
}

function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
}

function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
  }
}

function setCookie(name, value, time) {
  const strsec = getsec(time);
  const exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
}

export { getCookie, delCookie, setCookie };
