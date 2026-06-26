let boardData = {
    todo: [],
    progress: [],
    done: []
};

// Function to load tasks from localStorage
function loadTasks() {
    const savedData = localStorage.getItem('kanbanBoardData');
    
    if (savedData) {
        try {
            boardData = JSON.parse(savedData);
        } catch (e) {
            console.error("Failed to parse kanban board data", e);
            // boardData remains as default empty structure
        }
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('kanbanBoardData', JSON.stringify(boardData));
}

// Drag Start: runs when the user STARTS dragging a task
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Allow Drop: prevents default browser behavior so an element can be dropped
function allowDrop(event) {
    event.preventDefault(); 
}

// Drop Task: runs when the user DROPS the task into a new column
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const targetColumnElement = event.target.closest('.column');
    
    if (!targetColumnElement) return; 

    const newColumnId = targetColumnElement.id; 

    moveTask(taskId, newColumnId);
}

// Function to display tasks in their respective columns
function renderTasks() {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('progress-list').innerHTML = '';
    document.getElementById('done-list').innerHTML = '';

    boardData.todo.forEach(task => createTaskCard(task, 'todo-list'));
    boardData.progress.forEach(task => createTaskCard(task, 'progress-list'));
    boardData.done.forEach(task => createTaskCard(task, 'done-list'));
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Helper function to create the HTML for a single task card
function createTaskCard(task, columnId) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = task.id;
    taskCard.draggable = true;
    taskCard.ondragstart = drag; 

    taskCard.innerHTML = `
        <span class="task-text">${escapeHTML(task.title)}</span>
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

// Wait until the HTML is fully loaded before running our initial code
window.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    renderTasks();
});
