const password = document.getElementById('password');
const invisible = document.getElementById('invisible');
const visible = document.getElementById('visible');

invisible.addEventListener('click', () => {
  password.type = 'text';
  invisible.style.display = 'none';
  visible.style.display = 'block';
});

visible.addEventListener('click', () => {
  password.type = 'password';
  visible.style.display = 'none';
  invisible.style.display = 'block';
});