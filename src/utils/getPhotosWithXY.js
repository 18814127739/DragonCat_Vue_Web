// 计算照片墙中每张照片的位置
function getPhotosWithXY(photos) {
  const num = photos.length;
  let offsetX = 2; // X轴上的偏移(往右)
  let offsetY = 1; // Y轴上的偏移(往下)
  let rowNum = 16; // 每行显示多少张照片

  if (0 < num && num <= 4) {
    offsetX = 9;
    offsetY = 4;
    rowNum = 2;
  } else if (num <= 12) {
    offsetX = 8;
    offsetY = 3;
    rowNum = 4;
  } else if (num <= 24) {
    offsetX = 6;
    offsetY = 2;
    rowNum = 8;
  } else if (num <= 48) {
    offsetX = 6;
    offsetY = 2;
    rowNum = 8;
  } else if (num <= 70) {
    offsetX = 4;
    offsetY = 2;
    rowNum = 12;
  } else if (num <= 96) {
    offsetX = 3;
    offsetY = 1;
    rowNum = 14;
  } else if (num <= 144) {
    offsetX = 2;
    offsetY = 1;
    rowNum = 16;
  }

  return photos.map((item, index) => ({
    ...item,
    x: getX(index, offsetX, rowNum),
    y: getY(index, offsetY, rowNum)
  }));
}

function getX(index, offsetX, rowNum) {
  return index % rowNum + offsetX;
}

function getY(index, offsetY, rowNum) {
  return parseInt(offsetY + index / rowNum);
}

export default getPhotosWithXY;