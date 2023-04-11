let tasks = []

loadTasks()
showTasks()

form.onsubmit = () => {
  addTask(form.task.value)
  form.reset()
}

taskList.onchange = e => {
  const { id } = e.target.closest('li').dataset
  const { checked } = e.target

  updateTask(id, checked)
}

taskList.onclick = e => {
  const id = e.target.closest('li')?.dataset.id

  switch (e.target.closest('button')?.className) {
    case 'btn-delete': deleteTask(id)
      break
    case 'btn-setting': editTask(id)
      break
    case 'btn-comment': openTask(id)
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id != id)
  saveTasks()
  showTasks()
}

function editTask(id) {
  const task = tasks.find(t => t.id == id)

  task.text = prompt("Edit text:", task.text) || task.text
  saveTasks()
  showTasks()
}

// my code
function openTask(id) {
  const task = tasks.find(t => t.id == id)

  task.color = getColor()
  saveTasks()
  showTasks()
}

function updateTask(id, done) {
  const task = tasks.find(t => t.id == id)

  task.done = done
  saveTasks()
}

function loadTasks() {
  if (localStorage.tasks) tasks = JSON.parse(localStorage.tasks)
}

function saveTasks() {
  localStorage.tasks = JSON.stringify(tasks)
}

function showTasks() {
  taskList.innerHTML = tasks.map(buildTask).join('')
}

function buildTask({ id, text, done, color }) {
  return `
    <li data-id="${id}">
    <div class="color" style="background-color: ${color}"></div>
    <div class="shorter-wrap">
      <label>
        <input type="checkbox" hidden ${done ? 'checked' : ''}>
        <span>${text}</span>
      </label>
      </div>
      <div class="control">
      <button class="btn-delete"></button>
      <button class="btn-setting"></button>
      <button class="btn-comment"></button>
      </div>
    </li>
  `
}

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, done: false, color: 'grey' })
  saveTasks()
  showTasks()
}


// my code

function getColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}