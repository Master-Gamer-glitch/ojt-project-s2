// Function to display tasks in their respective columns
function renderTasks() {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('progress-list').innerHTML = '';
    document.getElementById('done-list').innerHTML = '';

    boardData.todo.forEach(task => createTaskCard(task, 'todo-list'));
    boardData.progress.forEach(task => createTaskCard(task, 'progress-list'));
    boardData.done.forEach(task => createTaskCard(task, 'done-list'));
}

// Helper function to create the HTML for a single task card
function createTaskCard(task, columnId) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = task.id;
    taskCard.draggable = true;
    taskCard.ondragstart = drag; // Refers to 'drag' in dragdrop.js

    taskCard.innerHTML = `
        <span class="task-text">${task.title}</span>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
            <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;

    document.getElementById(columnId).appendChild(taskCard);
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskTitle = taskInput.value.trim();

    if (taskTitle === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: 'task-' + Date.now(),
        title: taskTitle
    };

    boardData.todo.push(newTask);
    taskInput.value = '';

    saveTasks();
    renderTasks();
}

// Function to edit an existing task
function editTask(taskId) {
    let taskToEdit = null;

    for (let column in boardData) {
        let foundTask = boardData[column].find(t => t.id === taskId);
        if (foundTask) {
            taskToEdit = foundTask;
            break;
        }
    }

    // Ask the user for a new title using a prompt
    if (taskToEdit) {
        const newTitle = prompt('Edit task:', taskToEdit.title);
        
        if (newTitle !== null && newTitle.trim() !== '') {
            taskToEdit.title = newTitle.trim();
            saveTasks();
            renderTasks();
        }
    }
}

// Function to delete a task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return; 
    }

    boardData.todo = boardData.todo.filter(t => t.id !== taskId);
    boardData.progress = boardData.progress.filter(t => t.id !== taskId);
    boardData.done = boardData.done.filter(t => t.id !== taskId);

    saveTasks();
    renderTasks();
}

// Function to logically move the task after a drag-and-drop
function moveTask(taskId, newColumnId) {
    let taskToMove = null;

    for (let column in boardData) {
        const index = boardData[column].findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            taskToMove = boardData[column].splice(index, 1)[0];
            break;
        }
    }

    if (taskToMove && (newColumnId === 'todo' || newColumnId === 'progress' || newColumnId === 'done')) {
        boardData[newColumnId].push(taskToMove);
    }

    saveTasks();
    renderTasks();
}
