// 压缩图像文件
const compressImgs = (files, maxSize = 300, maxWidth = 600, maxHeight = 600) => {
  const arr = files.map(
    file =>
    new Promise(resolve => {
      // 小于300K则直接返回，否则进行压缩
      if (file.size < maxSize * 1024) {
        resolve(file);
        return;
      }
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const reader = new FileReader();
      const img = new Image();

      reader.onload = function () {
        img.src = this.result;
      };

      img.onload = function () {
        // 图片原始宽高
        const originWidth = this.width;
        const originHeight = this.height;
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        // 若原始宽/高超出最大宽/高， 则等比例压缩宽/高
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(
              maxWidth * (originHeight / originWidth)
            );
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(
              maxHeight * (originWidth / originHeight)
            );
          }
        }
        // 用canvas描绘出新的图像
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        const targetImg = canvas.toDataURL(
          file.type || "image/png",
          0.92
        );
        // 将base64转换成file对象
        const targetFile = dataURLtoFile(targetImg, file.name);
        resolve(targetFile);
      };
      // 读取文件内容
      reader.readAsDataURL(file);
    })
  );
  return Promise.all(arr);
};

// 将base64转换为file对象
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
}

export default compressImgs;