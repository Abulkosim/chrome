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

async function handleLogin() {
  const uname = username.value;
  const pwd = password.value;

  if (!username.value || !password.value) {
    state.textContent = 'Please enter your credentials!';
    return;
  }

  // try {
  // const response = await fetch('', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ uname, pwd })
  // });

  // if (response.ok) {
  state.textContent = 'Login successful!';
  startTimer();
  login.disabled = isTimerActive;
  logout.disabled = !isTimerActive;
  // } else {
  //   state.textContent = 'Invalid username or password';
  // }
  // } catch (error) {
  //   console.error('Login error:', error);
  //   state.textContent = 'An error occurred. Please try again.';
  // }
}

async function handleLogout() {
  // try {
  //   const response = await fetch('', {
  //     method: 'POST'
  //   });

  //   if (response.ok) {
  state.textContent = 'Logout successful';
  stopTimer();
  login.disabled = isTimerActive;
  logout.disabled = !isTimerActive;
  //   } else {
  //     state.textContent = 'Logout failed';
  //   }
  // } catch (error) {
  //   console.error('Logout error:', error);
  //   state.textContent = 'An error occurred. Please try again.';
  // }
}

