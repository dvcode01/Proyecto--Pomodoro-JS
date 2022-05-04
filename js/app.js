(function() {
    // variables generales
    const tareas = [];
    let tiempo = 0;
    let temporizador = null;
    let temporizadorBreak = null;
    let actual = 0;

    // variables de elementos
    const btnAdd = document.querySelector('.btn-add');
    const taskElement = document.querySelector('.itTask');
    const formElement = document.querySelector('#form');
    const taskName = document.querySelector('.time .task-name');
    const tasksContainer = document.querySelector('.tasks');

    renderTarea();
    renderTiempo();
    EventListeners();

    function EventListeners(){
        formElement.addEventListener('submit', initApp);  
    }

    function initApp(e){
        e.preventDefault();
        if (taskElement.value !== '') {
            crearTarea(taskElement.value);
            taskElement.value = '';
            renderTarea();
        }
    }

    function crearTarea(value){
        const nuevaTarea = {
            id: (Math.random() * 100).toString(36).slice(3),
            title: value,
            completed: false
        }
        
        tareas.unshift(nuevaTarea);
    }
    
    function renderTarea() {
        const html = tareas.map(tarea => {
            return `
            <div class="task">
                <div class="completed">${tarea.completed ? `<span class="done">Terminado</span>` : `<button class="start-button" data-id="${tarea.id}">Comenzar</button>`}</div>
                <div class="title">${tarea.title}</div>
            </div>
            `;
        });

        tasksContainer.innerHTML = html.join('');
        const startButtons = document.querySelectorAll('.task .start-button');

        startButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!temporizador) {
                    const id = button.getAttribute('data-id');
                    botonControlador(id);
                    button.textContent = 'En proceso...';
                }
            })
        })
    }

    function botonControlador(id){
        tiempo = 25 * 60;
        actual = id;
        const tareaIndice = tareas.findIndex(tarea => tarea.id === id);
        taskName.textContent = tareas[tareaIndice].title;
        renderTiempo();

        temporizador = setInterval(() => {
            tiempoControlador(id);
        }, 1000);
    }

    function tiempoControlador(id){
        tiempo--;
        renderTiempo();

        if (tiempo === 0) {
            clearInterval(temporizador);
            tareaCompletada(id);
            temporizador = null;
            renderTarea();
            comenzarDescanso();
        }
    }

    function comenzarDescanso(){
        tiempo = 5 * 60;
        taskName.textContent = 'Descanso';
        renderTiempo();

        temporizadorBreak = setInterval(() => {
            descansoControlador();
        }, 1000);
    }

    function descansoControlador(){
        tiempo--;
        renderTiempo();

        if (tiempo === 0) {
            clearInterval(temporizadorBreak);
            actual = null;
            temporizadorBreak = null;
            taskName.textContent = '';
            renderTarea();
        }
    }

    function renderTiempo(){
        const timeDiv= document.querySelector('.time .value');
        const minutos = parseInt(tiempo / 60);
        const segundos = parseInt(tiempo % 60);

        timeDiv.textContent = `${minutos < 10 ? '0' : ''}${minutos}: ${segundos < 10 ? '0' : ''}${segundos}`;
    }

    function tareaCompletada(id){
        const tareaIndice = tareas.findIndex(tarea => tarea.id === id);
        tareas[tareaIndice].completed = true;
    }
})();