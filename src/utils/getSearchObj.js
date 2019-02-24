function getSearchObj(url = window.location.href) {
  const urlArr = url.split('?');
  if (urlArr.length === 1) return {};
  const search = urlArr.pop();
  const objs = search.split('&');
  const obj = {};
  objs.forEach((value) => {
    const [k, v] = value.split('=');
    if (v) {
      obj[k] = v;
    }
  });
  return obj;
}

export default getSearchObj;