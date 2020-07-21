window.onload = function () {
  let c = document.getElementById('canvas-1');
  let ctx = c.getContext('2d');
  let imgElement = document.createElement('img');
  imgElement.src = '/images/angular.png';
  imgElement.onload = function () {
    ctx.drawImage(imgElement, 0, 0);
  };

  let isMoving = false;
  let x = 0;
  let y = 0;
  let toInvert = [];

  c.addEventListener('mousedown', (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    isMoving = true;
  });

  c.addEventListener('mousemove', (e) => {
    if (isMoving === true) {
      toInvert.push({ x: x, y: y });
      let rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (isMoving === true) {
      let id = ctx.getImageData(0, 0, c.width, c.height);
      let pixels = id.data;
      for (let point = 0; point < toInvert.length; point++) {
        // row-major ordering
        let startIndex =
          toInvert[point].y * id.width * 4 + toInvert[point].x * 4;
        pixels[startIndex] = 255 - pixels[startIndex];
        pixels[startIndex + 1] = 255 - pixels[startIndex + 1];
        pixels[startIndex + 2] = 255 - pixels[startIndex + 2];
      }
      ctx.putImageData(id, 0, 0);
      x = 0;
      y = 0;
      isMoving = false;
      toInvert = [];
    }
  });
};
