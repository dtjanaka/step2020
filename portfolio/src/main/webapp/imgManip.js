window.onload = function () {
  let c = document.getElementById("canvas-1");
  let ctx = c.getContext("2d");
  let imgElement = document.createElement("img");
  imgElement.src = "/images/angular.png";
  imgElement.onload = function () {
    ctx.drawImage(imgElement, 0, 0);
  };
  
  document.getElementById("canvas-1").addEventListener("click", function (e) {
    let c = document.getElementById("canvas-1");
    let ctx = c.getContext("2d");
    let id = ctx.getImageData(0, 0, c.width, c.height);
    let pixels = id.data;
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    console.log(x);
    console.log(y);

    // row-major ordering
    let startIndex = y * id.width * 4 + x * 4;
    pixels[startIndex] = 255 - pixels[startIndex];
    pixels[startIndex + 1] = 255 - pixels[startIndex + 1];
    pixels[startIndex + 2] = 255 - pixels[startIndex + 2];
    pixels[startIndex] = 255 - pixels[startIndex];
    pixels[startIndex] = 255 - pixels[startIndex];
    ctx.putImageData(id, 0, 0);
  });
};
