let previewMenu = document.querySelector('.menu-preview');
let previewBox = previewMenu.querySelectorAll('.preview');

document.querySelectorAll('.menu-container .menu').forEach(product =>{
  product.onclick = () =>{
    previewMenu.style.display = 'flex';
    let name = product.getAttribute('data-name');
    previewBox.forEach(preview =>{
      let target = preview.getAttribute('data-target');
      if(name == target){
        preview.classList.add('active');
      }
    });
  };
});

previewBox.forEach(close =>{
  close.querySelector('.close-button').onclick = () =>{
    close.classList.remove('active');
    previewMenu.style.display = 'none';
  };
});