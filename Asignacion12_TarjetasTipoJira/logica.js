'use strict';

const input         = document.getElementById('task-input');
const prioritySelect = document.getElementById('task-priority'); // Nueva referencia
const createBtn     = document.getElementById('create-btn');
const taskList      = document.getElementById('task-list');
const validationMsg = document.getElementById('validation-msg');
const emptyState    = document.getElementById('empty-state');
const taskCount     = document.getElementById('task-count');
const clearDoneBtn  = document.getElementById('clear-done-btn');

const STORAGE_KEY = 'mulan_board_tasks_v3';

let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch {
    tasks = [];
  }
}

// Crear nodo adaptado al formato tarjeta y con soporte de prioridades
function createTaskNode(task) {
  const li = document.createElement('li');
  li.classList.add('task-item', `prio-${task.priority || 'media'}`); // Clase de prioridad
  li.dataset.id = task.id;
  if (task.completed) li.classList.add('completed');

  const check = document.createElement('div');
  check.classList.add('task-check');

  // Pequeño contenedor de texto y etiqueta de la tarjeta
  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.flexDirection = 'column';
  textContainer.style.gap = '4px';
  textContainer.style.flex = '1';

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = task.text;

  // Etiqueta visual de prioridad extra
  const prioTag = document.createElement('span');
  prioTag.classList.add('task-prio-tag');
  prioTag.textContent = task.priority === 'alta' ? '⚔ Alta Prioridad' : task.priority === 'baja' ? '🏮 Baja Prioridad' : '🌸 Media Prioridad';

  textContainer.appendChild(span);
  textContainer.appendChild(prioTag);

  const actions = document.createElement('div');
  actions.classList.add('task-actions');

  const editBtn = document.createElement('button');
  editBtn.classList.add('btn-action', 'edit');
  editBtn.dataset.action = 'edit';
  editBtn.setAttribute('aria-label', 'Editar tarea');
  editBtn.textContent = '✎';

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn-action', 'delete');
  deleteBtn.dataset.action = 'delete';
  deleteBtn.setAttribute('aria-label', 'Eliminar tarea');
  deleteBtn.textContent = '✕';

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(check);
  li.appendChild(textContainer);
  li.appendChild(actions);

  return li;
}

function renderAll() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const node = createTaskNode(task);
    taskList.appendChild(node);
  });
  updateUI();
}

function updateUI() {
  const total = tasks.length;
  taskCount.textContent = total;
  if (total === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

function showError(msg) {
  validationMsg.textContent = msg;
  validationMsg.classList.add('visible');
  input.focus();
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => validationMsg.classList.remove('visible'), 2800);
}

function handleCreate() {
  const text = input.value.trim();
  const priority = prioritySelect.value; // Captura de la funcionalidad extra

  if (!text) {
    showError('El decreto no puede estar vacío.');
    return;
  }
  if (text.length < 2) {
    showError('La orden debe tener al menos 2 caracteres.');
    return;
  }

  const task = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text,
    priority, // Guardado en el estado
    completed: false,
  };

  tasks.push(task);
  saveTasks();

  const node = createTaskNode(task);
  taskList.appendChild(node);

  input.value = '';
  prioritySelect.value = 'media'; // Reinicia a Media por defecto
  validationMsg.classList.remove('visible');
  updateUI();
}

function handleComplete(li) {
  const id = li.dataset.id;
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  li.classList.toggle('completed');
  saveTasks();
}

function handleEdit(li) {
  const id = li.dataset.id;
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt('Modificar decreto real:', task.text);
  if (newText === null) return;
  const trimmed = newText.trim();
  if (!trimmed) {
    alert('El texto no puede estar vacío.');
    return;
  }

  task.text = trimmed;
  saveTasks();

  const span = li.querySelector('.task-text');
  span.textContent = trimmed;
}

function handleDelete(li) {
  const id = li.dataset.id;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();

  li.classList.add('removing');
  li.addEventListener('animationend', () => {
    if (li.parentNode) {
      li.parentNode.removeChild(li);
    }
    updateUI();
  }, { once: true });
}

taskList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('.task-item');
  if (!li) return;

  if (target.classList.contains('task-text') || target.classList.contains('task-check')) {
    handleComplete(li);
    return;
  }

  if (target.dataset.action === 'edit') {
    handleEdit(li);
    return;
  }

  if (target.dataset.action === 'delete') {
    handleDelete(li);
    return;
  }
});

createBtn.addEventListener('click', handleCreate);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleCreate();
});

clearDoneBtn.addEventListener('click', () => {
  const completed = taskList.querySelectorAll('.task-item.completed');
  if (completed.length === 0) return;

  completed.forEach(li => {
    const id = li.dataset.id;
    tasks = tasks.filter(t => t.id !== id);

    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      if (li.parentNode) {
        li.parentNode.removeChild(li);
      }
      updateUI();
    }, { once: true });
  });

  saveTasks();
});

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderAll();
});