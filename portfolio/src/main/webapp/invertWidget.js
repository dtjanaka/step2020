/**
 * Load an image on a canvas and allow user to invert pixels with
 * variable size brush.
 */
function inversePaint(src, w, h) {
  let c = document.getElementById('canvas-1');
  c.width = w;
  c.height = h;
  let ctx = c.getContext('2d');
  let imgElement = document.createElement('img');
  imgElement.src = src;
  imgElement.onload = function() { ctx.drawImage(imgElement, 0, 0); };

  let isMoving = false;
  let x = 0;
  let y = 0;
  let id = ctx.getImageData(0, 0, c.width, c.height);
  let prevInv = Array(id.width * id.height).fill(0);

  function invertLocally() {
    id = ctx.getImageData(0, 0, c.width, c.height);
    let pixels = id.data;
    let brushSizeInput = document.getElementById('brush-size');
    let side = Math.max(Math.min(+brushSizeInput.value, +brushSizeInput.max), 
                        +brushSizeInput.min);
    let toInvert = squarePixels(x, y, side, c.width, c.height);
    for (let point = 0; point < toInvert.length; point++) {
      if (prevInv[toInvert[point].y * id.width + toInvert[point].x] === 0) {
        // row-major ordering
        let startIndex =
            toInvert[point].y * id.width * 4 + toInvert[point].x * 4;
        pixels[startIndex] = 255 - pixels[startIndex];
        pixels[startIndex + 1] = 255 - pixels[startIndex + 1];
        pixels[startIndex + 2] = 255 - pixels[startIndex + 2];
        prevInv[toInvert[point].y * id.width + toInvert[point].x] = 1;
      }
    }
    ctx.putImageData(id, 0, 0);
  }

  c.addEventListener('mousedown', (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    x = Math.floor(e.clientX - rect.left);
    y = Math.floor(e.clientY - rect.top);
    isMoving = true;
  });

  c.addEventListener('mousemove', (e) => {
    if (isMoving === true) {
      invertLocally();
      let rect = e.currentTarget.getBoundingClientRect();
      x = Math.floor(e.clientX - rect.left);
      y = Math.floor(e.clientY - rect.top);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isMoving === true) {
      invertLocally();
      isMoving = false;
    }
  });
}

function squarePixels(x, y, s, w, h) {
  let toInvert = [];
  let leftX = x - Math.floor(s / 2);
  let topY = y - Math.floor(s / 2);
  for (let i = leftX; i < leftX + s; i++) {
    for (let j = topY; j < topY + s; j++) {
      if (i >= 0 && i < w && j >= 0 && j < h) {
        toInvert.push({x : i, y : j});
      }
    }
  }
  return toInvert;
}