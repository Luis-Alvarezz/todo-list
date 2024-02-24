// Primero obtenemos la vinculacion del archivo.
console.log('Vinculamos el archivo')

const formulario = document.getElementById('formulario')
const listaTareas = document.getElementById('lista-tareas')  // Apartado para todas las tereas que vamos a GENERAR!
const templateTarea = document.getElementById('templateTarea').content // Obtenemos lo que esta DENTRO de la etiqueta con => .content
const fragment = document.createDocumentFragment() // En HTML, en Herramientas de desarrollador -> Inspeccionar, los template nos aparece con 
// fragment, debemos crear varios fragment para poder tomar copiar el fragmento de codigo interno.

let tareas = {} // Objeto de tareas, siendo una variable global

// Apartado de almacenamiento de texto en 'Local Storage' para permitir el almacenamiento de informacion en el navegador, par eso leeremos ese Local Storage, y ver si hay informacion almacenada
document.addEventListener('DOMContentLoaded', () => { // Agreagmos evento a la pagina, de nombre DOMContentLoaded (cuando la pag carge al 100% ejecuta:)
    // Verificamos si en local storage ya hay algo guardado:
    if(localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas')) // JSON -> Texto plano, lo convertimos a una variable, ya que el local Storage NO guarda el texto como tal
        // y esa variable la convertimos a texto plano para que no abarque mucha memoria.
    }
    pintarTareas()
})

// Activacion del evento de enter como boton 
formulario.addEventListener('submit',(e) => { // e -> recibimos el evento y captura quien lanzo el evento 
    e.preventDefault() // Solo capturamos 1 SOLO CLICK DEL ENTER
    setTarea(e) // Almacensmoa la tarea y mandamos todo el evento para saber quien la ejecutó  
})

listaTareas.addEventListener("click", (e) => {
    btnAcciones(e)
})

const btnAcciones = e => {
    if (e.target.classList.contains('fa-check-circle')) { // Funcion para MARCAR TERMINADA TAREA
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    } // Funcion para borrar tarea:
    if (e.target.classList.contains('fa-minus-circle')) {
        // delete tareas[e.target.dataset.id].estado // DESMARCAMOS elemento del arreglo TAREA
        delete tareas[e.target.dataset.id] // ELIMINAMOS elemento del arreglo 
        pintarTareas()
    } // Funcion para DESMARCAR tarea:
    if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }

    e.stopPropagation() // Solo detecta 1 click
}

const setTarea = e => { // e es OTRO nombre de variable, NO la anterior
    // Obtenemos el valor de lo que se obtuvo en el input
    const texto = e.target.querySelector('input').value // el .value es lo que escribimos dentro del input
    if(texto.trim() === '') { // trim borra espacios en blanco
        return
    }

    const tarea = { // TAREA EN ESPECIFO!!!!! CREAMOS EL OBJETO
        id: Date.now(), // Genera un timestime -> Hora en formato mundial en la fecha en el preciso momento que se creo
        texto: texto, // Al ser mismo nombre, podemos reducir como: texto,
        estado: false, // Cambia a true cuando NOSOTROs la marquemos como terminada
    }

    // ALMACENAMOS EL OBJETO CREADO en mi variable global
    tareas[tarea.id] = tarea  // Crea un arreglo de objetos, AUNQUE SEA 1 OBJETO, crea un arreglo de objetos
    pintarTareas() // Generamos tarea nueva
    formulario.reset() // Brramos contenido
    e.target.querySelector('input').focus() // Volvemos a poner el cursor en el elemento de input 
}

const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas)) // Volvemos a convertir de variable NORMAL (texto) a JSON (menos pasado para Local Storage)
    // 'tareas' es un nombre simplemente 
    if(Object.values(tareas).length === 0) {  // Objec values => Obtiene la cantidad de elementos dentro del objeto
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
                Sin Tareas Pendientes🥸!!!
            </div>` // `` -> Template

        return
    }
    // En cambio si tenemos tareas agregadas:
    listaTareas.innerHTML = '' // Borramos TODO el HTML, lo cual seria el texto de "sin tareas"
    Object.values(tareas).forEach((tarea) => { // Leemos y almacenamos en forma de arreglo las tareas, por ende las leemos con el forEach
        // Leemos cada tarea y se almacena en la variable temporal 'tarea'
        const clone = templateTarea.cloneNode(true) // Esta constante contiene TODOS los elementos dentro del template
        clone.querySelector('p').textContent = tarea.texto // quarySelector es un id, lo cual nos ayuda identidicar 1 elemento dentro de codigo

        // Codigo para saber estatus de tarea 
        if(tarea.estado) { // estado es un bool en false                            icono de desahacer
            clone.querySelectorAll('.fa')[0].classList.replace('fa-check-circle', 'fa-undo-alt') // querySelectorALL => Guarda TODAS las etiquetas en un arreglo, busca le etiqueta .fa
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary') // Solo tenemos 1 alerta, NO importa si ponemos querySelectorALL o querySelector
            // ERROR, NO DEBE LLEVAR querySelectorALL por que marca error!!
            clone.querySelector('p').style.textDecoration = 'line-through' // Subrayamos el texto para dar la decoracion de que terminamos la tarea
        }
        // Asignaciones de ID para saber que tarea seleccionamos
        clone.querySelectorAll('.fa')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fa')[1].dataset.id = tarea.id

        
        fragment.appendChild(clone)
    })
    listaTareas.appendChild(fragment)
}
