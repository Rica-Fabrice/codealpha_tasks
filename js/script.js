const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskCounter = document.getElementById("taskCounter");
const clearTasks = document.getElementById("clearTasks");
const confirmDialog = document.getElementById("confirmDialog");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const errorMessage = document.getElementById("errorMessage");
const deleteTaskDialog = document.getElementById("deleteTaskDialog");
const confirmDeleteYes = document.getElementById("confirmDeleteYes");
const confirmDeleteNo = document.getElementById("confirmDeleteNo");
let taskToDeleteIndex = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => 
        currentFilter === "completed" ? task.completed :
        currentFilter === "pending" ? !task.completed : true
    );

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
            <div class="task-content">
                <span class='priority-${task.priority}'>⬤</span>
                <span class="task-text" onclick="toggleTask(${index})">
                    ${task.text} (Due: ${task.date})
                </span>
                <button onclick="showDeleteTaskDialog(${index})" class="delete-btn">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    taskCounter.textContent = `Tasks: ${tasks.length}`;
    saveTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskPriorityValue = taskPriority.value;

    if (!taskText || !taskDateValue) {
        errorMessage.textContent = "Please fill in both the task and date fields.";
        errorMessage.style.display = "block";
        return;
    }
    errorMessage.style.display = "none";

    tasks.push({ text: taskText, date: taskDateValue, priority: taskPriorityValue, completed: false });
    taskInput.value = "";
    taskDate.value = "";
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function showDeleteTaskDialog(index) {
    taskToDeleteIndex = index;
    deleteTaskDialog.style.display = "flex";
}

function hideDeleteTaskDialog() {
    deleteTaskDialog.style.display = "none";
}

function deleteTask() {
    if (taskToDeleteIndex !== null) {
        tasks.splice(taskToDeleteIndex, 1);
        taskToDeleteIndex = null;
        renderTasks();
    }
    hideDeleteTaskDialog();
}

function clearAllTasks() {
    tasks = [];
    renderTasks();
    confirmDialog.style.display = "none";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function applyFilter(button) {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
confirmDeleteYes.addEventListener("click", deleteTask);
confirmDeleteNo.addEventListener("click", hideDeleteTaskDialog);
clearTasks.addEventListener("click", () => confirmDialog.style.display = "flex");
confirmYes.addEventListener("click", clearAllTasks);
confirmNo.addEventListener("click", () => confirmDialog.style.display = "none");
themeToggle.addEventListener("click", toggleTheme);
filterButtons.forEach(button => button.addEventListener("click", () => applyFilter(button)));

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

renderTasks();
