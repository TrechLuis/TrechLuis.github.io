let menuVisible = false;

// Función que oculta o muestra el menú
function mostrarOcultarMenu() {
    if (menuVisible) {
        document.getElementById("nav").classList = "";
        menuVisible = false;
    } else {
        document.getElementById("nav").classList = "responsive";
        menuVisible = true;
    }
}

// Detectar el scrolling para aplicar la animación de la barra de habilidades
window.onscroll = function () {
    efectoHabilidades();
}

/*
// Desplazar la página suavemente a la sección de contacto
document.getElementById('btnEnviarMensaje').addEventListener('click', function () {
    document.getElementById('contacto').scrollIntoView({
        behavior: 'smooth'
    });
});*/

// Manejo del formulario de contacto (envío de datos)
let tasks = []; // crea un array vacio (listas)

const form = document.querySelector(".form_task"); // Formulario
const taskInput = document.querySelector("#taskInput"); // Input
const taskList = document.querySelector("#taskList"); // Lista de li


const renderTasks = () => {
    taskList.innerHTML = ""; 
    tasks.forEach((task) => {
        
        const html = ` 
            <li data-id="${task.id}" class="tasks__item">
                <p class="${task.completa && "done"}">
                    <strong>${task.nombre}</strong> - ${task.txt_tarea} 
                    <br><span>TE DEJO MI TEL: ${task.telefono}</span>
                </p>
                <div>
                    <i class="bx bx-check"></i>
                    <i class="bx bx-trash"></i>
                </div>
            </li>
        `;
        taskList.innerHTML += html;
    })
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#nameInput").value.trim();
    const phone = document.querySelector("#phoneInput").value.trim();
    let txt_tarea = taskInput.value.trim();

    let erroresValidacion = false;
    
    // Validación del nombre
    if (!/^[a-zA-Z\s]+$/.test(name) || name.length < 3) {
        erroresValidacion = true;
        const error = document.querySelector(".error");
        error.textContent = "El nombre debe contener al menos 3 caracteres y solo letras";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000);
    }
    
    // Validación del teléfono (solo números)
    if (!/^\d+$/.test(phone) || phone.length < 7) {
        erroresValidacion = true;
        const error = document.querySelector(".error");
        error.textContent = "El número de teléfono debe tener al menos 7 caracteres y solo números";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000);
    }

    // Validación del mensaje (max 60 caracteres)
    if (txt_tarea.length > 60) {
        erroresValidacion = true;
        const error = document.querySelector(".error");
        error.textContent = "El texto del mensaje no puede exceder los 60 caracteres";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000);
    }

    // Agregar salto de línea cada 30 caracteres
    txt_tarea = txt_tarea.replace(/(.{30})/g, '$1\n');

    if (!erroresValidacion) {
        const task = {
            id: Date.now(),
            nombre: name,
            telefono: phone,
            txt_tarea: txt_tarea,
            completa: false,
        };
       
        tasks.push(task); // Agrego la tarea a la lista de tareas
        console.log(tasks);

        // Almaceno las tareas en el localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
        renderTasks();
        form.reset(); 
    }
});




taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("bx-check")){
        
        
        const id = event.target.closest("li").dataset.id;
        // para que hago esto ?
        // lo hago porque tenemos un array con elementos
        // y deseo encontrar el elemento al que le hice click
        
        const task = tasks.find((task) => task.id == id);
        // en cada tarea va a buscar si el id es igual al elemento que se hizo click
        // console.log(task);

        // Vamos a cambiar el estado de la tarea
        task.completa = !task.completa;
        console.log(task);

        renderTasks();

        // El problema de ejecutar el renderTasks() es que me carga 
        // la lista nuevamente

        event.target.closest("li").querySelector("p").classList.toggle("done");
        // de la tarea que hice el click, busca el contenedor que tiene el objeto li con el closest("li")
        // a partir de ahi con el querySelector("p") busca el primer parrafo "p"
        // y de la lista de clases de ese parrafo ("classList") hace un toggle("done")
        // que hace el toggle? va a quitar o agregar la clase done.

        // ESTO ES MAS OPTIMO QUE RENDERIZAR TODA LA LISTA

        // Pero si recargo la pagina las tareas pasan a estar incompletas.
        // Porque el localStorage no se actualizo

        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    // -------------------------------------------
    // BORRAR UNA TAREA

    if(event.target.classList.contains("bx-trash")){
        const id = event.target.closest("li").dataset.id;
        const taskIndex = tasks.findIndex((task)=> task.id == id);

        tasks.splice(taskIndex, 1);
        // splice es una funcion que me permite manipular en JS los arrays
        // puedo añadir, eliminar o reemplazar elementos de un array en una 
        // posicion especifica
        // splice(taskIndex, 1). le paso dos parametros a la funcion
        // taskIndex es el que contiene el indice del elemento a manipular
        // 1 indica la cantidad de elementos a eliminar en este caso.

        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.target.closest("li").remove();

    }
});

// Recupero lo almacenado en localStorage
document.addEventListener("DOMContentLoaded", () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // uso OR || para agregar una lista vacia sino tengo informacion almacenada
    // en localStorage.

    // JSON.parse()
    // transforma un objeto JSON del tipo string en un objeto
    // JS del tipo array

    renderTasks();
});
