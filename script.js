const password = document.getElementById('password');
const toggler = document.getElementById('toggler');

toggler.addEventListener('click', () => {
  if (password.type === 'password') {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});