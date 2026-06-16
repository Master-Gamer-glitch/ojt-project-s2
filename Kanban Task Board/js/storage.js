let boardData = {
    todo: [],
    progress: [],
    done: []
};

// Function to load tasks from localStorage
function loadTasks() {
    const savedData = localStorage.getItem('kanbanBoardData');
    
    if (savedData) {
        boardData = JSON.parse(savedData);
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('kanbanBoardData', JSON.stringify(boardData));
}
