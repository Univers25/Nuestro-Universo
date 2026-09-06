const boton = document.getElementById("iniciarBtn");

const portada = document.getElementById("portada");
const sistema = document.getElementById("sistema");
const menu = document.getElementById("menu");

const btnOrigen = document.getElementById("btnOrigen");
const btnFrecuencia = document.getElementById("btnFrecuencia");
const btnJaque = document.getElementById("btnJaque");
const btnObservatorio = document.getElementById("btnObservatorio");

const origen = document.getElementById("origen");
const frecuencia = document.getElementById("frecuencia");
const jaque = document.getElementById("jaque");
const observatorio = document.getElementById("observatorio");

const volverMenu = document.getElementById("volverMenu");
const volverMenuFrecuencia =
    document.getElementById("volverMenuFrecuencia");
const volverMenuJaque =
    document.getElementById("volverMenuJaque");
const volverMenuObservatorio =
    document.getElementById("volverMenuObservatorio");
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
/* =========================
   OBSERVATORIO
========================= */

btnObservatorio.addEventListener("click", () => {

    menu.classList.remove("mostrar");

    observatorio.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   VOLVER DESDE OBSERVATORIO
========================= */

volverMenuObservatorio.addEventListener("click", () => {
 observatorio.classList.remove("mostrar");
 menu.classList.add("mostrar");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
/* =========================
   OBJETOS DEL OBSERVATORIO
========================= */

const ventanaObservacion =
    document.getElementById("ventanaObservacion");

const cerrarObservacion =
    document.getElementById("cerrarObservacion");

const tituloObservacion =
    document.getElementById("tituloObservacion");

const datoObservacion =
    document.getElementById("datoObservacion");

const mensajeObservacion =
    document.getElementById("mensajeObservacion");


/* =========================
   FUNCIÓN PARA MOSTRAR OBJETO
========================= */

function mostrarObservacion(titulo, dato, mensaje) {

    tituloObservacion.textContent = titulo;

    datoObservacion.textContent = dato;

    mensajeObservacion.textContent = mensaje;

    ventanaObservacion.classList.add("mostrar");

}


/* =========================
   SOL
========================= */

document
    .getElementById("objetosol")
    .addEventListener("click", () => {

        mostrarObservacion(

              "☀️ SOL — Lo que permanece",

            "El Sol lleva miles de millones de años iluminando el mismo universo.",

            `Y supongo que hay algo bonito en eso: algunas cosas permanecen, incluso mientras todo lo demás cambia.
            Nosotros también hemos cambiado. Han pasado días, meses, momentos buenos y otros no tanto. Hemos crecido, aprendido y seguido caminos que a veces se sienten demasiado separados.
            Pero entre todo eso, hay algo que todavía me parece increíble:
            sigues siendo tú y todo es a tu lado❤️.`
        );

    });


/* =========================
   LUNA
========================= */

document
    .getElementById("objetoluna")
    .addEventListener("click", () => {

        mostrarObservacion(

           "🌙 LUNA — La distancia",

            "La Luna está lejos, pero sigue siendo la misma Luna que podemos mirar desde lugares distintos.",

            `A veces pienso en eso cuando te extraño.
            En que quizá estás mirando el cielo desde tu lado y yo desde el mío, separados por kilómetros que no puedo simplemente atravesar.
            Y aunque no pueda estar ahí contigo, me gusta pensar que por unos segundos estamos viendo exactamente lo mismo.
            Quizá el cielo sea la forma más bonita que encontró el universo para recordarme que estar lejos no siempre significa estar separados.🌙🫂`
        );

    });

/* =========================
   SATURNO
========================= */

document
    .getElementById("objetosaturno")
    .addEventListener("click", () => {

        mostrarObservacion(

             "🪐 SATURNO — Haber coincidido",

            "Saturno tiene unos anillos formados por incontables fragmentos de hielo y roca que llevan millones de años girando a su alrededor.",

            `Millones de años.
            Y nosotros apenas llevamos una pequeña parte de una vida.
            A veces me parece extraño pensar en todas las personas que existen, todos los lugares donde pudimos haber estado, todos los momentos que tuvieron que suceder para que nuestras historias terminaran cruzándose.
            Entre un universo tan inmenso, me tocó encontrarte a ti.
            Y no sé qué hicimos para merecer una coincidencia así, pero espero que nunca dejemos de cuidarla.🪐✨`
        );

    });
/* =========================
   MARTE
========================= */
document
    .getElementById("objetomarte")
    .addEventListener("click", () => {

        mostrarObservacion(
            "🔴 MARTE — Hasta dónde llegaríamos",

            "Marte es un planeta rocoso y uno de los mundos más estudiados del Sistema Solar.",

            `Quién sabe hasta dónde podríamos llegar si algún día pudiéramos viajar entre las estrellas.
          A veces imagino cómo sería descubrir todos esos lugares contigo. Caminar por mundos que nunca hemos visto, 
          mirar cielos completamente distintos y tenerte a mi lado mientras descubrimos algo nuevo.
          Pero después pienso que, aunque no podamos viajar hasta las estrellas, ya estamos recorriendo algo juntos.
          Hemos atravesado distancia, tiempo, días buenos y días difíciles, y aun así seguimos aquí.
          Y quizá eso es lo que más me gusta de nosotros:
          que no sé hasta dónde llegaremos, pero sí sé con quién quiero seguir descubriéndolo. 🔴❤️`
        );

    });
/* =========================
   NEBULOSA
========================= */
document
    .getElementById("objetonebulosa")
    .addEventListener("click", () => {

        mostrarObservacion(

             "🌌 NEBULOSA — Lo que construimos",

            "Una nebulosa es una nube de gas y polvo donde, con el tiempo, pueden llegar a formase nuevas estrellas",

            `Me gusta pensar que lo nuestro también se ha ido formando así.
            Poco a poquito.
            Con cada conversación, cada risa, cada noche hablando, cada recuerdo que hemos guardado y
            también con esos momentos que no fueron tan fáciles.
            Hemos cambiado desde que nos encontramos. Hemos aprendido cosas el uno del otro y también de nosotros mismos.
            Y aunque nuestra historia todavía está lejos de estar terminada, cuando miro todo lo que hemos construido hasta ahora, 
            me hace feliz pensar que todo empezó simplemente porque dos personas coincidieron.
            No sé qué forma tendrá nuestro futuro ni cuántas cosas nos faltará por vivir.
            Pero sí sé algo:
            quiero seguir construyéndolo contigo. 🌌✨`
        );

    });
/* =========================
   AGUJERO NEGRO
========================= */
document
    .getElementById("objetoagujeronegro")
    .addEventListener("click", () => {

        mostrarObservacion(

             "🕳️ AGUJERO NEGRO — Entre tantos caminos",

            "Un agujero negro es una región del espacio donde la gravedad es tan intensa, ni siquiera la luz, puede escapar de ella.",

            `El universo todavía guarda preguntas que ni siquiera hemos logrado responder.
            Y quizá por eso me gusta tanto mirar hacia él. Porque cuando pienso en lo inmenso que es, 
            también pienso en lo pequeña que parece la posibilidad de que dos personas lleguen a encontrarse.
            Entre tantos lugares, tantas personas, tantos caminos que pudieron ser diferentes...
            terminé encontrándote a ti.
            Y desde que llegaste a mi vida, hay algo que tengo muy claro: no quiero que la distancia me haga dudar de lo que siento por ti.
            Confío en ti. Confío en lo que hemos construido y en todo lo que todavía nos queda por vivir.
            No sé cuántos caminos nos esperan, ni cuánto tiempo tendremos que recorrerlos separados.
            Pero si pudiera elegir una y otra vez entre todas las posibilidades de este universo, siempre elegiría la misma:
            encontrarte.
            Y seguir caminando contigo. 🖤🌌`
        );

    });
/* =========================
   CERRAR OBSERVACIÓN
========================= */

cerrarObservacion.addEventListener("click", () => {

    ventanaObservacion.classList.remove("mostrar");

});


/* =========================
   CERRAR AL TOCAR AFUERA
========================= */

ventanaObservacion.addEventListener("click", (evento) => {

    if (evento.target === ventanaObservacion) {

        ventanaObservacion.classList.remove("mostrar");

    }

});