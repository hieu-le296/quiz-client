const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById('addBtn');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block';

  btn.style.zIndex = -1;
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
  btn.style.zIndex = 4;
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    btn.style.zIndex = 4;
  }
};
