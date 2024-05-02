const username = document.getElementById('username');
const password = document.getElementById('password');
const invisible = document.getElementById('invisible');
const visible = document.getElementById('visible');
const state = document.getElementById('state');

const login = document.querySelector('.login');
const logout = document.querySelector('.logout');

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

username.value = localStorage.getItem('username')
password.value = localStorage.getItem('password')
state.textContent = localStorage.getItem('state')

login.addEventListener('click', handleLogin);
logout.addEventListener('click', handleLogout);

async function authenticate(username, password) {
  const timestamp = new Date().getTime()
  const payload = `username=${username}&pwd=${password}&password=${password}&mp_idx=${timestamp}&pwd_r=`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch('https://10.20.10.1:8843/', {
      method: 'POST',
      headers: headers,
      body: payload,
      credentials: 'include',
      mode: 'no-cors'
    });
    return true
  } catch (error) {
    console.error("Authentication Error:", error);
    return false;
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const uname = username.value;
  const pwd = password.value;

  if (!username.value || !password.value) {
    state.textContent = 'Please enter your credentials!';
    return;
  }
  let result = await authenticate(uname, pwd)
  if (result) {
    console.log('Logged in successfully!', result)
    state.textContent = 'Logged in successfully!'
  } else {
    console.log('Login failed!', result)
    state.textContent = 'Login failed!'
  }

  localStorage.setItem('username', uname)
  localStorage.setItem('password', pwd)
  localStorage.setItem('state', state.textContent)
}


async function signout() {
  const payload = 'perform=logout&mp_idx=0';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  try {
    const response = await fetch('https://10.20.10.1:8843/setuser.cgi', {
      method: 'POST',
      body: payload,
      headers: headers,
      mode: 'no-cors'
    });
    const data = await response.text();
    const contentLength = data.length;

    return contentLength < 200
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
}

async function handleLogout() {
  let result = await signout();
  if (result) {
    state.textContent = 'Logged out successfully!'
  } else {
    state.textContent = 'Logout failed!'
  }
  localStorage.setItem('state', state.textContent)
}