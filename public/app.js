// TaskFlow frontend — talks to the Express API in ../routes
const API = '/api';
let token = localStorage.getItem('taskflow_token') || null;
let mode = 'login'; // or 'register'

const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ---------- Auth ----------

$('switchMode').addEventListener('click', (e) => {
  e.preventDefault();
  mode = mode === 'login' ? 'register' : 'login';
  $('authTitle').textContent = mode === 'login' ? 'Log in' : 'Create an account';
  $('authSubmit').textContent = mode === 'login' ? 'Log in' : 'Sign up';
  $('nameField').classList.toggle('hidden', mode === 'login');
  $('switchText').textContent = mode === 'login' ? 'New to TaskFlow?' : 'Already have an account?';
  $('switchMode').textContent = mode === 'login' ? 'Create an account' : 'Log in';
  $('authError').classList.add('hidden');
});

$('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('emailInput').value.trim();
  const password = $('passwordInput').value;
  const body = { email, password };
  if (mode === 'register') body.name = $('nameInput').value.trim();

  try {
    const data = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
    token = data.token;
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_name', data.user.name);
    showBoard();
  } catch (err) {
    $('authError').textContent = err.message;
    $('authError').classList.remove('hidden');
  }
});

$('logoutBtn').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('taskflow_token');
  localStorage.removeItem('taskflow_name');
  $('boardView').classList.add('hidden');
  $('userBar').classList.add('hidden');
  $('authView').classList.remove('hidden');
});

// ---------- Tasks ----------

async function loadTasks() {
  const { tasks } = await api('/tasks');
  for (const status of ['todo', 'in-progress', 'done']) {
    $(`col-${status}`).innerHTML = '';
  }
  for (const task of tasks) {
    $(`col-${task.status}`).appendChild(taskCard(task));
  }
}

function taskCard(task) {
  const el = document.createElement('div');
  el.className = `task priority-${task.priority}`;

  const title = document.createElement('p');
  title.className = 'title';
  title.textContent = task.title;

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = task.dueDate
    ? `${task.priority} · due ${new Date(task.dueDate).toLocaleDateString()}`
    : task.priority;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const nextStatus = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
  const moveBtn = document.createElement('button');
  moveBtn.textContent = task.status === 'done' ? 'Reopen' : 'Move →';
  moveBtn.addEventListener('click', async () => {
    await api(`/tasks/${task._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus[task.status] }),
    });
    loadTasks();
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', async () => {
    await api(`/tasks/${task._id}`, { method: 'DELETE' });
    loadTasks();
  });

  actions.append(moveBtn, delBtn);
  el.append(title, meta, actions);
  return el;
}

$('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await api('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: $('titleInput').value.trim(),
      priority: $('priorityInput').value,
      dueDate: $('dueInput').value || null,
    }),
  });
  $('titleInput').value = '';
  $('dueInput').value = '';
  loadTasks();
});

// ---------- Boot ----------

function showBoard() {
  $('authView').classList.add('hidden');
  $('boardView').classList.remove('hidden');
  $('userBar').classList.remove('hidden');
  $('userName').textContent = localStorage.getItem('taskflow_name') || '';
  loadTasks();
}

if (token) showBoard();
