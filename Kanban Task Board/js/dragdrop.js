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
