let tasks = []

loadTasks()
showTasks()
countTask()

function countTask() {
  const doneTasks = tasks.filter(task => task.done)
  const doTasks = tasks.filter(task => !task.done)

  doneText.innerHTML = `${doneTasks.length}`
  doText.innerHTML = `${doTasks.length}`
}

form.onsubmit = () => {
  addTask(form.task.value)
  form.reset()
}

doneSortBtn.onclick = sortDoneLast
dateSortBtn.onclick = sortNewFirst
colorSortBtn.onclick = sortByColor

taskList.onchange = e => {
  const { id } = e.target.closest('li').dataset
  const { checked } = e.target

  updateTask(id, checked)
  countTask()
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
  confirmWindow.style.display = 'flex'

  deleteYes.onclick = function () {
    confirmWindow.style.display = 'none'
    tasks = tasks.filter(t => t.id != id)
    saveTasks()
    showTasks()
    countTask()
  }

  deleteNo.onclick = function () {
    confirmWindow.style.display = 'none'
  }
}


// не работает этот код, спросить почему
// function deleteTask(id) {
//   confirmWindow.style.display= 'block'

//   let agree = false

//   deleteYes.onclick = function(){
//     agree = true
//     console.log(agree);
//     confirmWindow.style.display= 'none'
//   }

//   deleteNo.onclick = function(){
//     agree = false
//     console.log(agree);
//     confirmWindow.style.display= 'none'
//   }

//   if (!agree) return

//   tasks = tasks.filter(t => t.id != id)
//   saveTasks()
//   showTasks()
//   countTask()
// }

// function deleteTask(id) {
//   const agree = confirm('Are you sure?')

//   if (!agree) return

//   tasks = tasks.filter(t => t.id != id)
//   saveTasks()
//   showTasks()
//   countTask()
// }

function editTask(id) {
  const task = tasks.find(t => t.id == id)

  task.text = prompt("Edit text:", task.text) || task.text
  saveTasks()
  showTasks()
}

function openTask(id) {
  const task = tasks.find(t => t.id == id)

  task.color = getColor(task.color)
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
  text = text.trim()

  if (!text) return

  tasks.unshift({ id: Date.now(), text, done: false, color: 'hsl(180, 80%, 50%);' })
  saveTasks()
  showTasks()
  countTask()
}

function sortDoneLast() {
  tasks.sort((a, b) => {
    if (a.done && !b.done) return 1
    if (b.done && !a.done) return -1
    return 0
  })

  saveTasks()
  showTasks()
}

function sortNewFirst() {
  //сложная запись
  // tasks.sort((a,b) => {
  //   if (a.id > b.id) return -1
  //   if (a.id < b.id) return 1
  // })

  // упрощенная запись
  tasks.sort((a, b) => b.id - a.id)

  saveTasks()
  showTasks()
}

function sortByColor() {
  tasks.sort((a, b) => a.color.localeCompare(b.color));

  saveTasks()
  showTasks()
}

function getColor(colorOfTask) {
  let hueArray = [30, 60, 120, 180, 210, 240, 270, 300, 330]

  // из формата hsl(95, 80%, 50%) мы достаем первые 2 цифры и преобразуем их в число с помощью регулярного выражения
  const currentHue = parseInt(colorOfTask.match(/\d+(?=,)/)[0]);

  // создаем переменную в которой будем хранить индекс цвета взятый из массива цветов
  let currentIndex
  for (let i = 0; i < hueArray.length; i++) {
    if (hueArray[i] === currentHue) {
      currentIndex = i
      break
    }
  }
  console.log(hueArray.length);

  // зацикливаем индекс массива hueArray от 0 до 8(в данном случае)
  let newIndex = currentIndex + 1
  if (newIndex == hueArray.length) newIndex = 0
  // создаем переменную в которой будет хранится одно из значений массива, эту переменную присваеваем переменной color
  const newColor = hueArray[newIndex];

  let color = `hsl(${newColor}, 100%, 50%)`

  return color
}


