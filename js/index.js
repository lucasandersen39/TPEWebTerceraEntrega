"uses strict";

document.addEventListener("DOMContentLoaded", function () {
    cargarPagina();
    const url = "https://6363774237f2167d6f7a2269.mockapi.io/";
    let arregloTurnos = [];
    let idTurno;
    let pagina = 1;
    let cantPorHoja = 5;
    /* Carga las funciones iniciales, cuando el index es cargado.
       Al entrar al sitio se carga la pagina home por defecto y se le asignan los eventos
       a cada uno de los links de la barra de navegacion del header */
    function cargarPagina() {
        cargarContenido("home");
        document.querySelector("#home").addEventListener("click", function (event) {
            cargarContenido(event.target.id);
            desplegarMenu();
        });
        document.querySelector("#servicios").addEventListener("click", function (event) {
            cargarContenido(event.target.id);
            desplegarMenu();
        });
        document.querySelector("#turnos").addEventListener("click", function (event) {
            let id = "turnosUsuario";
            cargarContenido(event.target.id, url);
            let res = obtenerContenido(id);
            res.then((contenido) => {
                let body = document.querySelector("#contenidoTurnos");
                body.innerHTML = contenido;
                cargarHandler(id, url);
            });
            desplegarMenu();

        });
        document.querySelector("#idBtn-menu").addEventListener("click", () => {
            desplegarMenu();
        });
    }
    /****************************************************************************************************/
    /*Carga el contenido de una pagina html en el main de index
      Setea el titulo de la pagina con el nombre del archivos que estamos cargando
      y hace un pushState en el history para guardar el estado de la pagina
      para ir hacia atras y adelante desde el navegador
      */
    function cargarContenido(id, url) {
        document.title = id;
        window.history.pushState({ id }, `${id}`, `${window.location.origin}/TPEWebTerceraEntrega/${id}.html`);
        let res = obtenerContenido(id);
        res.then((contenido) => {
            let body = document.querySelector("#idMainPrincipal");
            body.innerHTML = contenido;
            cargarHandler(id, url);
        });
    }

    /* Realiza la funcion asincrona que hace la peticion de la pagina que queremos cargar en el cuerpo del index
       Cuando obtiene la respuesta la inserta en el main
    */
    async function obtenerContenido(id) {
        try {
            let respuesta = await fetch(`${id}.html`);
            if (respuesta.ok) {
                let contenido = await respuesta.text();
                return contenido;
            }
            else
                body.innerHTML = "Error al cargar contenido";
        } catch (error) {
            body.innerHTML = "Error al conectar con el servidor";
        }
    }

    function cargarHandler(id, url) {
        if (id == "turnos") {
            cargarContenidoTurnos(url);
            document.querySelector("#button-usuario").addEventListener("click", function () {
                let id = "turnosUsuario";
                let res = obtenerContenido(id);
                res.then((contenido) => {
                    let body = document.querySelector("#contenidoTurnos");
                    body.innerHTML = contenido;
                    cargarContenidoTurnos(url);
                });
            });
            document.querySelector("#button-admin").addEventListener("click", function () {
                cantPorHoja=5;
                let id = "turnosAdmin";
                let res = obtenerContenido(id);
                res.then((contenido) => {
                    let body = document.querySelector("#contenidoTurnos");
                    body.innerHTML = contenido;
                    cargarContenidoAdmin(url);
                });
            });
        }
    }
    /****************************************************************************************************/
    /**
     * Inserta un elemento en la tabla de la API que se pasa como parametro
     * @param {*} url Direccion de la API (mockAPI)
     * @param {*} producto Elemento que se quiere insertar en la base de datos
     * @param {*} tabla Tabla de la API en la cual se quiere insertar el elemento
     */
    async function insertarEnAPI(url, producto, tabla) {
        try {
            let resultado = await fetch(url + tabla, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'same-origin',
                body: JSON.stringify(producto)
            });
            if (resultado.ok) {
                let elem = await resultado.json();
                return elem;
            }
            else
                console.log("No se pudo insertar");//imprimir mensaje en el html 
        } catch (error) {
            //imprimir mensaje en el html 
            console.log("Error en la conexion")
        }
    }

    /**
     * Dada una direccion de una API y una tabla sobre la quye hacemos GET para obtener los elementos de dicha tabla.
     * Se le pasa un filtro preestablecido por el usuario en el caso que se quiere buscar por ciertos atributos
     * @param {*} url Direccion de la Api de la cual queremos recuperar la informacion (mockAPI)
     * @param {*} tabla Tabla de API con los elementos (turno)
     * @param {*} filtro Filtro que se quiere aplicar para obtener datos que coincidan con una busqueda dada. Si filtro
     *                   Se encuentra vacio, se buscaran todos los elementos de la tabla
     * @returns Un Arreglo o un elemento que son los resultados del GET realizado en la API
     */
    async function obtenerDatos(url, tabla, filtro) {
        try {
            let respuesta = await fetch(url + tabla + filtro);
            if (respuesta.ok) {
                let datos = await respuesta.json();
                return datos;
            }
            else
                console.log("Error al obtener datos");//imprimir mensaje en el html 
        } catch (error) {
            console.log("Error de conexion");//imprimir mensaje en el html 
        }
    }

    async function borrarDato(url, tabla, id) {
        try {
            let resultado = await fetch(url + tabla + "/" + id, {
                method: 'DELETE',
            });
            if (resultado.ok) {
                mostrarMensajeRes("EL turno ha sido borrado exitosamente")
            }
            else
                mostrarMensajeRes(" No se pudo modificar el turno");
        } catch (error) {

            console.log("Error en la conexion")
        }
    }

    async function modificarDatoEnAPI(url, tabla, turno) {
        try {
            let resultado = await fetch(url + tabla + "/" + turno.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(turno)
            });
            if (resultado.ok)
                mostrarMensajeRes("EL turno ha sido modificado exitosamente")
            else
                mostrarMensajeRes(" No se pudo modificar el turno");
        } catch (error) {
            //imprimir mensaje en el html 
            console.log("Error en la conexion")
        }
    }
    /****************************************************************************************************/
    /*Funcion que muestra u oculta el menu en mobile*/
    function desplegarMenu() {
        let nav = document.querySelector("#idUlNav");
        nav.classList.toggle("mostrar");
    }

    async function cargarContenidoTurnos(url) {
        let barberos = await obtenerDatos(url, "barbero", "");
        //Carga en el input del form los barberos disponibles
        //cargarInputBarbero(barberos);
        armarTHead(barberos);
        let fecha = document.querySelector("#idFechaTurno");
        fecha.value = fechaActual();
        fecha.min = fechaActual();
        fecha.addEventListener("change", function () {
            /*let filtro = armarFiltro("", "fecha", fecha.value);
            let turnos = [];
            turnos = await obtenerDatos(url, "turno", filtro);
    
            cargarTurnos(turnos, barberos);*/
            cargarTabla(url, fecha.value);
        });
        /*
        let filtro = armarFiltro("", "fecha", fecha.value);
        let turnos = await obtenerDatos(url, "turno", filtro);
        cargarTurnos(turnos, barberos);
        */
        cargarTabla(url, fecha.value);
        agregarListenerTabla(fecha);
        let formulario = document.querySelector("#idFormulario");
        formulario.addEventListener("submit", validarFormulario);
    }

    async function cargarTabla(url, fecha) {
        let barberos = await obtenerDatos(url, "barbero", "");
        let filtro = armarFiltro("", "fecha", fecha);
        //let turnos = [];
        //turnos = await obtenerDatos(url, "turno", filtro);

        let turnos = obtenerDatos(url, "turno", filtro);
        turnos.then((data) => cargarTurnos(data, barberos));
        //cargarTurnos(turnos, barberos);
    }

    function agregarListenerTabla(fecha) {
        let tBodyTabla = document.querySelector("#idTbodyTabla");
        tBodyTabla.addEventListener("click", (event) => {
            generarCaptcha();
            let datosReserva = event.target.id.split('-');
            let formulario = document.querySelector("#idFormulario");
            if (event.target.classList.value == "celdaDisponible") {
                borrarInfoTurno();
                formulario.classList.add("desplegar");
                document.querySelector("#idReservaBarbero").innerHTML = datosReserva[1];
                document.querySelector("#idReservaHora").innerHTML = datosReserva[0];
                document.querySelector("#idReservaFecha").innerHTML = armarFecha(fecha.value);
            }
            else
                formulario.classList.remove("desplegar");
        });
    }
    /**
         * Formatea una fecha dada en formato DD/MM/AAAA
         * @param {} fecha fecha que se obtiene del input date
         * @returns Retorna un string con los valores de la fecha invertidos
         */
    function armarFecha(fecha) {
        let datos = fecha.split('-');
        return (datos[2] + "-" + datos[1] + "-" + datos[0]);
    }
    function borrarInfoTurno() {
        let divInfoTurno = document.querySelector("#infoConfirmaTurno");
        while (divInfoTurno.firstChild)
            divInfoTurno.removeChild(divInfoTurno.firstChild);
    }

    function cargarInputBarbero(barberos, select) {

        for (const elem of barberos) {
            let opcion = document.createElement("option");
            opcion.value = elem.nombre;
            opcion.text = elem.nombre;
            select.appendChild(opcion);
        }
    }

    function armarFiltro(cadena, parametro, valor) {
        if (cadena === "")
            cadena = "?" + parametro + "=" + valor;
        else
            cadena = cadena + "&" + parametro + "=" + `${valor}`;

        return cadena;
        //?barbero=Nicolas
        //?barbero=Nicolas&page=1
        //?barbero=Nicolas&page=1&limit=5
    }

    /**
         * Obtiene la fecha de hoy por medio de la libreria Date
         * @returns La fecha de hoy formateada en AAAA/MM/DD
         */
    function fechaActual() {
        const hoy = new Date();
        let dia = hoy.getDate();
        if (dia < 10)
            dia = "0" + dia;
        let mes = (hoy.getMonth() + 1);
        if (mes < 10)
            mes = "0" + mes;
        fecha = hoy.getFullYear() + "-" + mes + "-" + dia;
        return fecha;
    }

    function armarTHead(arBarberos) {
        let theadT = document.querySelector("#idTheadTabla");
        let fila = document.createElement("tr");
        fila.appendChild(crearColumna("Barbero"));
        theadT.appendChild(fila);
        for (const elem of arBarberos) {
            fila.appendChild(crearColumna(elem.nombre));
            theadT.appendChild(fila);
        }
    }

    /**
         * Crea una celda para agregar a la tabla de turnos
         * @param {*} dato Dato que se quiere agregar en la celda
         * @param {*} estilo Estilo que se quiere dar a la celda
         * @param {*} h Hora que se usa para formar el id del elemento
         * @param {*} n Nombre del barbero usado para generar el id del elemento
         * @returns Retorna una celda ya ingresada y formateada
         */
    function crearColumna(dato, estilo, h, n) {
        let col = document.createElement("td");
        col.textContent = dato;
        col.classList.add(estilo);
        col.id = "" + h + "-" + n;
        return col;
    }

    function cargarTurnos(turnos, listaBarberos) {
        let bodyTable = document.querySelector("#idTbodyTabla");
        limpiarTabla(bodyTable);
        for (let hora = 10; hora <= 18; hora++) {
            let fila = document.createElement("tr");
            fila.appendChild(crearColumna(hora + "hs"));
            bodyTable.appendChild(fila);
            for (let i = 0; i < listaBarberos.length; i++) {
                if (estaDisponible(listaBarberos[i].nombre, hora, turnos))
                    fila.appendChild(crearColumna("Disponible", "celdaDisponible", hora, listaBarberos[i].nombre));
                else
                    fila.appendChild(crearColumna("Reservado", "celdaReservada", hora, listaBarberos[i].nombre));
                bodyTable.appendChild(fila);
            }
        }
    }

    /**
         * Recorre el arreglo de los turnos y verifica si un turno con un barbero en una fecha y hora dada existe
         * @param {*} nombre Nombre del barbero 
         * @param {*} hora Hora del turno que estamos verificando si se encuentra disponible
         * @param {*} turnos Arreglo de turnos 
         * @returns Retorn true si no se encuentra en el arreglo de turno, false si ya existe
         */
    function estaDisponible(nombre, hora, turnos) {
        let estaDisp = true;
        let i = 0;
        while (i < turnos.length && estaDisp)
            if (turnos[i].barbero == nombre && turnos[i].hora == hora)
                estaDisp = false;
            else
                i++;
        return estaDisp;
    }

    /**
         * Elimina todos los nodos de la tabla
         */
    function limpiarTabla(bodyT) {
        while (bodyT.firstChild)
            bodyT.removeChild(bodyT.firstChild);
    }
    /****************************************************************************************************/
    function cargarContenidoAdmin(url) {
        let res = obtenerDatos(url, "barbero", "");
        pagina = 1;
        //Carga en el input del form los barberos disponibles
        res.then((barberos) => {
            let select = document.querySelector("#idSelectBarbero");
            cargarInputBarbero(barberos, select);
            let select2 = document.querySelector("#idSelectBarberoFiltro");
            cargarInputBarbero(barberos, select2);
        });

        let fecha = document.querySelector("#idFechaTurno");
        fecha.value = fechaActual();
        fecha.min = fechaActual();
        fecha.addEventListener("change", function () {
            let filtro = armarFiltro("", "fecha", fecha.value);
            renderTablaAdmin(url, "turno", filtro, 1);
        });

        let filtro = armarFiltro("", "fecha", fecha.value);
       
        renderTablaAdmin(url, "turno", filtro, 1).then((turnos) => {
            let btnSig = document.querySelector("#idBtnSiguiente");

            arregloTurnos = turnos;
            console.log(arregloTurnos.length);
            if (arregloTurnos.length >= cantPorHoja) {
                btnSig.disabled = false;
                btnSig.addEventListener("click", paginado);
                let btnAnterior = document.querySelector("#idBtnAnterior");
                btnAnterior.addEventListener("click", paginado);
            }
        });
        let selectCant = document.querySelector("#idCantHojas");
        selectCant.addEventListener("change", () => {
            cantPorHoja = selectCant.value;
            renderTablaAdmin(url, "turno", filtro, 1).then((turnos) => {
                arregloTurnos = turnos;
            });
        })
        let formu = document.querySelector("#idFormularioAdmin");
        formu.addEventListener("submit", function (event) {
            if (event.submitter.id == "submitRegistraTurno") {
                guardarDatosAdmin(event, formu);
                limpiarCampos();
            }
        });

        let limpiar = document.querySelector("#idBotonLimpiarAdmin");
        limpiar.addEventListener("click", () => {
            let bodyTabla = document.querySelector("#idTbodyTablaAdmin");
            limpiarTabla(bodyTabla);
        });

        let turnosRandom = document.querySelector("#idBotonAzar");
        turnosRandom.addEventListener("click", agregarTurnosRandom);

        document.querySelector("#idFiltrarResultados").addEventListener("click",filtrarResultados);
    }

    function paginado(event) {
        let fecha = document.querySelector("#idFechaTurno");
        let filtro = armarFiltro("", "fecha", fecha.value);
        let btnAnt = document.querySelector("#idBtnAnterior");
        let btnSig = document.querySelector("#idBtnSiguiente");

        if (event.target.id == "idBtnSiguiente") {
            btnAnt.disabled = false;
            pagina++;
            renderTablaAdmin(url, "turno", filtro, pagina).then((turnos) => {
                arregloTurnos = turnos;
                if (arregloTurnos.length < 5)
                    btnSig.disabled = true;
            });
        } else
            if (event.target.id == "idBtnAnterior") {
                btnSig.disabled = false;
                pagina--;
                renderTablaAdmin(url, "turno", filtro, pagina).then((turnos) => {
                    arregloTurnos = turnos;
                    if (pagina < 2)
                        btnAnt.disabled = true;
                });
            }
    }

    function guardarDatosAdmin(event, formu) {
        event.preventDefault();
        let adminData = new FormData(formu);
        let turno = {
            "barbero": adminData.get("barbero"),
            "fecha": adminData.get("fecha"),
            "hora": adminData.get("Hora"),
            "cliente": {
                "nombre": adminData.get("nombre"),
                "apellido": adminData.get("apellido"),
                "telefono": adminData.get("numero"),
            }
        };
        let filtroBusqueda = armarFiltro("", "barbero", turno.barbero);
        filtroBusqueda = armarFiltro(filtroBusqueda, "fecha", turno.fecha);
        filtroBusqueda = armarFiltro(filtroBusqueda, "hora", turno.hora);
        let turnoExiste = obtenerDatos(url, "turno", filtroBusqueda);
        turnoExiste.then((turnoRes) => {
            if (existeTurno(turnoRes, turno) == -1) {
                let res = insertarEnAPI(url, turno, "turno");
                res.then(() => {
                    let filtro = armarFiltro("", "fecha", turno.fecha);
                    renderTablaAdmin(url, "turno", filtro, 1).then((turnos) => {
                        arregloTurnos = turnos;
                    });
                });
            }
            else
                mostrarMensajeRes("Ya existe un turno dado en esa fecha y hora");
        });
    }

    function agregarTurnosRandom() {
        obtenerDatos(url, "barbero", "").then(async (barberos) => {
            let cant = 0;
            let clientes = [{
                "nombre": "Roberto",
                "apellido": "vitale",
                "telefono": 435588
            },
            {
                "nombre": "Carlos",
                "apellido": "Capote",
                "telefono": 635455
            },
            {
                "nombre": "Norberto",
                "apellido": "Steffen",
                "telefono": 438788
            }
            ];
            let fecha = document.querySelector("#idFechaTurno").value;
            let turnosDisp = [];
            let barb = 0;
            //let turnosAux = arregloTurnos;
            let filtro = armarFiltro("", "fecha", fecha);
            let turnosAux = await obtenerDatos(url, "turno", filtro);

            while (cant < 3 && barb < barberos.length) {
                let turnoDisp = buscarTurnoDisponible(barberos[barb], fecha, clientes[cant], turnosAux);
                if (turnoDisp != undefined) {
                    turnosDisp.push(turnoDisp);
                    turnosAux.push(turnoDisp);
                    cant++;
                }
                else
                    barb++;
            }
            if (turnosDisp.length == 3) {
                insertarEnAPI(url, turnosDisp[0], "turno").then(() => {
                    insertarEnAPI(url, turnosDisp[1], "turno").then(() => {
                        insertarEnAPI(url, turnosDisp[2], "turno").then(() => {
                            let filtro = armarFiltro("", "fecha", fecha);
                            renderTablaAdmin(url, "turno", filtro, pagina).then((turnos) => {
                                arregloTurnos = turnos;
                                let btnSig = document.querySelector("#idBtnSiguiente");
                                if (arregloTurnos.length < 5)
                                    btnSig.disabled = true;
                                else
                                    btnSig.disabled = false;
                            });
                        })
                    })
                })
            }
            else
                mostrarMensajeRes("No hay mas horario para asiganr turnos random")
        });
    }

    function buscarTurnoDisponible(barbero, fecha, cliente, turnosAux) {
        let hora = 10;
        let valido = false;
        let turno = undefined;
        while (hora < 19 && !valido) {
            let t1 = armarObjetoTurno(barbero.nombre, fecha, hora, cliente.nombre, cliente.apellido, cliente.telefono);
            if (existeTurno(turnosAux, t1) == -1) {
                turno = t1;
                valido = true;
            }
            hora++;
        }
        return turno;
    }
    function armarObjetoTurno(barb, fec, hora, cliNom, cliAp, cliTel) {
        let t1 = {
            "barbero": barb,
            "fecha": fec,
            "hora": hora,
            "cliente": {
                "nombre": cliNom,
                "apellido": cliAp,
                "telefono": cliTel
            }
        };
        return t1;
    }

    function mostrarMensajeRes(mensaje) {
        document.querySelector("#idMostrarInfoRes").innerHTML = mensaje;
    }

    async function renderTablaAdmin(url, tabla, filtro, pag) {
        let filtroAux = filtro;
        filtroAux = armarFiltro(filtroAux, "page", pag);
        filtroAux = armarFiltro(filtroAux, "limit", cantPorHoja);
        try {
            let resultado = await obtenerDatos(url, tabla, filtroAux);
            cargarTablaAdmin(resultado);
            return resultado;

        }
        catch (error) {
            console.log("No se pudo cargar la pagina")
        }
    }

    function filtrarResultados() {
        let fecha = document.querySelector("#idFechaTurno");
        let barbero = document.querySelector("#idSelectBarberoFiltro");
        let hora = document.querySelector("#idSelectHoraFiltro");
        let nombreCli = document.querySelector("#idNombreFiltro");
        let apCli = document.querySelector("#idApellidoFiltro");
        let resultado = arregloTurnos;
        resultado = buscarPorFecha(resultado, fecha.value);
        console.log(resultado.length);
        if (barbero.value != "vacio")
            resultado = buscarPorBarbero(resultado, barbero.value);
        if (hora.value != "vacio")
            resultado = buscarPorHora(resultado, hora.value);
        if (nombreCli.value != "")
            resultado = buscarPorNombreCliente(resultado, nombreCli.value);
        if (apCli.value != "")
            resultado = buscarPorApellidoCliente(resultado, apCli.value);

        cargarTablaAdmin(resultado);
    }

    function buscarPorBarbero(arreglo, nombre) {
        let resultado = [];
        for (let i = 0; i < arreglo.length; i++)
            if (arreglo[i].barbero == nombre)
                resultado.push(arreglo[i]);
        return resultado;
    }
    function buscarPorNombreCliente(arreglo, nombre) {
        let resultado = [];
        for (let i = 0; i < arreglo.length; i++)
            if (arreglo[i].cliente.nombre == nombre)
                resultado.push(arreglo[i]);
        return resultado;
    }
    function buscarPorApellidoCliente(arreglo, apellido) {
        let resultado = [];
        for (let i = 0; i < arreglo.length; i++)
            if (arreglo[i].cliente.apellido == apellido)
                resultado.push(arreglo[i]);
        return resultado;
    }
    function buscarPorHora(arreglo, hora) {
        let resultado = [];
        for (let i = 0; i < arreglo.length; i++)
            if (arreglo[i].hora == hora)
                resultado.push(arreglo[i]);
        return resultado;
    }
    function buscarPorFecha(arreglo, fecha) {
        let resultado = [];
        for (let i = 0; i < arreglo.length; i++)
            if (arreglo[i].fecha == fecha)
                resultado.push(arreglo[i]);
        return resultado;
    }

    function existeTurno(arreglo, turno) {
        let id = -1;
        let i = 0;
        while ((i < arreglo.length) && (id == -1)) {
            if (arreglo[i].barbero == turno.barbero && arreglo[i].fecha == turno.fecha &&
                arreglo[i].hora == turno.hora)
                id = arreglo[i].id;
            i++;
        }
        return id;
    }

    function limpiarCampos() {
        document.querySelector("#idNombre").value = "";
        document.querySelector("#idApellido").value = "";
        document.querySelector("#idTelefono").value = "";
        document.querySelector("#idSelectHora").value = "10";
    }
    /*
     cargarTabla(url, fecha.value);
     agregarListenerTabla(fecha);
     let formulario = document.querySelector("#idFormulario");
     formulario.addEventListener("submit", validarFormulario);*/

    function cargarTablaAdmin(turnos) {
        let bodyAdmin = document.querySelector("#idTbodyTablaAdmin");
        limpiarTabla(bodyAdmin);
        for (const elem of turnos) {
            agregarFilaAdmin(elem, turnos);
        }
    }

    function agregarFilaAdmin(turno, arTurnos) {
        let bodyAdmin = document.querySelector("#idTbodyTablaAdmin");
        let fila = document.createElement("tr");
        fila.appendChild(crearColumnaAdmin(turno.cliente.nombre));
        fila.appendChild(crearColumnaAdmin(turno.cliente.apellido));
        fila.appendChild(crearColumnaAdmin(turno.cliente.telefono));
        fila.appendChild(crearColumnaAdmin(turno.barbero));
        fila.appendChild(crearColumnaAdmin(armarFecha(turno.fecha)));
        fila.appendChild(crearColumnaAdmin(turno.hora));
        fila.appendChild(crearBoton("Editar", turno.id, arTurnos));
        bodyAdmin.appendChild(fila);
    }

    function crearBoton(texto, id, arTurnos) {
        let boton = document.createElement("button");
        boton.id = id;
        boton.textContent = texto;
        boton.addEventListener("click", function () {
            idTurno = boton.id;
            editarTurno(arTurnos);
        });
        return boton;
    }
    /**
     * Esta funcion se encarga de buscar el objeto json al que pertenece el id e ingresarlo en los inputs
     * del form para que el usuario pueda editarlos.
     * Ademas oculta el boton de registrar turno y lo intercambia con los botones de modificar, borrar y cancelar
     * @param {*} id El id del turno que se desea modificar
     * @param {*} arTurnos Arreglo de objetos json con todos los turnos que tenemos cargados en la tabla
     */
    function editarTurno(arTurnos) {
        let turno = buscarTurno(idTurno, arTurnos);
        if (turno != undefined) {
            document.querySelector("#idNombre").value = turno.cliente.nombre;
            document.querySelector("#idApellido").value = turno.cliente.apellido;
            document.querySelector("#idTelefono").value = turno.cliente.telefono;
            document.querySelector("#idSelectHora").value = turno.hora;
            document.querySelector("#idSelectBarbero").value = turno.barbero;
            document.querySelector("#idFechaTurno").value = turno.fecha;
            document.querySelector("#submitRegistraTurno").classList.add("oculto");
            document.querySelector("#idDivModificar").classList.remove("oculto");

            btnCancelar = document.querySelector("#buttonCancelar");

            if (!btnCancelar.classList.contains("registroTurno")) {
                btnCancelar.classList.add("registroTurno");
                btnCancelar.addEventListener("click", cancelarOperacion);
                let btnBorrar = document.querySelector("#buttonBorrarTurno");

                btnBorrar.addEventListener("click", function () {
                    borrarTurno(turno);
                });
                let formu = document.querySelector("#idFormularioAdmin");
                formu.addEventListener("submit", function (event) {
                    if (event.submitter.id == "submitModificaTurno") {
                        modificarTurno(event);
                        limpiarCampos();
                    }
                });
            }
        }
        else
            console.log("no encontro nada");
    }

    function cancelarOperacion() {
        limpiarCampos();
        document.querySelector("#idDivModificar").classList.add("oculto");
        document.querySelector("#submitRegistraTurno").classList.remove("oculto");
    }

    function borrarTurno(turno) {
        let fecha = turno.fecha;
        let res = borrarDato(url, "turno", idTurno);
        res.then(() => {
            cancelarOperacion();
            let filtro = armarFiltro("", "fecha", fecha);
            renderTablaAdmin(url, "turno", filtro, 1).then((turnos) => {
                arregloTurnos = turnos;
                document.querySelector("#idBtnAnterior").disabled = true;
                let btnSig = document.querySelector("#idBtnSiguiente");
                pagina = 1;
                if (arregloTurnos.length < 5)
                    btnSig.disabled = true;
                else
                    btnSig.disabled = false;
            });
        });
    }

    function modificarTurno(event) {
        event.preventDefault();

        let turno = {
            "barbero": document.querySelector("#idSelectBarbero").value,
            "fecha": document.querySelector("#idFechaTurno").value,
            "hora": document.querySelector("#idSelectHora").value,
            "id": idTurno,
            "cliente": {
                "nombre": document.querySelector("#idNombre").value,
                "apellido": document.querySelector("#idApellido").value,
                "telefono": document.querySelector("#idTelefono").value
            }
        }
        let filtroBusqueda = armarFiltro("", "barbero", turno.barbero);
        filtroBusqueda = armarFiltro(filtroBusqueda, "fecha", turno.fecha);
        filtroBusqueda = armarFiltro(filtroBusqueda, "hora", turno.hora);
        let turnoExiste = obtenerDatos(url, "turno", filtroBusqueda);
        turnoExiste.then((turnoRes) => {
            let idAux = existeTurno(turnoRes, turno);
            if (idAux == -1 || idAux == turno.id) {
                let res = modificarDatoEnAPI(url, "turno", turno);
                res.then(() => {
                    let filtro = armarFiltro("", "fecha", turno.fecha);
                    renderTablaAdmin(url, "turno", filtro, pagina).then((turnos) => {
                        arregloTurnos = turnos;
                        let btnSig = document.querySelector("#idBtnSiguiente");
                        if (arregloTurnos.length < 5)
                            btnSig.disabled = true;
                        else
                            btnSig.disabled = false;
                    });
                    cancelarOperacion();
                });
            }
            else
                mostrarMensajeRes("No se pudo modificar. Ya existe un turno dado en esa fecha y hora");
        });
    }
    function buscarTurno(id, arreglo) {
        let existe = false;
        let i = 0;
        let turno = undefined;
        while (i < arreglo.length && !existe) {
            if (arreglo[i].id == id) {
                turno = arreglo[i];
                existe = true;
            }
            i++;
        }
        return turno;
    }

    function crearColumnaAdmin(dato) {
        let col = document.createElement("td");
        col.textContent = dato;
        return col;
    }

    /*Captura el evento lanzado por el navegador cuando queremos ir hacia atras o hacia adelante en la navegacion
      Preguntamos si es distinto de null porque chrome nos lanza un popstate cuando cargamos la pagina
    */
    window.addEventListener("popstate", (event) => {
        if (event.state !== null) {
            let estado = event.state.id;
            document.title = estado;
            let res = obtenerContenido(estado);
            res.then((contenido) => {
                let body = document.querySelector("#idMainPrincipal");
                body.innerHTML = contenido;
                cargarHandler(estado, url)
            });
        }
    });
    /****************************************************************************************************/
    /*CAPTCHA */

    //La funcion Math.random me genera un numero random entre 0 y 1 sin incluir el 1
    //Le sumamos 1 para incluir el numero max entre los posibles resultados al aplicarle el floor
    function numeroAleatorio(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    //Genera una cadena de texto de tamaño cantLetras
    //define un arreglo con las letras disponibles
    //genera un numero aleatorio entre 0 y el tamaño del arreglo usando la funcion numeroAleatorio
    //va concatenando la cadena con la nueva letra generada
    function armarPalabra(cantLetras) {
        let letras = 'abcdefghijklmnopqrstuvwxyz';
        let cadena = '';
        for (let i = 1; i <= cantLetras; i++) {
            let numeroRandomLetras = numeroAleatorio(0, letras.length - 1);
            let letra = letras.charAt(numeroRandomLetras);
            cadena = cadena.concat(letra);
        }
        return cadena;
    }

    //Genera un captcha de un tamaño especificado y lo inserta en turnos.html
    function generarCaptcha() {
        let textoCaptcha = document.querySelector("#idTextoCaptcha");
        //recupero la cadena aleatoria
        let cadena = armarPalabra(5);
        //Añade la cadena aleatoria al <p>
        textoCaptcha.innerHTML = cadena;
    }

    //Crea una lista de forma dinamica con los datos ingresados por el usuario
    //y lo inserta debajo del form en la pagina de turnos
    function mostrarResumenTurno(nuevoTurno) {
        let divInfoTurno = document.querySelector("#infoConfirmaTurno");
        let nombre = document.querySelector("#idInputNombre");
        let apellido = document.querySelector("#idInputApellido");
        let barbero = document.querySelector("#idSelectBarbero");
        let hora = document.querySelector("#idSelectHora");

        let lista = document.createElement("ul");
        //se aplica un estilo a la lista que muestra los datos de la reserva con firmada
        lista.classList.add("listaReservaTurno");
        let elementoLista = document.createElement("li");
        elementoLista.classList.add("elementoListaReserva");
        let info = document.createTextNode("Nombre: " + nuevoTurno.cliente.nombre);
        elementoLista.appendChild(info);
        lista.appendChild(elementoLista);

        let elementoLista2 = document.createElement("li");
        elementoLista2.classList.add("elementoListaReserva");
        let info2 = document.createTextNode("Apellido: " + nuevoTurno.cliente.apellido);
        elementoLista2.appendChild(info2);
        lista.appendChild(elementoLista2);

        let elementoLista3 = document.createElement("li");
        elementoLista3.classList.add("elementoListaReserva");
        let info3 = document.createTextNode("Fecha: " + nuevoTurno.fecha + "/  Hora: " + nuevoTurno.hora + "hs");
        elementoLista3.appendChild(info3);
        lista.appendChild(elementoLista3);

        let elementoLista4 = document.createElement("li");
        elementoLista4.classList.add("elementoListaReserva");
        let info4 = document.createTextNode("Barbero: " + nuevoTurno.barbero);
        elementoLista4.appendChild(info4);
        lista.appendChild(elementoLista4);

        let h3 = document.createElement("h3");
        let encabezado = document.createTextNode("Reserva confirmada");
        h3.appendChild(encabezado);
        divInfoTurno.appendChild(h3);
        divInfoTurno.appendChild(lista);
        //se aplica un estilo al div que contiene la confirmacion del turno
        divInfoTurno.classList.add("divInfoTurno");
    }

    function borrarInfoTurno() {
        let divInfoTurno = document.querySelector("#infoConfirmaTurno");
        while (divInfoTurno.firstChild)
            divInfoTurno.removeChild(divInfoTurno.firstChild);
    }

    //Imprime en la pagina un mensaje de que el captcha es incorrecto
    function errorCaptchaIngresado() {
        let divInfoTurno = document.querySelector("#infoConfirmaTurno");
        divInfoTurno.classList.add("divInfoTurno");
        divInfoTurno.innerHTML = "Captcha Incorrecto";
    }

    function cerrarForm() {
        document.querySelector("#idInputNombre").value = "";
        document.querySelector("#idInputApellido").value = "";
        document.querySelector("#idNumeroTelefono").value = "";
        document.querySelector("#idInputIngresaCaptcha").value = "";
        generarCaptcha();
        let formulario = document.querySelector("#idFormulario");
        formulario.classList.remove("desplegar");
    }

    function crearTurnoJson(barb, fec, hor, nomCli, apCli, telCli) {
        let nuevoTurno = {
            "barbero": barb,
            "fecha": fec,
            "hora": hor,
            "cliente": {
                "nombre": nomCli,
                "apellido": apCli,
                "telefono": telCli,
            }
        };
        return nuevoTurno;
    }

    function agendarTurno() {
        let bar = document.querySelector("#idReservaBarbero").textContent;
        let fe = armarFecha(document.querySelector("#idReservaFecha").textContent);
        let hor = document.querySelector("#idReservaHora").textContent;
        let nCli = document.querySelector("#idInputNombre").value;
        let apCli = document.querySelector("#idInputApellido").value;
        let tCli = parseInt(document.querySelector("#idNumeroTelefono").value);
        let nuevoTurno = crearTurnoJson(bar, fe, hor, nCli, apCli, tCli);
        const url = "https://6363774237f2167d6f7a2269.mockapi.io/";
        insertarEnAPI(url, nuevoTurno, "turno");
        cargarTabla(url, fe)
        mostrarResumenTurno(nuevoTurno);
        cerrarForm();
    }

    //Pregunta si todos los campos requeridos estan completos
    //Si lo estan, valida que el captcha sea correcto
    //Si es correco imprime un resumen del turno dado
    //Si no es correcto avisa que es incorrecto y genera un nuevo captcha
    function validarFormulario(evento) {
        let textoCaptcha = document.querySelector("#idTextoCaptcha");
        let inputIngresaCaptcha = document.querySelector("#idInputIngresaCaptcha");

        evento.preventDefault();
        if (textoCaptcha.textContent == inputIngresaCaptcha.value) {
            agendarTurno();
        }
        else {
            errorCaptchaIngresado();
            generarCaptcha();
        }
    }

});