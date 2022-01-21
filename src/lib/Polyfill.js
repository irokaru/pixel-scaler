if (!('createImageBitmap' in window)) {
  window.createImageBitmap = async function(blob) {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.addEventListener('load', function() {
        resolve(this);
      });
      img.src = URL.createObjectURL(blob);
    });
  }
}
