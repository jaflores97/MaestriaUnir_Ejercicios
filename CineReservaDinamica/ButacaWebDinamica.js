// Inicializar el DOM (esperar a que se cargue completamente)
document.addEventListener("DOMContentLoaded",() => {
    // Asignar manejador de eventos al input de sugerir asientos
    asignarIDsACeldas(); //  Asignar IDs a las celdas del grid
    document.getElementById("asientos").addEventListener("input", suggest);
    document.getElementById("book-button").addEventListener("click", book);
});

// Inicializar el tamaño de la matriz de butacas
const Nf = 5; // Número de filas
const Nc = 13; // Número de columnas

// Función para inicializar la matriz de butacas
function setup() {
    let idContador = 1; // Iniciar el contador de IDs en 1 (los humanos no empezamos a contar desde 0)
    let butacas = [];

    for (let i = 0; i < Nf; i++) {
        // Nueva fila
        let fila = [];
        for (let j = 0; j < Nc; j++) {
            // Nuevo asiento
            fila.push({
                id: idContador++,
                estado: false // Estado inicial libre
            });
        }
        butacas.push(fila);
    }
    butacas[4][12].estado = true; // Reservar un asiento como ejemplo
    return butacas;
}

// Función para asignar IDs a las celdas del grid
function asignarIDsACeldas() {
    const celdas = document.querySelectorAll('.grid-contenedor .celda:not(.encabezado)');
    let contador = 1;
    celdas.forEach(celda => {
        celda.id = `butaca-${contador}`;
        let fila = Math.floor((contador - 1) / Nc); // índice de fila
        let columna = (contador - 1) % Nc;          // índice de columna
        if (butacas[fila][columna].estado === true) {
            celda.classList.add('celda-ocupada');
        }

        contador++;
    });
}
// Inicializar la matriz
let butacas = setup();

// Imprimir la matriz
console.log("butacas inicializadas");

// Definir las reservas
const asientosR = new Set();

//Definir funcion suggest
function suggest() {
    const reservas = parseInt(document.getElementById("asientos").value);
    asientosR.clear();
    let reservado = false;
    
    // Eliminar sugerencias anteriores
    document.querySelectorAll('.celda-sugerida').forEach(celda => {
        celda.classList.remove('celda-sugerida');
    });

    if (reservas <= butacas[0].length) {
        for (let i = butacas.length - 1; i >= 0; i--) {
            let fila = butacas[i];
            let consecutivos = [];

            for (let j = fila.length - 1; j >= 0; j--) {
                if (!reservado && !fila[j].estado) {
                    consecutivos.push(fila[j]);

                    if (consecutivos.length === reservas) {
                        for (let k = 0; k < consecutivos.length; k++) {
                            //consecutivos[k].estado = true;
                            asientosR.add(consecutivos[k]);
                            const celda = document.getElementById(`butaca-${consecutivos[k].id}`);
                            if (celda) celda.classList.add('celda-sugerida');
                        }
                        reservado = true;
                    }
                } else if (!reservado) {
                    consecutivos = [];
                }
            }
        }
    }
    let sugeridos = "";
    for (let butaca of asientosR) {
        sugeridos += butaca.id + ", ";
        }
    sugeridos = sugeridos.slice(0, -2);
    console.log("Asientos sugeridos: " + sugeridos);

}

function book() {
        let reservados = [];

        asientosR.forEach(butaca => {
        butaca.estado = true;
        reservados.push(butaca.id); // Guardar ID para el mensaje

        const celda = document.getElementById(`butaca-${butaca.id}`);
        if (celda) {
            celda.classList.remove("celda-sugerida");
            celda.classList.add("celda-ocupada");
        }
    });

    if (reservados.length > 0) {
        alert("Asientos reservados: " + reservados.join(", "));
    } else {
        alert("No hay asientos sugeridos para confirmar.");
    }

    asientosR.clear();
}


