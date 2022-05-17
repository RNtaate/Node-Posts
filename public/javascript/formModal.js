console.log("You are now accessing the form Modal javascript file");

let editPic = document.querySelector('.profile-img-edit-span');
let formModal = document.querySelector('.profile-picture-form-section');
let formModalCloseBtn = document.querySelector('span.position-absolute.bottom-100')

formModal.addEventListener('click', (e) => {
  if(e.target !== e.currentTarget) return
  formModal.classList.remove('d-flex');
  formModal.classList.add('d-none');
})

editPic.addEventListener('click', () => {
  formModal.classList.remove('d-none');
  formModal.classList.add('d-flex');
})

formModalCloseBtn.addEventListener('click', () => {
  formModal.classList.remove('d-flex');
  formModal.classList.add('d-none');
})