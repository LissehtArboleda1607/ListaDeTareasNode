const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let tasks = [];

function loadTasks() {
    try {
        const data = fs.readFileSync('tasks.json', 'utf8');
        tasks = JSON.parse(data);
    } catch (err) {
        tasks = [];
    }
}

function saveTasks() {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

function addTask(description) {
    tasks.push({ id: tasks.length + 1, description, completed: false });
    console.log(chalk.green('Tarea añadida con éxito.'));
    saveTasks();
}

function removeTask(id) {
    if (!Number.isInteger(id) || id < 1 || id > tasks.length) {
        console.log(chalk.red('Error: ID de tarea inválido.'));
        return;
    }
    tasks = tasks.filter(task => task.id !== id);
    console.log(chalk.green('Tarea eliminada con éxito.'));
    saveTasks();
}

function completeTask(id) {
    if (!Number.isInteger(id) || id < 1 || id > tasks.length) {
        console.log(chalk.red('Error: ID de tarea inválido.'));
        return;
    }
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: true };
        }
        return task;
    });
    console.log(chalk.green('Tarea completada con éxito.'));
    saveTasks();
}

function showTasks() {
    if (tasks.length === 0) {
        console.log(chalk.yellow('No hay tareas en la lista.'));
    } else {
        tasks.forEach(task => {
            const status = task.completed ? chalk.green('Completada') : chalk.red('Pendiente');
            console.log(`Tarea ${task.id}: ${task.description} - ${status}`);
        });
    }
}

function closeReadline() {
    rl.close();
}

function main() {
    rl.question('Ingrese una opción (add, remove, complete, show, exit): ', answer => {
        switch (answer.trim()) {
            case 'add':
                rl.question('Descripción de la nueva tarea: ', description => {
                    addTask(description);
                    main();
                });
                break;
            case 'remove':
                rl.question('ID de la tarea a eliminar: ', id => {
                    removeTask(parseInt(id));
                    main();
                });
                break;
            case 'complete':
                rl.question('ID de la tarea a completar: ', id => {
                    completeTask(parseInt(id));
                    main();
                });
                break;
            case 'show':
                showTasks();
                main();
                break;
            case 'exit':
                closeReadline();
                break;
            default:
                console.log(chalk.yellow('Opción no reconocida.'));
                main();
                break;
        }
    });
}

loadTasks();
main();