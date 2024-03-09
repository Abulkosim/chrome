const username = document.getElementById('username');
const password = document.getElementById('password');
const invisible = document.getElementById('invisible');
const visible = document.getElementById('visible');
const timer = document.getElementById('timer');
const state = document.getElementById('state');

const login = document.querySelector('.login');
const logout = document.querySelector('.logout');

let deadline;
let isTimerActive = false;
let timerId;

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

function updateTimer() {
  const now = new Date().getTime();
  const timeLeft = deadline - now;

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (timeLeft < 0) {
    clearInterval(timerId);
    isTimerActive = false;
    handleLogout();
  }
}

function startTimer() {
  deadline = new Date(Date.now() + 4 * 60 * 60 * 1000);
  isTimerActive = true;
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timer.textContent = '00:00:00';
  isTimerActive = false;
}

login.addEventListener('click', handleLogin);
logout.addEventListener('click', handleLogout);

async function authenticate(username, password) {
  const payload = `username=${username}&pwd=${password}&password=${password}&mp_idx=0&pwd_r=`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'authtok=rm9NU7M-zG3u8fDBiGJLldZ1l-XBGUcH4vyHVZXSLVAVTqcFdYRCMgqPB9cQISl+'
  };

  try {
    const response = await fetch('https://10.20.10.1:8843/', {
      method: 'POST',
      body: payload,
      headers: headers,
    });

    const data = await response.text();
    const contentLength = data.length;
    const isSuccessful = (800 < contentLength && contentLength < 900);
    return isSuccessful;
  } catch (error) {
    console.error("Authentication Error:", error);
    return false;
  }
}

async function handleLogin() {
  const uname = username.value;
  const pwd = password.value;

  if (!username.value || !password.value) {
    state.textContent = 'Please enter your credentials!';
    return;
  }

  // const isSignedIn = await authenticate(uname, pwd);

  // if (isSignedIn) {
  //   state.textContent = 'Login successful!';
  //   startTimer();
  //   login.disabled = isTimerActive;
  //   logout.disabled = !isTimerActive;
  // } else {
  //   state.textContent = 'Login failed!';
  // }

  authenticate(uname, pwd)
    .then(isSignedIn => {
      if (isSignedIn) {
        state.textContent = 'Login successful!';
        startTimer();
        console.log('isTimerActive:', isTimerActive)
        login.disabled = isTimerActive;
        logout.disabled = !isTimerActive;
      } else {
        state.textContent = 'Login failed!';
      }
    })
    .catch(error => {
      console.error("Authentication Error:", error);
      state.textContent = 'An error occurred. Please try again';
    });
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
    });

    const data = await response.text();
    const contentLength = data.length;
    return contentLength < 200;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
}

async function handleLogout() {
  const isSignedOut = await signout();

  if (isSignedOut) {
    state.textContent = 'Logout successful';
    stopTimer();
    login.disabled = isTimerActive;
    logout.disabled = !isTimerActive;
  } else {
    state.textContent = 'Logout failed';
  }
}