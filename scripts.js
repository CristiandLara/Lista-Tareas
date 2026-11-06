document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (event) => {
        if (!window.confirm(form.dataset.confirm)) {
            event.preventDefault();
        }
    });
});

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

if (taskInput && taskList) {
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Por favor, escribe una tarea antes de agregar.');
            return;
        }

        const item = document.createElement('li');
        item.appendChild(document.createTextNode(taskText));

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.classList.add('btn-delete');
        deleteButton.addEventListener('click', () => item.remove());

        item.appendChild(deleteButton);
        taskList.appendChild(item);
        taskInput.value = '';
        taskInput.focus();
    };

    document.querySelector('.btn-add')?.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
}
