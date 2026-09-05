const boton = document.getElementById("iniciarBtn");

const portada = document.getElementById("portada");
const sistema = document.getElementById("sistema");
const menu = document.getElementById("menu");

const btnOrigen = document.getElementById("btnOrigen");
const btnFrecuencia = document.getElementById("btnFrecuencia");
const btnJaque = document.getElementById("btnJaque");

const origen = document.getElementById("origen");
const frecuencia = document.getElementById("frecuencia");
const jaque = document.getElementById("jaque");

const volverMenu = document.getElementById("volverMenu");
const volverMenuFrecuencia =
    document.getElementById("volverMenuFrecuencia");
const volverMenuJaque =
    document.getElementById("volverMenuJaque");

const audioEntrada =
    document.getElementById("audioEntrada");


/* =========================
   INICIAR VIAJE
========================= */

boton.addEventListener("click", () => {

    audioEntrada.play().catch(() => {
        console.log("El navegador bloqueó el audio.");
    });

    boton.style.display = "none";

    sistema.classList.add("mostrar");

    setTimeout(() => {

        portada.classList.add("ocultar");

        sistema.classList.remove("mostrar");

        menu.classList.add("mostrar");

    }, 3500);

});


/* =========================
   ORIGEN
========================= */

btnOrigen.addEventListener("click", () => {

    menu.classList.remove("mostrar");

    origen.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   VOLVER DESDE ORIGEN
========================= */

volverMenu.addEventListener("click", () => {

    origen.classList.remove("mostrar");

    menu.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   FRECUENCIA
========================= */

btnFrecuencia.addEventListener("click", () => {

    menu.classList.remove("mostrar");

    frecuencia.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   VOLVER DESDE FRECUENCIA
========================= */

volverMenuFrecuencia.addEventListener("click", () => {

    frecuencia.classList.remove("mostrar");

    menu.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   JAQUE
========================= */

btnJaque.addEventListener("click", () => {

    menu.classList.remove("mostrar");

    jaque.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   AJEDREZ
========================= */

const tablero = document.getElementById("tablero");

let casillaSeleccionada = null;
let movimiento = 0;
let turno = "blancas";
let esperandoComputadora = false;
let partidaTerminada = false;


/* =========================
   PIEZAS
========================= */

const blancas = [
    "♙",
    "♖",
    "♘",
    "♗",
    "♕",
    "♔"
];

const negras = [
    "♟",
    "♜",
    "♞",
    "♝",
    "♛",
    "♚"
];


/* =========================
   FUNCIONES BÁSICAS
========================= */

function esBlanca(pieza) {
    return blancas.includes(pieza);
}

function esNegra(pieza) {
    return negras.includes(pieza);
}

function estaVacia(casilla) {
    return casilla.textContent.trim() === "";
}

function obtenerFila(casilla) {
    return Math.floor(Number(casilla.dataset.pos) / 8);
}

function obtenerColumna(casilla) {
    return Number(casilla.dataset.pos) % 8;
}

function obtenerCasilla(fila, columna) {

    if (
        fila < 0 ||
        fila > 7 ||
        columna < 0 ||
        columna > 7
    ) {
        return null;
    }

    return tablero.querySelector(
        `.casilla[data-pos="${fila * 8 + columna}"]`
    );
}


/* =========================
   LIMPIAR TABLERO
========================= */

function limpiarMovimientos() {

    const casillas =
        tablero.querySelectorAll(".casilla");

    casillas.forEach(casilla => {

        casilla.style.boxShadow = "";
        casilla.style.transform = "";

    });

}


/* =========================
   OBTENER POSICIÓN DEL REY
========================= */

function encontrarRey(color) {

    const rey =
        color === "blancas"
            ? "♔"
            : "♚";

    const casillas =
        tablero.querySelectorAll(".casilla");

    for (const casilla of casillas) {

        if (casilla.textContent.trim() === rey) {
            return casilla;
        }

    }

    return null;
}


/* =========================
   CASILLA AMENAZADA
========================= */

function estaAmenazada(casilla, porColor) {

    const casillas =
        tablero.querySelectorAll(".casilla");

    for (const origen of casillas) {

        const pieza =
            origen.textContent.trim();

        if (!pieza) {
            continue;
        }

        if (
            porColor === "blancas" &&
            !esBlanca(pieza)
        ) {
            continue;
        }

        if (
            porColor === "negras" &&
            !esNegra(pieza)
        ) {
            continue;
        }

        const movimientos =
            obtenerMovimientosBasicos(
                origen,
                true
            );

        if (movimientos.includes(casilla)) {
            return true;
        }

    }

    return false;
}


/* =========================
   REY EN JAQUE
========================= */

function reyEnJaque(color) {

    const rey =
        encontrarRey(color);

    if (!rey) {
        return true;
    }

    const enemigo =
        color === "blancas"
            ? "negras"
            : "blancas";

    return estaAmenazada(
        rey,
        enemigo
    );
}


/* =========================
   MOVIMIENTOS BÁSICOS
========================= */

function obtenerMovimientosBasicos(
    casilla,
    paraAmenaza = false
) {

    const pieza =
        casilla.textContent.trim();

    if (!pieza) {
        return [];
    }

    const fila =
        obtenerFila(casilla);

    const columna =
        obtenerColumna(casilla);

    const movimientos = [];


    /* =========================
       PEÓN
    ========================== */

    if (pieza === "♙" || pieza === "♟") {

        const blanca =
            pieza === "♙";

        const direccion =
            blanca ? -1 : 1;

        const filaInicial =
            blanca ? 6 : 1;


        if (paraAmenaza) {

            [-1, 1].forEach(dc => {

                const destino =
                    obtenerCasilla(
                        fila + direccion,
                        columna + dc
                    );

                if (destino) {
                    movimientos.push(destino);
                }

            });

        } else {

            const adelante =
                obtenerCasilla(
                    fila + direccion,
                    columna
                );

            if (
                adelante &&
                estaVacia(adelante)
            ) {

                movimientos.push(adelante);

                if (fila === filaInicial) {

                    const doble =
                        obtenerCasilla(
                            fila + direccion * 2,
                            columna
                        );

                    if (
                        doble &&
                        estaVacia(doble)
                    ) {
                        movimientos.push(doble);
                    }

                }

            }

            [-1, 1].forEach(dc => {

                const destino =
                    obtenerCasilla(
                        fila + direccion,
                        columna + dc
                    );

                if (!destino) {
                    return;
                }

                const piezaDestino =
                    destino.textContent.trim();

                if (
                    piezaDestino &&
                    (
                        (blanca &&
                            esNegra(piezaDestino)) ||
                        (!blanca &&
                            esBlanca(piezaDestino))
                    )
                ) {
                    movimientos.push(destino);
                }

            });

        }

    }


    /* =========================
       CABALLO
    ========================== */

    if (pieza === "♘" || pieza === "♞") {

        const saltos = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1]
        ];

        saltos.forEach(([df, dc]) => {

            const destino =
                obtenerCasilla(
                    fila + df,
                    columna + dc
                );

            if (!destino) {
                return;
            }

            const piezaDestino =
                destino.textContent.trim();

            if (
                !piezaDestino ||
                (
                    esBlanca(pieza) &&
                    esNegra(piezaDestino)
                ) ||
                (
                    esNegra(pieza) &&
                    esBlanca(piezaDestino)
                )
            ) {
                movimientos.push(destino);
            }

        });

    }


    /* =========================
       TORRE
    ========================== */

    if (
        pieza === "♖" ||
        pieza === "♜"
    ) {

        agregarMovimientosLinea(
            fila,
            columna,
            [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            ],
            pieza,
            movimientos
        );

    }


    /* =========================
       ALFIL
    ========================== */

    if (
        pieza === "♗" ||
        pieza === "♝"
    ) {

        agregarMovimientosLinea(
            fila,
            columna,
            [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
            ],
            pieza,
            movimientos
        );

    }


    /* =========================
       DAMA
    ========================== */

    if (
        pieza === "♕" ||
        pieza === "♛"
    ) {

        agregarMovimientosLinea(
            fila,
            columna,
            [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
            ],
            pieza,
            movimientos
        );

    }


    /* =========================
       REY
    ========================== */

    if (
        pieza === "♔" ||
        pieza === "♚"
    ) {

        const direcciones = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1]
        ];

        direcciones.forEach(([df, dc]) => {

            const destino =
                obtenerCasilla(
                    fila + df,
                    columna + dc
                );

            if (!destino) {
                return;
            }

            const piezaDestino =
                destino.textContent.trim();

            if (
                !piezaDestino ||
                (
                    esBlanca(pieza) &&
                    esNegra(piezaDestino)
                ) ||
                (
                    esNegra(pieza) &&
                    esBlanca(piezaDestino)
                )
            ) {
                movimientos.push(destino);
            }

        });

    }

    return movimientos;
}


/* =========================
   MOVIMIENTOS EN LÍNEA
========================= */

function agregarMovimientosLinea(
    fila,
    columna,
    direcciones,
    pieza,
    movimientos
) {

    direcciones.forEach(([df, dc]) => {

        let nuevaFila =
            fila + df;

        let nuevaColumna =
            columna + dc;

        while (true) {

            const destino =
                obtenerCasilla(
                    nuevaFila,
                    nuevaColumna
                );

            if (!destino) {
                break;
            }

            const piezaDestino =
                destino.textContent.trim();

            if (!piezaDestino) {

                movimientos.push(destino);

            } else {

                if (
                    (
                        esBlanca(pieza) &&
                        esNegra(piezaDestino)
                    ) ||
                    (
                        esNegra(pieza) &&
                        esBlanca(piezaDestino)
                    )
                ) {
                    movimientos.push(destino);
                }

                break;
            }

            nuevaFila += df;
            nuevaColumna += dc;

        }

    });

}


/* =========================
   SIMULAR MOVIMIENTO
========================= */

function movimientoDejaReyEnJaque(
    origen,
    destino
) {

    const piezaOrigen =
        origen.textContent.trim();

    const piezaDestino =
        destino.textContent.trim();

    const color =
        esBlanca(piezaOrigen)
            ? "blancas"
            : "negras";

    origen.textContent = "";

    destino.textContent =
        piezaOrigen;

    const resultado =
        reyEnJaque(color);

    destino.textContent =
        piezaDestino;

    origen.textContent =
        piezaOrigen;

    return resultado;
}


/* =========================
   MOVIMIENTOS LEGALES
========================= */

function obtenerMovimientosLegales(casilla) {

    const pieza =
        casilla.textContent.trim();

    if (!pieza) {
        return [];
    }

    const color =
        esBlanca(pieza)
            ? "blancas"
            : "negras";

    const movimientos =
        obtenerMovimientosBasicos(
            casilla
        );

    return movimientos.filter(destino => {

        return !movimientoDejaReyEnJaque(
            casilla,
            destino
        );

    });

}


/* =========================
   MOSTRAR MOVIMIENTOS
========================= */

function mostrarMovimientos(movimientos) {

    movimientos.forEach(casilla => {

        casilla.style.boxShadow =
            "inset 0 0 18px rgba(110,150,255,.75)";

    });

}


/* =========================
   HACER MOVIMIENTO
========================= */

function realizarMovimiento(
    origen,
    destino
) {

    const pieza =
        origen.textContent.trim();

    destino.textContent =
        pieza;

    origen.textContent = "";

    destino.style.transform =
        "scale(1.05)";

    destino.style.boxShadow =
        "inset 0 0 25px rgba(150,120,255,.9)";

    setTimeout(() => {

        destino.style.transform = "";
        destino.style.boxShadow = "";

    }, 500);

    movimiento++;

    actualizarMovimiento();

}


/* =========================
   MARCAR JAQUE
========================= */

function actualizarJaque() {

    const reyes = [
        {
            casilla: encontrarRey("blancas"),
            color: "blancas"
        },
        {
            casilla: encontrarRey("negras"),
            color: "negras"
        }
    ];

    reyes.forEach(({ casilla, color }) => {

        if (!casilla) {
            return;
        }

        casilla.style.boxShadow = "";

        if (reyEnJaque(color)) {

            casilla.style.boxShadow =
                "inset 0 0 25px rgba(255,70,100,.95), 0 0 20px rgba(255,70,100,.7)";

        }

    });

}


/* =========================
   JAQUE MATE / AHOGADO
========================= */

function tieneMovimientosLegales(color) {

    const casillas =
        tablero.querySelectorAll(".casilla");

    for (const casilla of casillas) {

        const pieza =
            casilla.textContent.trim();

        if (
            color === "blancas" &&
            !esBlanca(pieza)
        ) {
            continue;
        }

        if (
            color === "negras" &&
            !esNegra(pieza)
        ) {
            continue;
        }

        const movimientos =
            obtenerMovimientosLegales(
                casilla
            );

        if (movimientos.length > 0) {
            return true;
        }

    }

    return false;
}


function comprobarFinalPartida() {

    const colorActual = turno;

    const hayMovimientos =
        tieneMovimientosLegales(
            colorActual
        );

    if (hayMovimientos) {
        actualizarJaque();
        return false;
    }

    const estaEnJaque =
        reyEnJaque(colorActual);

    if (estaEnJaque) {

        partidaTerminada = true;

        actualizarJaque();

        const ganador =
            colorActual === "blancas"
                ? "NEGRAS"
                : "BLANCAS";

        mostrarMensajeFinal(
            "JAQUE MATE",
            "Las " + ganador + " han ganado la partida."
        );

    } else {

        partidaTerminada = true;

        mostrarMensajeFinal(
            "TABLAS",
            "La partida terminó en empate."
        );

    }

    return true;
}


/* =========================
   MENSAJE FINAL
========================= */

function mostrarMensajeFinal(
    titulo,
    texto
) {

    const mensaje =
        document.querySelector(".mensaje-jaque");

    if (!mensaje) {
        return;
    }

    const h3 =
        mensaje.querySelector("h3");

    const parrafos =
        mensaje.querySelectorAll("p");

    if (h3) {
        h3.textContent = titulo;
    }

    if (parrafos.length > 0) {
        parrafos[0].textContent = texto;
    }

}


/* =========================
   RESPUESTA COMPUTADORA
========================= */

function respuestaComputadora() {

    if (
        !tablero ||
        partidaTerminada
    ) {
        return;
    }

    const casillas =
        Array.from(
            tablero.querySelectorAll(".casilla")
        );

    const movimientosComputadora = [];


    casillas.forEach(origen => {

        const pieza =
            origen.textContent.trim();

        if (!esNegra(pieza)) {
            return;
        }

        const movimientos =
            obtenerMovimientosLegales(
                origen
            );

        movimientos.forEach(destino => {

            movimientosComputadora.push({
                origen,
                destino
            });

        });

    });


    if (
        movimientosComputadora.length === 0
    ) {

        comprobarFinalPartida();

        esperandoComputadora = false;

        return;
    }


    /* Preferir capturas */

    const capturas =
        movimientosComputadora.filter(
            movimiento => {

                return !estaVacia(
                    movimiento.destino
                );

            }
        );


    let elegido;

    if (capturas.length > 0) {

        elegido =
            capturas[
                Math.floor(
                    Math.random() *
                    capturas.length
                )
            ];

    } else {

        elegido =
            movimientosComputadora[
                Math.floor(
                    Math.random() *
                    movimientosComputadora.length
                )
            ];

    }


    realizarMovimiento(
        elegido.origen,
        elegido.destino
    );


    esperandoComputadora = false;

    turno = "blancas";

    actualizarJaque();

    comprobarFinalPartida();

}


/* =========================
   CLICK EN TABLERO
========================= */

if (tablero) {

    const casillas =
        tablero.querySelectorAll(".casilla");


    casillas.forEach(
        (casilla, indice) => {

        casilla.dataset.pos = indice;


        casilla.addEventListener(
            "click",
            () => {

            if (
                turno !== "blancas" ||
                esperandoComputadora ||
                partidaTerminada
            ) {
                return;
            }


            /* =========================
               SELECCIONAR PIEZA
            ========================== */

            if (!casillaSeleccionada) {

                const pieza =
                    casilla.textContent.trim();

                if (!esBlanca(pieza)) {
                    return;
                }

                casillaSeleccionada =
                    casilla;

                limpiarMovimientos();

                casilla.style.boxShadow =
                    "inset 0 0 25px rgba(150,120,255,.9)";

                casilla.style.transform =
                    "scale(1.05)";

                const movimientos =
                    obtenerMovimientosLegales(
                        casilla
                    );

                mostrarMovimientos(
                    movimientos
                );

                return;
            }


            /* =========================
               CANCELAR
            ========================== */

            if (
                casilla ===
                casillaSeleccionada
            ) {

                limpiarMovimientos();

                casillaSeleccionada = null;

                return;
            }


            /* =========================
               SELECCIONAR OTRA PIEZA
            ========================== */

            const piezaNueva =
                casilla.textContent.trim();

            if (
                esBlanca(piezaNueva)
            ) {

                limpiarMovimientos();

                casillaSeleccionada =
                    casilla;

                casilla.style.boxShadow =
                    "inset 0 0 25px rgba(150,120,255,.9)";

                casilla.style.transform =
                    "scale(1.05)";

                mostrarMovimientos(
                    obtenerMovimientosLegales(
                        casilla
                    )
                );

                return;
            }


            /* =========================
               COMPROBAR DESTINO
            ========================== */

            const movimientos =
                obtenerMovimientosLegales(
                    casillaSeleccionada
                );

            if (!movimientos.includes(casilla)) {
                return;
            }


            /* =========================
               HACER JUGADA
            ========================== */

            realizarMovimiento(
                casillaSeleccionada,
                casilla
            );

            limpiarMovimientos();

            casillaSeleccionada = null;

            turno = "negras";

            esperandoComputadora = true;

            actualizarJaque();

            if (comprobarFinalPartida()) {
                esperandoComputadora = false;
                return;
            }


            /* =========================
               RESPUESTA
            ========================== */

            setTimeout(() => {

                respuestaComputadora();

            }, 900);

        });

    });

}


/* =========================
   CONTADOR
========================= */

function actualizarMovimiento() {

    const indicador =
        document.querySelector(".movimiento");

    if (indicador) {

        indicador.textContent =
            "MOVIMIENTO · " +
            String(movimiento)
                .padStart(2, "0");

    }

}
/* =========================
   VOLVER DESDE JAQUE
========================= */

volverMenuJaque.addEventListener("click", () => {
    jaque.classList.remove("mostrar");
    menu.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});