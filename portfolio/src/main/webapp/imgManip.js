/** 
 * Allow user to select an image for editing. Upon selection,
 * opens that image in the editor. 
 */
window.onload = async () => {
  await onloadPage('imgmanip');

  let elements = document.getElementsByClassName('for-editing');

  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', (e) => {
      document.getElementById('gallery').style.display = 'none';
      document.getElementById('manip').style.display = 'initial';
      inversePaint(e.target.src, e.target.naturalWidth,
                   e.target.naturalHeight);
    });
  }
};