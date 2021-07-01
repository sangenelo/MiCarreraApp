/*
Para leer la primera posicion de un array
console.log(doc.data().medallas[0]);
Para obtener el temaño de un array
console.log(console.log(doc.data().medallas.length));*/

//Adicionales
function compararMateriasPorAnio(mat1, mat2) {
    if (mat1.anio < mat2.anio) {
        return -1;
    }
    if (mat1.anio > mat2.anio) {
        return 1;
    }
    return 0;
}

function compararMateriasPorNombre(mat1, mat2) {
    if (mat1.nombreMateria < mat2.nombreMateria) {
        return -1;
    }
    if (mat1.nombreMateria > mat2.nombreMateria) {
        return 1;
    }
    return 0;
}

function compararMateriasPorFechaAprobacion(mat1, mat2) {
    if (mat1.fechaAprobacion < mat2.fechaAprobacion) {
        return -1;
    }
    if (mat1.fechaAprobacion > mat2.fechaAprobacion) {
        return 1;
    }
    return 0;
}

function compararMateriasPorNota(mat1, mat2) {
    if (parseInt(mat1.nota) > parseInt(mat2.nota)) {
        return -1;
    }
    if (parseInt(mat1.nota) < parseInt(mat2.nota)) {
        return 1;
    }
    return 0;
}

//Variables globales

var idCarreraElegida;
var nombreCarreraElegida;

var toastCBCBottom = app.toast.create({
    text: 'Las materias del CBC no afectan al promedio',
    closeTimeout: 3000,
    closeButton: true,
    closeButtonText: '¡Entendido!',
  });


//Funciones

function cargarCarreras() {
    baseDeDatos = firebase.firestore();
    var refUniversidades = baseDeDatos.collection("Universidades");

    refUniversidades.get()
        .then(function (querySnapshot) {

            $$('#listaUniversidades').append('<option value="noUniversidad">Elegí una universidad</option>');
            querySnapshot.forEach(function (doc) {
                //console.log(doc.data().nombre);
                $$('#listaUniversidades').append('<option value="' + doc.id + '">' + doc.data().nombre + '</option>');
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

async function cargarCarrerasDelUsuario() {
    baseDeDatos = firebase.firestore();
    //console.log("Usuario pasado a BD: "+usuario);
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    return refUsuario.get()
        .then(function (doc) {
            $$('#bienvenidoHome').text('¡Bienvenidx, ' + doc.data().nombre + '!');
            nombre = doc.data().nombre;
            fotoPerfil = doc.data().fotoPerfil;
            apellido = doc.data().apellido;
            rol = doc.data().rol;
            for (var i = 0; i < doc.data().carreras.length; i++) {
                //console.log(doc.data().carreras[i].nombre);
                $$('#selectorCarreraHome').append('<option value="' + doc.data().carreras[i].idCarrera + '">' + doc.data().carreras[i].nombre + '</option>');
            }
            //carreraSeleccionada = doc.data().carreras[0].idCarrera;
            if (carreraSeleccionada == null) {
                return doc.data().carreras[0].idCarrera;
            } else {
                return carreraSeleccionada;
            }
            //cargarPorcentajeCarrera(doc.data().carreras[0].idCarrera);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

//Detecto cambio en el <select> de Universidades
$$('body').on('change', '#listaUniversidades', function () {
    var idUniversidad = $$('#listaUniversidades option:checked').val();
    //Una vez elegida una universidad, se muestran las carreras para dicha universidad.
    $$('#primerInicioContenedorCarreras').removeClass('disabled');
    $$('#primerInicioLinkCarreras').removeClass('disabled');

    obtenerCarrerasDeUniversidad(idUniversidad);

});

function obtenerCarrerasDeUniversidad(idUniversidad) {
    //Primero vacío el <select> para evitar que se sigan cargando materias cada vez que se cliquea en una universidad en el paso 1.
    $$('#listaCarreras').empty();
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Universidades").doc(idUniversidad).collection("carreras").orderBy("nombre", "asc");
    refCarreras.get()
        .then(function (querySnapshot) {
            $$('#listaCarreras').append('<option value="noCarrera">Elegí una carrera</option>');
            querySnapshot.forEach(function (doc) {
                //console.log(doc.data().nombre);
                $$('#listaCarreras').append('<option value="' + doc.data().idCarrera + '">' + doc.data().nombre + '</option>')
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

//Detecto cambio en el <select> de Carreras
$$('body').on('change', '#listaCarreras', function () {
    idCarreraElegida = $$('#listaCarreras option:checked').val();
    nombreCarreraElegida = $$('#listaCarreras option:checked').text();
    //Una vez elegida una carrera, se habilita el botón de confirmar.
    $$('#botonPrimerInicio').prop('disabled', false);
    $$('#botonPrimerInicio').removeClass('disabled');
});

function guardarCarrera() {
    $$('.agregarCarrera').addClass('disabled');
    $$('.agregarCarrera').text('Agregando carrera');
    //Como el resultado de esta función es una promesa, debo ejecutar el código en then, ya que allí es donde se resuelve la misma.
    var cantidadMateriasPromesa = getCantidadMaterias(idCarreraElegida)
        .then(function (cantidadMaterias) {

            var universidadPromesa = getUniversidad(idCarreraElegida)
                .then(function (universidad) {

                    var creditosPromesa = getSiRequiereCreditos(idCarreraElegida)
                        .then(function (creditos) {
                            baseDeDatos = firebase.firestore();

                            //Validar que la carrera elegida no esté actualmente elegida
                            var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
                            referenciaUsuario.get()
                                .then(function (doc) {
                                    //Itero entre las carreras hasta encontrar la carreras seleccionada
                                    var yaEstaActiva = false;
                                    for (var i = 0; i < doc.data().carreras.length; i++) {
                                        if (doc.data().carreras[i].idCarrera == idCarreraElegida) {
                                            yaEstaActiva = true;
                                            break;
                                        }
                                    }
                                    if (yaEstaActiva == false) {
                                        //Obtener materias de la carrera elegida
                                        var referenciaMaterias = baseDeDatos.collection('Carreras').doc(idCarreraElegida).collection('materias').orderBy('nombre', 'asc');
                                        //Creo array de materias
                                        var materiasDeLaCarreraElegida = [];
                                        referenciaMaterias.get()
                                            .then(function (querySnapshot) {
                                                querySnapshot.forEach(function (doc) {
                                                    //Por cada materia, la agrego a los arrays
                                                    //materiasDeLaCarreraElegida.push(doc.data().idMateria);
                                                    materiasDeLaCarreraElegida.push({
                                                        idMateria: doc.data().idMateria,
                                                        nombreMateria: doc.data().nombre
                                                    });
                                                });
                                                console.log(materiasDeLaCarreraElegida);
                                                console.log("Los creditos que se analizan son: " + creditos[0]);
                                                if (creditos[0] != 0) {
                                                    var carreraNueva = {
                                                        materiasAprobadas: [],
                                                        progreso: 0,
                                                        alcanzoTituloIntermedio: false,
                                                        nombre: nombreCarreraElegida,
                                                        idCarrera: idCarreraElegida,
                                                        cantidadMateriasAprobadas: 0,
                                                        cantidadMateriasPendientes: cantidadMaterias,
                                                        materiasPendientes: materiasDeLaCarreraElegida,
                                                        promedio: 0,
                                                        universidad: universidad,
                                                        creditosNecesarios: creditos[0],
                                                        creditosObtenidos: 0,
                                                        materiasConCreditos: [],
                                                        requiereHoras: creditos[1]
                                                    }
                                                } else {
                                                    var carreraNueva = {
                                                        materiasAprobadas: [],
                                                        progreso: 0,
                                                        alcanzoTituloIntermedio: false,
                                                        nombre: nombreCarreraElegida,
                                                        idCarrera: idCarreraElegida,
                                                        cantidadMateriasAprobadas: 0,
                                                        cantidadMateriasPendientes: cantidadMaterias,
                                                        materiasPendientes: materiasDeLaCarreraElegida,
                                                        promedio: 0,
                                                        universidad: universidad
                                                    }
                                                }

                                                var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
                                                referenciaUsuario.update({
                                                    "carreras": firebase.firestore.FieldValue.arrayUnion(carreraNueva)
                                                })

                                                    .then(function () {

                                                        console.log("Carrera agregada al usuario " + usuario + " en la BD.");
                                                        $$('.agregarCarrera').text('Agregar carrera');
                                                        var toastConfirmacionCarreraAgregada = app.toast.create({
                                                            icon: '<i class="f7-icons">checkmark_alt</i>',
                                                            text: 'Carrera agregada correctamente.',
                                                            position: 'center',
                                                            closeTimeout: 2000,
                                                        });
                                                        toastConfirmacionCarreraAgregada.open();
                                                        mainView.router.navigate('/home/');

                                                    })
                                                    .catch(function (error) {

                                                        console.log("Error: " + error);

                                                    });
                                            })
                                            .catch(function (error) {
                                                console.log("Error getting documents: ", error);
                                            });
                                    } else {
                                        console.log("Error, la carrera ya está activa");
                                        $$('.agregarCarrera').text('Agregar carrera');
                                        var toastCarreraYaActiva = app.toast.create({
                                            icon: '<i class="f7-icons">exclamationmark_triangle</i>',
                                            text: 'La carrera que seleecionaste ya está activa.',
                                            position: 'center',
                                            closeTimeout: 2000,
                                        });
                                        toastCarreraYaActiva.open();
                                    }
                                })
                                .catch(function (error) {
                                    console.log("Error getting documents: ", error);
                                });

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })
                .catch(function (error) {

                    console.log("Error: " + error);

                });
        })
        .catch(function (error) {

            console.log("Error: " + error);

        });
}


async function getCantidadMaterias(idCarrera) {
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Carreras").doc(idCarrera);

    return refCarreras.get()
        .then(function (doc) {
            //cantidadMaterias = doc.data().cantidadMaterias;
            return doc.data().cantidadMaterias;
        })
        .catch(function (error) {

            console.log("Error: ", error);

        });

}

async function getUniversidad(idCarrera) {
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Carreras").doc(idCarrera);

    return refCarreras.get()
        .then(function (doc) {
            return doc.data().universidad;
        })
        .catch(function (error) {

            console.log("Error: ", error);

        });

}

async function getSiRequiereCreditos(idCarrera) {
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Carreras").doc(idCarrera);

    return refCarreras.get()
        .then(function (doc) {
            if (typeof doc.data().creditosNecesarios !== 'undefined') {
                console.log("La carrera elegida tiene " + doc.data().creditosNecesarios + " creditos necesarios.");
                var respuesta;
                if(typeof doc.data().requiereHoras !== 'undefined'){
                    respuesta = [doc.data().creditosNecesarios,doc.data().requiereHoras]; 
                }else{
                    respuesta = [doc.data().creditosNecesarios,null];
                }
                //var respuesta = [doc.data().creditosNecesarios,doc.data().requiereHoras];
                //return doc.data().creditosNecesarios;
                return respuesta;
            } else {
                var respuesta = [0,false];
                return respuesta;
            }

        })
        .catch(function (error) {

            console.log("Error: ", error);

        });

}

function cargarPorcentajeCarrera(idCarrera) {
    baseDeDatos = firebase.firestore();
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (idCarrera == doc.data().carreras[i].idCarrera) {
                    //Obtengo el progreso y actualizo el range slider
                    var range = app.range.get('.range-slider');
                    range.setValue(doc.data().carreras[i].progreso);
                    //Muevo al corredor junto con el range slider
                    var offset = $$('.range-knob-wrap').css('left');
                    offset = parseInt(offset) + 27;
                    $$('#iconoCorredor').css('left', offset + 'px');
                    var cantidadAprobadas = doc.data().carreras[i].cantidadMateriasAprobadas;
                    var cantidadPendientes = doc.data().carreras[i].cantidadMateriasPendientes;
                    var cantidadRegulares = 0;
                    if (typeof doc.data().carreras[i].materiasRegulares !== 'undefined') {
                        cantidadRegulares = doc.data().carreras[i].materiasRegulares.length;
                    }
                    var porcentajeProgreso = doc.data().carreras[i].progreso;
                    $$('#detalleProgreso').text('Hiciste ' + cantidadAprobadas + ' de ' + (cantidadPendientes + cantidadAprobadas + cantidadRegulares) + ' materias. (' + porcentajeProgreso + '%) ');
                    $$('#preloaderHome').addClass('oculto');
                    $$('#contenedorProgresoCarrera ul').removeClass('escondido');

                    //Mostrar promedio
                    //Accedo al objeto gauge
                    var gauge = app.gauge.get('.my-gauge');
                    var promedioEnPorcentaje = (doc.data().carreras[i].promedio) / 10;
                    gauge.update({
                        value: promedioEnPorcentaje,
                        valueText: doc.data().carreras[i].promedio
                    });

                    //Tooltip de progreso
                    app.tooltip.destroy("#progresoAyuda");
                    var textoTooltip = "";
                    textoTooltip += "Para recibirte te falta";
                    var textoY = "";
                    var cantidadMateriasQueFaltan = cantidadPendientes + cantidadRegulares;
                    var seRecibio = true;
                    if (cantidadMateriasQueFaltan > 0) {
                        seRecibio = false;
                        textoTooltip += " aprobar " + cantidadMateriasQueFaltan + " materia/s";
                        textoY = " y";
                    }

                    if (typeof doc.data().carreras[i].creditosNecesarios !== 'undefined') {
                        if (doc.data().carreras[i].creditosObtenidos < doc.data().carreras[i].creditosNecesarios) {
                            var creditosUHoras = "créditos";
                            if(typeof doc.data().carreras[i].requiereHoras !== 'undefined' && doc.data().carreras[i].requiereHoras){
                                creditosUHoras="horas de electivas"
                            }
                            seRecibio=false;
                            textoTooltip += textoY;
                            textoTooltip += " sumar " + (doc.data().carreras[i].creditosNecesarios - doc.data().carreras[i].creditosObtenidos) + " "+creditosUHoras;
                        }
                    }
                    if(seRecibio){
                        textoTooltip="¡Te recibiste! Felicitaciones :)"
                    }
                    
                    textoTooltip += ".";
                    var progresoTooltip = app.tooltip.create({
                        targetEl: '#progresoAyuda',
                        text: textoTooltip,
                        trigger: 'click'
                    });
                }
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}


function cargarMateriasPendientesEnAgregarMateria(materiaPasadaPorRuta) {
    console.log("Carrera seleccionada: " + carreraSeleccionada);
    baseDeDatos = firebase.firestore();
    //console.log("Usuario pasado a BD: "+usuario);
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            //Listo las materias pendientes
            for (var j = 0; j < doc.data().carreras[indice].materiasPendientes.length; j++) {
                //console.log(doc.data().carreras[indice].materiasPendientes[j]);
                $$('#agregarMateriaListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasPendientes[j].idMateria + '">' + doc.data().carreras[indice].materiasPendientes[j].nombreMateria + '</option>');
            }
            //Listo las materias regulares
            if (typeof doc.data().carreras[indice].materiasRegulares !== 'undefined') {
                for (var j = 0; j < doc.data().carreras[indice].materiasRegulares.length; j++) {
                    $$('#agregarMateriaListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasRegulares[j].idMateria + '">' + doc.data().carreras[indice].materiasRegulares[j].nombreMateria + '</option>');
                }
            }

            if (materiaPasadaPorRuta != '') {
                var smartSelect = app.smartSelect.get('#smart-select-materia');
                smartSelect.setValue(materiaPasadaPorRuta);
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function cargarMateriasEnAgregarFinalDesaprobado(materiaPasadaPorRuta) {
    console.log("Carrera seleccionada: " + carreraSeleccionada);
    baseDeDatos = firebase.firestore();
    //console.log("Usuario pasado a BD: "+usuario);
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            //Listo las materias aprobadas
            for (var j = 0; j < doc.data().carreras[indice].materiasAprobadas.length; j++) {
                $$('#agregarFinalDesaprobadoListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasAprobadas[j].idMateria + '">' + doc.data().carreras[indice].materiasAprobadas[j].nombreMateria + '</option>');
            }
            //Listo las materias pendientes
            for (var k = 0; k < doc.data().carreras[indice].materiasPendientes.length; k++) {
                $$('#agregarFinalDesaprobadoListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasPendientes[k].idMateria + '">' + doc.data().carreras[indice].materiasPendientes[k].nombreMateria + '</option>');
            }
            //Listo las materias regulares
            if (typeof doc.data().carreras[indice].materiasRegulares !== 'undefined') {
                for (var j = 0; j < doc.data().carreras[indice].materiasRegulares.length; j++) {
                    $$('#agregarFinalDesaprobadoListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasRegulares[j].idMateria + '">' + doc.data().carreras[indice].materiasRegulares[j].nombreMateria + '</option>');
                }
            }

            if (materiaPasadaPorRuta != '') {
                var smartSelect = app.smartSelect.get('#smart-select-final');
                smartSelect.setValue(materiaPasadaPorRuta);
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

//Cargar materias en "Agregar materia regularizada"
function cargarMateriasEnAgregarMateriaRegularizada(materiaPasadaPorRuta) {
    console.log("Carrera seleccionada: " + carreraSeleccionada);
    baseDeDatos = firebase.firestore();
    //console.log("Usuario pasado a BD: "+usuario);
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            //Listo las materias pendientes
            for (var k = 0; k < doc.data().carreras[indice].materiasPendientes.length; k++) {
                $$('#agregarRegularListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasPendientes[k].idMateria + '">' + doc.data().carreras[indice].materiasPendientes[k].nombreMateria + '</option>');
            }
            if (materiaPasadaPorRuta != '') {
                var smartSelect = app.smartSelect.get('#smart-select-regular');
                smartSelect.setValue(materiaPasadaPorRuta);
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function agregarMateriaRegularizada() {
    $$('#agregarMateriaRegular').addClass('disabled');
    $$('#agregarMateriaRegular').text('Agregando materia regularizada');
    var idMateria = $$('#agregarRegularListaMaterias').val();
    var nombreMateria = $$('#agregarRegularSeleccionarMateriaContenedor .item-after').text();

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];


            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasPendientes.length; j++) {
                if (doc.data().carreras[indice].materiasPendientes[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }


            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);


            //Saco la materia elegida del array materiasPendientes
            carreraAModificar.materiasPendientes.splice(indiceMateria, 1);
            carreraAModificar.cantidadMateriasPendientes--;

            //Creo el objeto materiaRegularizada
            var materiaRegular = {
                idMateria: idMateria,
                nombreMateria: nombreMateria
            };

            //Actualizo el array materiasRegularizadas
            if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                carreraAModificar.materiasRegulares.push(materiaRegular);
            } else {
                var materiasRegulares = [];
                materiasRegulares.push(materiaRegular);
                carreraAModificar["materiasRegulares"] = materiasRegulares;
            }

            //Borro la materia del array
            referenciaUsuario.update({
                "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
            })


                .then(function () {

                    console.log("Carrera eliminada correctamente.");
                    //mainView.router.navigate('/home/');

                })
                .catch(function (error) {

                    console.log("Error: " + error);

                });

            referenciaUsuario.update({
                "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
            })


                .then(function () {

                    console.log("Carrera agregada correctamente.");
                    var toastConfirmacionMateriaAgregada = app.toast.create({
                        icon: '<i class="f7-icons">checkmark_alt</i>',
                        text: 'Listo! Materia regular agregada correctamente.',
                        position: 'center',
                        closeTimeout: 2000,
                    });
                    toastConfirmacionMateriaAgregada.open();
                    $$('#agregarMateriaRegular').removeClass('disabled');
                    $$('#agregarMateriaRegular').text('Agregar materia');

                    mainView.router.navigate('/home/');

                })
                .catch(function (error) {

                    console.log("Error: " + error);

                });




        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



}

function agregarMateriaAListaDeAprobadas() {
    $$('#agregarMateriaAprobada').addClass('disabled');
    $$('#agregarMateriaAprobada').text('Agregando materia');
    var idMateria = $$('#agregarMateriaListaMaterias').val();
    var nombreMateria = $$('#contenedorNombreMateria .item-after').text();
    var fechaAprobacion = $$('#demo-calendar-default').val();
    var nota = $$('#agregarMateriaNota').val();
    var fechaAprobacionTimeStamp = firebase.firestore.Timestamp.fromDate(new Date(fechaAprobacion));

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];

            //La carrera puede estar en materiasPendientes o en materiasRegulares
            var esMateriaPendiente = false;

            var anioMateria = -1;

            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasPendientes.length; j++) {
                if (doc.data().carreras[indice].materiasPendientes[j].idMateria == idMateria) {
                    var indiceMateria = j;
                    if (typeof doc.data().carreras[indice].materiasPendientes[j].anio !== 'undefined') {
                        anioMateria = doc.data().carreras[indice].materiasPendientes[j].anio;
                    }

                    esMateriaPendiente = true;
                }
            }
            //Si el indiceMateria es undefined, es porque no se encontró la materia. Por lo tanto, está en materiasRegulares
            if (typeof indiceMateria === 'undefined') {
                for (var j = 0; j < doc.data().carreras[indice].materiasRegulares.length; j++) {
                    if (doc.data().carreras[indice].materiasRegulares[j].idMateria == idMateria) {
                        var indiceMateria = j;
                        if (typeof doc.data().carreras[indice].materiasRegulares[j].anio !== 'undefined') {
                            anioMateria = doc.data().carreras[indice].materiasRegulares[j].anio;
                        }

                    }
                }
            }



            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            //Creo el objeto materiaAprobada
            var materiaAprobada = {
                idMateria: idMateria,
                nombreMateria: nombreMateria,
                fechaAprobacion: fechaAprobacionTimeStamp,
                nota: nota,
                anio: anioMateria
            };

            //Actualizo el array materiasAprobadas
            carreraAModificar.materiasAprobadas.push(materiaAprobada);

            if (esMateriaPendiente) {
                //Saco la materia elegida del array materiasPendientes
                carreraAModificar.materiasPendientes.splice(indiceMateria, 1);
                //Actualizo cantidad de materias pendientes para el progreso
                carreraAModificar.cantidadMateriasPendientes--;
            } else {
                //Saco la materia elegida del array materiasRegulares
                carreraAModificar.materiasRegulares.splice(indiceMateria, 1);
            }

            //Actualizo cantidad de materias aprobadas para el progreso
            carreraAModificar.cantidadMateriasAprobadas++;

            //var nuevoPromedio = calcularPromedio(carreraAModificar, nota, '+', 0, idMateria);
            //carreraAModificar.promedio = nuevoPromedio;

            calcularPromedio(carreraAModificar, nota, '+', 0, idMateria).
                then(nuevoPromedio => {
                    console.log("El promedio devuelto es: " + nuevoPromedio);
                    carreraAModificar.promedio = nuevoPromedio;
                    //Recalculo progreso
                    var totalMaterias;
                    var totalMateriasRegulares = 0;
                    if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                        totalMateriasRegulares = carreraAModificar.materiasRegulares.length;
                    }
                    totalMaterias = carreraAModificar.cantidadMateriasAprobadas + carreraAModificar.cantidadMateriasPendientes + totalMateriasRegulares;

                    var carreraConCreditos = false;
                    if (typeof carreraAModificar.creditosNecesarios !== 'undefined') {
                        carreraConCreditos = true;
                    }

                    var nuevoPorcentajeProgreso = recalcularProgreso(carreraAModificar.cantidadMateriasAprobadas, totalMaterias, carreraConCreditos);

                    carreraAModificar.progreso = nuevoPorcentajeProgreso;

                    var seRecibio = false;
                    //Si se aprobaron todas las materias verifico que estén todos los créditos para llevar el progreso a 100
                    if (carreraAModificar.cantidadMateriasPendientes == 0) {
                        if (carreraConCreditos == true) {
                            if (carreraAModificar.creditosObtenidos >= carreraAModificar.creditosNecesarios) {
                                carreraAModificar.progreso = 100;
                                seRecibio = true;
                            }
                        } else {
                            seRecibio = true;
                        }

                    }

                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");
                            //mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera agregada correctamente.");
                            var toastConfirmacionMateriaAgregada = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: '¡Felicitaciones! Materia agregada correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaAgregada.open();
                                  });
                            }else{
                                toastConfirmacionMateriaAgregada.open(); 
                            }
                            $$('#agregarMateriaAprobada').removeClass('disabled');
                            $$('#agregarMateriaAprobada').text('Agregar materia');

                            //Medallas
                            if (nota == 10) {
                                verificarMedalla("medallaDiego", 0);
                            }
                            //Verifico si es la primer materia aprobada (Para asignar medalla)
                            if (parseInt(carreraOriginal.cantidadMateriasAprobadas) == 0) {
                                verificarMedalla("medallaPrimerPaso", 1);
                            }

                            //Verifico el porcentaje
                            if (carreraAModificar.progreso >= 25 && carreraAModificar.progreso < 35) {
                                verificarMedalla("medallaPrimerCuarto", 2);
                            } else if (carreraAModificar.progreso >= 50 && carreraAModificar.progreso < 65) {
                                verificarMedalla("medallaMitad", 3);
                            } else if (carreraAModificar.progreso >= 75 && carreraAModificar.progreso < 85) {
                                verificarMedalla("medalla75", 4);
                            }

                            //Si se recibió
                            if (seRecibio) {
                                confetti.start();
                                setTimeout(function () { confetti.stop(); }, 10000);
                                verificarMedalla("medallaGraduado", 5);
                            }

                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



}

function agregarMateriaAListaDeMateriasConCreditos() {
    $$('#agregarMateriaConCreditos').addClass('disabled');
    $$('#agregarMateriaConCreditos').text('Agregando materia');
    var idMateria = Date.now();
    var nombreMateria = $$('#agregarMateriaConCreditosNombreMateria').val();
    var fechaAprobacion = $$('#agregarMateriaConCreditosFechaAprobacion').val();
    var tipoDeCalificacion = $$("#agregarMateriaConCreditosCalificacion").val();
    var nota;
    if (tipoDeCalificacion == "nota") {
        nota = parseInt($$('#agregarMateriaConCreditosNota').val());
    } else {
        nota = -1;
    }

    var creditos = parseInt($$("#agregarMateriaConCreditosCreditos").val());
    var fechaAprobacionTimeStamp = firebase.firestore.Timestamp.fromDate(new Date(fechaAprobacion));

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota + " creditos: " + creditos);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];

            //Creo el objeto materiaConCreditos
            var materiaConCreditos = {
                idMateria: idMateria,
                nombreMateria: nombreMateria,
                fechaAprobacion: fechaAprobacionTimeStamp,
                nota: nota,
                creditos: creditos
            };

            //Actualizo el array materiasConCreditos
            carreraAModificar.materiasConCreditos.push(materiaConCreditos);

            //Actualizo los créditos obtenidos
            carreraAModificar.creditosObtenidos += creditos;

            if (nota != -1) {
                /*
                var promedioNuevo = calcularPromedio(carreraAModificar, nota, '+', 0, idMateria)
                carreraAModificar.promedio = promedioNuevo;*/
                //FdsWho4vrO5SkgONNnAy es un idMateria con anio=0
                calcularPromedio(carreraAModificar, nota, '+', 0, "FdsWho4vrO5SkgONNnAy").
                    then(nuevoPromedio => {
                        console.log("El promedio devuelto es: " + nuevoPromedio);
                        carreraAModificar.promedio = nuevoPromedio;

                        var seRecibio = false;
                        if (carreraAModificar.cantidadMateriasPendientes == 0) {
                            if (carreraAModificar.creditosObtenidos >= carreraAModificar.creditosNecesarios) {
                                carreraAModificar.progreso = 100;
                                seRecibio = true;
                            }
                        }

                        //Borro la materia del array
                        referenciaUsuario.update({
                            "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                        })


                            .then(function () {

                                console.log("Carrera eliminada correctamente.");
                                //mainView.router.navigate('/home/');

                            })
                            .catch(function (error) {

                                console.log("Error: " + error);

                            });

                        referenciaUsuario.update({
                            "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                        })


                            .then(function () {

                                console.log("Carrera agregada correctamente.");
                                var toastConfirmacionMateriaAgregada = app.toast.create({
                                    icon: '<i class="f7-icons">checkmark_alt</i>',
                                    text: '¡Felicitaciones! Materia agregada correctamente.',
                                    position: 'center',
                                    closeTimeout: 2000,
                                });
                                toastConfirmacionMateriaAgregada.open();
                                $$('#agregarMateriaConCreditos').removeClass('disabled');
                                $$('#agregarMateriaConCreditos').text('Agregar materia');

                                //Medallas
                                if (nota == 10) {
                                    verificarMedalla("medallaDiego", 0);
                                }

                                //Si se recicibió
                                if (seRecibio) {
                                    confetti.start();
                                    setTimeout(function () { confetti.stop(); }, 10000);
                                    verificarMedalla("medallaGraduado", 5);
                                }


                                mainView.router.navigate('/home/');

                            })
                            .catch(function (error) {

                                console.log("Error: " + error);

                            });
                    })
            } else {
                var seRecibio = false;
                if (carreraAModificar.cantidadMateriasPendientes == 0) {
                    if (carreraAModificar.creditosObtenidos >= carreraAModificar.creditosNecesarios) {
                        carreraAModificar.progreso = 100;
                        seRecibio = true;
                    }
                }

                //Borro la materia del array
                referenciaUsuario.update({
                    "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                })


                    .then(function () {

                        console.log("Carrera eliminada correctamente.");
                        //mainView.router.navigate('/home/');

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });

                referenciaUsuario.update({
                    "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                })


                    .then(function () {

                        console.log("Carrera agregada correctamente.");
                        var toastConfirmacionMateriaAgregada = app.toast.create({
                            icon: '<i class="f7-icons">checkmark_alt</i>',
                            text: '¡Felicitaciones! Materia agregada correctamente.',
                            position: 'center',
                            closeTimeout: 2000,
                        });
                        toastConfirmacionMateriaAgregada.open();
                        $$('#agregarMateriaConCreditos').removeClass('disabled');
                        $$('#agregarMateriaConCreditos').text('Agregar materia');

                        //Medallas
                        if (nota == 10) {
                            verificarMedalla("medallaDiego", 0);
                        }

                        //Si se recicibió
                        if (seRecibio) {
                            confetti.start();
                            setTimeout(function () { confetti.stop(); }, 10000);
                            verificarMedalla("medallaGraduado", 5);
                        }


                        mainView.router.navigate('/home/');

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



}

function agregarFinalDesaprobado() {
    $$('#agregarFinalDesAprobado').addClass('disabled');
    $$('#agregarFinalDesAprobado').text('Agregando final');
    var idMateria = $$('#agregarFinalDesaprobadoListaMaterias').val();
    var nombreMateria = $$('#contenedorNombreMateriaFinalDesaprobado .item-after').text();
    var nota = $$('#agregarFinalNota').val();

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];

            //Creo el objeto materiaDesaprobada
            var materiaDesaprobada = {
                id: Date.now(),
                nombreMateria: nombreMateria,
                nota: nota,
                idMateria: idMateria
            };

            //Actualizo el array materiasDesaprobadas
            if (typeof carreraAModificar.materiasDesaprobadas !== 'undefined') {
                carreraAModificar.materiasDesaprobadas.push(materiaDesaprobada);
            } else {
                var materiasDesaprobadas = [];
                materiasDesaprobadas.push(materiaDesaprobada);
                carreraAModificar["materiasDesaprobadas"] = materiasDesaprobadas;
            }
            console.log(carreraAModificar);

            /*
            var nuevoPromedio = calcularPromedio(carreraAModificar, nota, '+', 0, idMateria);
            carreraAModificar.promedio = nuevoPromedio;
            */
            calcularPromedio(carreraAModificar, nota, '+', 0, idMateria).
                then(nuevoPromedio => {

                    carreraAModificar.promedio = nuevoPromedio;

                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera agregada correctamente.");
                            var toastConfirmacionFinalAgregado = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: '¡Listo! Final cargado correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionFinalAgregado.open();
                                  });
                            }else{
                                toastConfirmacionFinalAgregado.open(); 
                            }
                            $$('#agregarFinalDesAprobado').removeClass('disabled');
                            $$('#agregarFinalDesAprobado').text('Agregar materia');


                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })



        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function generarTabsListadoMaterias() {
    baseDeDatos = firebase.firestore();
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);
    refUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            //Siempre muestro la de materias aprobadas.
            $$("#listadoMateriasTabs").append("<a href='#tab-aprobadas' class='tab-link tab-link-active tabListadoMateria'>Aprobadas</a>");
            if (typeof doc.data().carreras[indice].materiasRegulares !== 'undefined') {
                if (doc.data().carreras[indice].materiasRegulares.length != 0) {
                    $$("#listadoMateriasTabs").append("<a href='#tab-regulares' class='tab-link tabListadoMateria'>Regulares</a>");
                }

            }
            if (doc.data().carreras[indice].materiasPendientes.length != 0) {
                $$("#listadoMateriasTabs").append("<a href='#tab-pendientes' class='tab-link tabListadoMateria'>Pendientes</a>");
            }
            if (typeof doc.data().carreras[indice].materiasDesaprobadas !== 'undefined') {
                if (doc.data().carreras[indice].materiasDesaprobadas.length != 0) {
                    $$("#listadoMateriasTabs").append("<a href='#tab-desaprobadas' class='tab-link tabListadoMateria'>Desaprobadas</a>");
                }

            }
            if (typeof doc.data().carreras[indice].creditosNecesarios !== 'undefined') {
                if(typeof doc.data().carreras[indice].requiereHoras !== 'undefined'){
                    $$("#listadoMateriasTabs").append("<a href='#tab-creditos' class='tab-link tabListadoMateria'>Electivas</a>");
                }else{
                    $$("#listadoMateriasTabs").append("<a href='#tab-creditos' class='tab-link tabListadoMateria'>Créditos</a>");
                }
                listarMateriasConCreditos();
            }
            listarMaterias();
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function listarMaterias() {

    console.log("Carrera seleccionada: " + carreraSeleccionada);
    $$('#listaMateriasAprobadas').empty();
    baseDeDatos = firebase.firestore();

    var refEquivalencias = baseDeDatos.collection("EquivalenciasCiclos");

    refEquivalencias.get()
        .then(function (querySnapshot) {
            var equivalencias = [];
            querySnapshot.forEach(function (doc1) {
                equivalencias[doc1.id] = doc1.data().nombre;
            });
            console.log(equivalencias);

            //Procedo a listar las materias
            var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

            refUsuario.get()
                .then(function (doc) {
                    //Itero entre las carreras hasta encontrar la carreras seleccionada
                    for (var i = 0; i < doc.data().carreras.length; i++) {
                        if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                            var indice = i;
                        }
                    }

                    //Listo las materias aprobadas
                    for (var j = 0; j < doc.data().carreras[indice].materiasAprobadas.length; j++) {
                        var nombreMateriaAprobada = doc.data().carreras[indice].materiasAprobadas[j].nombreMateria;
                        if (nombreMateriaAprobada.slice(-1) == ".") {
                            nombreMateriaAprobada = nombreMateriaAprobada.slice(0, -1);
                        }
                        $$('#listaMateriasAprobadas').append('<li><a href="/materiaAprobada/' + doc.data().carreras[indice].materiasAprobadas[j].idMateria + '/' + nombreMateriaAprobada + '/' + doc.data().carreras[indice].materiasAprobadas[j].nota + '/' + doc.data().carreras[indice].materiasAprobadas[j].fechaAprobacion.toDate() + '/" class="item-link item-content"><div class="item-inner"><div class="item-title">' + doc.data().carreras[indice].materiasAprobadas[j].nombreMateria + '<div class="item-footer">Nota: ' + doc.data().carreras[indice].materiasAprobadas[j].nota + '</div></div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');
                    }

                    if (doc.data().carreras[indice].materiasAprobadas.length == 0) {
                        $$('#listaMateriasAprobadas').parent().empty().append("<div class='noHayMaterias'><i class='far fa-frown-open'></i><p class='text-align-center'>No hay materias aprobadas.</p></div>");
                    }

                    //Listo las materias regulares
                    if (typeof doc.data().carreras[indice].materiasRegulares !== 'undefined') {
                        for (var j = 0; j < doc.data().carreras[indice].materiasRegulares.length; j++) {
                            var nombreMateriaRegular = doc.data().carreras[indice].materiasRegulares[j].nombreMateria;
                            if (nombreMateriaRegular.slice(-1) == ".") {
                                nombreMateriaRegular = nombreMateriaRegular.slice(0, -1);
                            }
                            $$('#listaMateriasRegulares').append('<li><a href="/materiaRegular/' + doc.data().carreras[indice].materiasRegulares[j].idMateria + '/' + nombreMateriaRegular + '/" class="item-link item-content"><div class="item-inner"><div class="item-title">' + doc.data().carreras[indice].materiasRegulares[j].nombreMateria + '</div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');
                        }
                    }

                    //Listo las materias pendientes
                    var idMateriasPendientes = [];
                    for (var k = 0; k < doc.data().carreras[indice].materiasPendientes.length; k++) {
                        idMateriasPendientes.push(doc.data().carreras[indice].materiasPendientes[k].idMateria);
                    }

                    //Voy a buscar a Materias la información restante
                    var refMateria;
                    var materias = [];
                    var promesas = [];
                    //Por cada get() se genera una promesa. Las guardo en un array para luego esperar a que todas se resuelvan.
                    for (i = 0; i < idMateriasPendientes.length; i++) {
                        refMateria = baseDeDatos.collection("Materias").doc(idMateriasPendientes[i]);
                        promesas[i] = refMateria.get()
                            .then(function (doc2) {
                                //Agrego la materia a mi array de materias

                                var objetoMateria = {
                                    anio: doc2.data().anio,
                                    disponible: doc2.data().disponible,
                                    esCorrelativaDe: doc2.data().esCorrelativaDe,
                                    esCorrelativaDeRegulares: doc2.data().esCorrelativaDeRegulares,
                                    nombre: doc2.data().nombre,
                                    requiereCorrelativas: doc2.data().requiereCorrelativas,
                                    idMateria: doc2.id
                                }
                                materias.push(objetoMateria);
                            })
                            .catch(function (error) {
                                console.log("Error getting documents: ", error);
                            });
                    }
                    //Espero a que todas las promesas se resuelvan ordeno el array de materias
                    var anioActual = -1;
                    var codigoHTMLLista = "";

                    Promise.all(promesas)
                        .then(values => {
                            materias.sort(compararMateriasPorAnio);
                            for (i = 0; i < materias.length; i++) {
                                if (materias[i].anio != anioActual) {
                                    if (typeof equivalencias[materias[i].anio] !== 'undefined') {
                                        codigoHTMLLista += '</ul><div class="block-header headerAnioMateriaPendiente">' + equivalencias[materias[i].anio] + '</div><ul>';
                                    } else {
                                        codigoHTMLLista += '</ul><div class="block-header headerAnioMateriaPendiente">' + materias[i].anio + '° Año</div><ul>';
                                    }

                                    anioActual = materias[i].anio;
                                }


                                var nombreMateriaPendiente = materias[i].nombre;
                                if (nombreMateriaPendiente.slice(-1) == ".") {
                                    nombreMateriaPendiente = nombreMateriaPendiente.slice(0, -1);
                                }

                                if (materias[i].requiereCorrelativas == true) {
                                    var todasAprobadas = true;
                                    var materiaEncontrada;
                                    var listaCorrelativas = "";
                                    var listaCorrelativasRegulares = "";

                                    //Chequeo correlativas aprobadas (deben estar aprobadas)
                                    for (j = 0; j < materias[i].esCorrelativaDe.length; j++) {

                                        materiaEncontrada = false;
                                        for (var k = 0; k < doc.data().carreras[indice].materiasAprobadas.length; k++) {
                                            if (materias[i].esCorrelativaDe[j].trim() == doc.data().carreras[indice].materiasAprobadas[k].nombreMateria.trim()) {
                                                materiaEncontrada = true;
                                                break;
                                            }
                                        }

                                        if (materiaEncontrada == false) {
                                            //Si la correlativa no fue encontrada en la lista de materias aprobadas, se lista
                                            todasAprobadas = false;
                                            listaCorrelativas += materias[i].esCorrelativaDe[j] + '|';
                                        }
                                    }

                                    //Chequeo correlativas regulares (deben estar aprobadas o regulares)
                                    if (typeof materias[i].esCorrelativaDeRegulares !== 'undefined') {
                                        for (j = 0; j < materias[i].esCorrelativaDeRegulares.length; j++) {

                                            materiaEncontrada = false;
                                            //Busco primero si la materia está en la lista de regulares
                                            if (typeof doc.data().carreras[indice].materiasRegulares !== 'undefined') {
                                                for (var k = 0; k < doc.data().carreras[indice].materiasRegulares.length; k++) {
                                                    if (materias[i].esCorrelativaDeRegulares[j].trim() == doc.data().carreras[indice].materiasRegulares[k].nombreMateria.trim()) {
                                                        materiaEncontrada = true;
                                                        break;
                                                    }
                                                }
                                            }


                                            //Si no está en la lista de regulares, la busco en la lista de aprobadas
                                            if (materiaEncontrada == false) {
                                                for (var k = 0; k < doc.data().carreras[indice].materiasAprobadas.length; k++) {
                                                    if (materias[i].esCorrelativaDeRegulares[j].trim() == doc.data().carreras[indice].materiasAprobadas[k].nombreMateria.trim()) {
                                                        materiaEncontrada = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (materiaEncontrada == false) {
                                                //Si la correlativa no fue encontrada en la lista de materias aprobadas ni regulares, se lista
                                                todasAprobadas = false;
                                                listaCorrelativasRegulares += materias[i].esCorrelativaDeRegulares[j] + '|';
                                            }
                                        }
                                    }

                                    var indicacionMateriasCorrelativasAprobadas = "";
                                    var indicacionMateriasCorrelativasRegulares = "";

                                    if (listaCorrelativas.length != 0) {
                                        indicacionMateriasCorrelativasAprobadas = "Correlativas aprobadas restantes: ";
                                        indicacionMateriasCorrelativasAprobadas += listaCorrelativas;
                                    } else {
                                        listaCorrelativas = " "
                                    }
                                    if (listaCorrelativasRegulares.length != 0) {
                                        indicacionMateriasCorrelativasRegulares = "Correlativas regulares restantes: ";
                                        indicacionMateriasCorrelativasRegulares += listaCorrelativasRegulares;
                                    } else {
                                        listaCorrelativasRegulares = " "
                                    }

                                    if (todasAprobadas == true) {
                                        //Si todas las correlativas fueron encontradas, se muestra Todas aprobadas.
                                        codigoHTMLLista += '<li><a href="/materiaPendiente/' + materias[i].idMateria + '/' + nombreMateriaPendiente + '/aprobadas/ /" class="item-link item-content"><div class="item-inner"><div class="item-title">' + materias[i].nombre + '<div class="item-footer">Correlativas: Todas aprobadas.</div></div></div></a></li>';
                                    } else {
                                        //var correlativasURL = listaCorrelativas.replace(' ', "_");
                                        codigoHTMLLista += '<li class="disabled" style="pointer-events:all !important;"><a href="/materiaPendiente/' + materias[i].idMateria + '/' + nombreMateriaPendiente + '/' + listaCorrelativas + '/' + listaCorrelativasRegulares + '/" class="item-link item-content"><div class="item-inner"><div class="item-title">' + materias[i].nombre + '<div class="item-footer">' + indicacionMateriasCorrelativasAprobadas + '<br>' + indicacionMateriasCorrelativasRegulares + '</div></div><div class="item-after"><i class="f7-icons">lock</i></div></div></a></li>';
                                    }



                                } else {
                                    codigoHTMLLista += '<li><a href="/materiaPendiente/' + materias[i].idMateria + '/' + nombreMateriaPendiente + '/no/ /" class="item-link item-content"><div class="item-inner"><div class="item-title">' + materias[i].nombre + '<div class="item-footer">Correlativas: No tiene</div></div></div></a></li>';
                                }


                            }
                            //Remuevo el </ul> del principio del codigo HTML generado
                            codigoHTMLLista.substring(5);
                            $$('#listaMateriasPendientes').append(codigoHTMLLista);
                        });

                    //Listo las materias desaprobadas
                    if (typeof doc.data().carreras[indice].materiasDesaprobadas !== 'undefined') {
                        //Listo las materias
                        for (var j = 0; j < doc.data().carreras[indice].materiasDesaprobadas.length; j++) {
                            var nombreMateriaDesaprobada = doc.data().carreras[indice].materiasDesaprobadas[j].nombreMateria;
                            if (nombreMateriaDesaprobada.slice(-1) == ".") {
                                nombreMateriaDesaprobada = nombreMateriaDesaprobada.slice(0, -1);
                            }
                            $$('#listaMateriasDesaprobadas').append('<li><a href="/materiaDesaprobada/' + doc.data().carreras[indice].materiasDesaprobadas[j].id + '/' + doc.data().carreras[indice].materiasDesaprobadas[j].idMateria + '/' + nombreMateriaDesaprobada + '/' + doc.data().carreras[indice].materiasDesaprobadas[j].nota + '/" class="item-link item-content"><div class="item-inner"><div class="item-title">' + doc.data().carreras[indice].materiasDesaprobadas[j].nombreMateria + '<div class="item-footer">Nota: ' + doc.data().carreras[indice].materiasDesaprobadas[j].nota + '</div></div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');
                        }
                    } else {
                        //No listo nada
                    }

                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



}

function listarMateriasConCreditos() {
    baseDeDatos = firebase.firestore();
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            if (typeof doc.data().carreras[indice].creditosNecesarios !== 'undefined') {
                var creditosUHoras = "créditos";
                if (typeof doc.data().carreras[indice].requiereHoras !== 'undefined' && doc.data().carreras[indice].requiereHoras){
                    creditosUHoras = "horas";
                    $$("#materiasConCreditosTitulo").text("Materias electivas");
                    $$("#botonAgregarMateriaConCreditos").text("Agregar materia electiva");
                    $$("#linkAgregarMateriaConCreditos").attr("href","/agregarMateriaConCreditos/h/");
                }
                $$("#progresoCreditosTexto").text("Sumaste " + doc.data().carreras[indice].creditosObtenidos + "/" + doc.data().carreras[indice].creditosNecesarios + " "+creditosUHoras+".");
                var porcentajeDeCreditos = (doc.data().carreras[indice].creditosObtenidos * 100) / doc.data().carreras[indice].creditosNecesarios;
                app.progressbar.set("#progresoCreditos", porcentajeDeCreditos, 700);
                for (var j = 0; j < doc.data().carreras[indice].materiasConCreditos.length; j++) {
                    var notaMateriaConCredito = doc.data().carreras[indice].materiasConCreditos[j].nota;
                    if (notaMateriaConCredito == -1) {
                        notaMateriaConCredito = "Aprobado";
                    }
                    $$('#listaMateriasConCreditos').append('<li><a href="/materiaConCreditos/' + doc.data().carreras[indice].materiasConCreditos[j].idMateria + '/' + doc.data().carreras[indice].materiasConCreditos[j].nombreMateria + '/' + doc.data().carreras[indice].materiasConCreditos[j].nota + '/' + doc.data().carreras[indice].materiasConCreditos[j].fechaAprobacion.toDate() + '/' + doc.data().carreras[indice].materiasConCreditos[j].creditos + "/"+creditosUHoras +'/" class="item-link item-content"><div class="item-inner"><div class="item-title">' + doc.data().carreras[indice].materiasConCreditos[j].nombreMateria + '<div class="item-footer">Nota: ' + notaMateriaConCredito + '<br>'+creditosUHoras+': ' + doc.data().carreras[indice].materiasConCreditos[j].creditos + '</div></div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');
                }
            }

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function mostrarDatosMateriaPendiente(nombreMateria, materiasCorrelativasRestantes, materiasCorrelativasRegularesRestantes) {
    $$('#nombreMateriaPendiente').text(nombreMateria);
    if (materiasCorrelativasRestantes == "no") {
        $$('.contenedorEstadoMateria').empty;
        $$('.contenedorEstadoMateria').append('<i class="f7-icons estadoMateriaIcon">checkmark_alt_circle</i>');
        $$('.materiaPendienteEstado').text('Estado: Disponible');
        $$('#materiaPendienteContenedorCorrelativas').empty();
        $$('#materiaPendienteContenedorCorrelativas').append('<button id="irAAgregarMateria" class="button button-fill">Ir a Agregar materia</button>');

    } else if (materiasCorrelativasRestantes == "aprobadas") {
        $$('.contenedorEstadoMateria').empty;
        $$('.contenedorEstadoMateria').append('<i class="f7-icons estadoMateriaIcon">lock_open</i>');
        $$('.materiaPendienteEstado').text('Estado: Desbloqueada');
        $$('#materiaPendienteContenedorCorrelativas').empty();
        $$('#materiaPendienteContenedorCorrelativas').append('<button id="irAAgregarMateria" class="button button-fill">Ir a Agregar materia</button>');

    } else {
        var materiasCorrelativas = materiasCorrelativasRestantes.split("|");
        var materiasCorrelativasRegulares = materiasCorrelativasRegularesRestantes.split("|");
        //Remuevo el ultimo elemento del array, ya que siempre está vacío.
        $$('.contenedorEstadoMateria').empty;
        $$('.contenedorEstadoMateria').append('<i class="f7-icons estadoMateriaIcon">lock</i>');
        $$('.materiaPendienteEstado').text('Estado: bloqueada');
        $$('<p>Para desbloquear esta materia tenés que:</p>').insertAfter('.materiaPendienteEstado')

        materiasCorrelativas.pop();
        materiasCorrelativasRegulares.pop();

        if (materiasCorrelativas.length != 0) {
            $$('.materiaPendienteListaCorrelativas').empty();
            $$('#materiaPendienteContenedorCorrelativas').prepend('<p class="boldText">Aprobar estas materias</p>');
            for (var i = 0; i < materiasCorrelativas.length; i++) {
                $$('.materiaPendienteListaCorrelativas').append('<li>' + materiasCorrelativas[i] + '</li>')
            }
        }
        if (materiasCorrelativasRegulares.length != 0) {
            $$('.materiaPendienteListaCorrelativasRegulares').empty();
            $$('#materiaPendienteContenedorCorrelativasRegulares').prepend('<p class="boldText">Al menos regularizar estas materias</p>');
            for (var i = 0; i < materiasCorrelativasRegulares.length; i++) {
                $$('.materiaPendienteListaCorrelativasRegulares').append('<li>' + materiasCorrelativasRegulares[i] + '</li>')
            }
        }


    }

}

function actualizarMateriaAprobada() {
    $$('#actualizarMateriaAprobada').addClass('disabled');
    $$('#actualizarMateriaAprobada').text('Actualizando materia');
    var idMateria = $$('#materiaAprobadaIdMateria').val();
    var fechaAprobacion = $$('#materiaAprobadaFecha').val();
    var nota = $$('#materiaAprobadaNota').val();
    var nombreMateria = $$('#materiaAprobadaNombreMateria').text();
    var fechaAprobacionTimeStamp = firebase.firestore.Timestamp.fromDate(new Date(fechaAprobacion));

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasAprobadas.length; j++) {
                if (doc.data().carreras[indice].materiasAprobadas[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            var notaAnterior = carreraAModificar.materiasAprobadas[indiceMateria].nota;
            console.log("nota anterior: " + notaAnterior);
            /*
            var nuevoPromedio = calcularPromedio(carreraAModificar, nota, '=', notaAnterior, idMateria);
            carreraAModificar.promedio = nuevoPromedio;*/

            calcularPromedio(carreraAModificar, nota, '=', notaAnterior, idMateria).
                then(nuevoPromedio => {
                    carreraAModificar.promedio = nuevoPromedio;
                    //Modifico la materia elegida del array materiasAprobadas
                    carreraAModificar.materiasAprobadas[indiceMateria].fechaAprobacion = fechaAprobacionTimeStamp;
                    carreraAModificar.materiasAprobadas[indiceMateria].nota = nota;

                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera agregada correctamente.");
                            var toastConfirmacionMateriaActualizada = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: 'Materia actualizada correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaActualizada.open();
                                  });
                            }else{
                                toastConfirmacionMateriaActualizada.open(); 
                            }
                            $$('#actualizarMateriaAprobada').removeClass('disabled');
                            $$('#actualizarMateriaAprobada').text('Actualizar materia');
                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function actualizarMateriaConCreditos() {
    $$('#actualizarMateriaConCreditos').addClass('disabled');
    $$('#actualizarMateriaConCreditos').text('Actualizando materia');
    var idMateria = $$('#materiaConCreditosIdMateria').val();
    var fechaAprobacion = $$('#materiaConCreditosFecha').val();
    var nota = $$('#materiaConCreditosNota').val();
    var nombreMateria = $$('#materiaConCreditosNombreMateria').text();
    var fechaAprobacionTimeStamp = firebase.firestore.Timestamp.fromDate(new Date(fechaAprobacion));
    var creditos = parseInt($$('#materiaConCreditosCreditos').val());

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota + " Creditos: " + creditos);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasConCreditos.length; j++) {
                if (doc.data().carreras[indice].materiasConCreditos[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            var notaAnterior = carreraAModificar.materiasConCreditos[indiceMateria].nota;
            var creditosAnteriores = carreraAModificar.materiasConCreditos[indiceMateria].creditos;
            console.log("Nota anterior: " + notaAnterior + " Creditos anteriores: " + creditosAnteriores);

            /*var nuevoPromedio = calcularPromedio(carreraAModificar, nota, '=', notaAnterior, idMateria);
            carreraAModificar.promedio = nuevoPromedio;*/

            calcularPromedio(carreraAModificar, nota, '=', notaAnterior, "FdsWho4vrO5SkgONNnAy").
                then(nuevoPromedio => {
                    carreraAModificar.promedio = nuevoPromedio;
                    //Actualizo los créditos obtenidos
                    carreraAModificar.creditosObtenidos -= creditosAnteriores;
                    carreraAModificar.creditosObtenidos += creditos;

                    //Modifico la materia elegida del array materiasConCreditos
                    carreraAModificar.materiasConCreditos[indiceMateria].fechaAprobacion = fechaAprobacionTimeStamp;
                    carreraAModificar.materiasConCreditos[indiceMateria].nota = nota;
                    carreraAModificar.materiasConCreditos[indiceMateria].creditos = creditos;

                    var seRecibio = false;
                    if (carreraAModificar.cantidadMateriasPendientes == 0) {
                        if (carreraAModificar.creditosObtenidos >= carreraAModificar.creditosNecesarios) {
                            carreraAModificar.progreso = 100;
                            seRecibio = true;
                        } else {
                            //Recalculo progreso
                            var totalMaterias;
                            var totalMateriasRegulares = 0;
                            if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                                totalMateriasRegulares = carreraAModificar.materiasRegulares.length;
                            }
                            totalMaterias = carreraAModificar.cantidadMateriasAprobadas + carreraAModificar.cantidadMateriasPendientes + totalMateriasRegulares;

                            var nuevoPorcentajeProgreso = recalcularProgreso(carreraAModificar.cantidadMateriasAprobadas, totalMaterias, true);

                            carreraAModificar.progreso = nuevoPorcentajeProgreso;
                        }
                    }

                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera agregada correctamente.");
                            var toastConfirmacionMateriaActualizada = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: 'Materia actualizada correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaActualizada.open();
                                  });
                            }else{
                                toastConfirmacionMateriaActualizada.open(); 
                            }
                            $$('#actualizarMateriaConCreditos').removeClass('disabled');
                            $$('#actualizarMateriaConCreditos').text('Actualizar materia');
                            mainView.router.navigate('/home/');

                            //Si se recibió
                            if (seRecibio) {
                                confetti.start();
                                setTimeout(function () { confetti.stop(); }, 10000);
                                verificarMedalla("medallaGraduado", 5);
                            }

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function actualizarMateriaDesaprobada() {
    console.log("Se actualiza la materia desaprobada.");
    $$('#actualizarMateriaDesaprobada').addClass('disabled');
    $$('#actualizarMateriaDesaprobada').text('Actualizando nota');
    var idMateria = $$('#materiaDesaprobadaIdMateria').val();
    var idMateriaGlobal = $$('#materiaDesaprobadaIdMateriaGlobal').val();
    var nota = $$('#materiaDesaprobadaNota').val();
    var nombreMateria = $$('#materiaDesaprobadaNombreMateria').text();

    console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasDesaprobadas.length; j++) {
                if (doc.data().carreras[indice].materiasDesaprobadas[j].id == idMateria) {
                    var indiceMateria = j;
                }
            }

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            var notaAnterior = carreraAModificar.materiasDesaprobadas[indiceMateria].nota;
            console.log("Nota anterior: " + notaAnterior);

            //Modifico la materia elegida del array materiasDesaprobadas
            carreraAModificar.materiasDesaprobadas[indiceMateria].nota = nota;

            /*var nuevoPromedio = calcularPromedio(carreraAModificar, nota, '=', notaAnterior, idMateria);
            carreraAModificar.promedio = nuevoPromedio;*/

            calcularPromedio(carreraAModificar, nota, '=', notaAnterior, idMateriaGlobal).
                then(nuevoPromedio => {
                    carreraAModificar.promedio = nuevoPromedio;
                    
                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera agregada correctamente.");
                            var toastConfirmacionMateriaDesaprobadaActualizada = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: 'Final actualizado correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaDesaprobadaActualizada.open();
                                  });
                            }else{
                                toastConfirmacionMateriaDesaprobadaActualizada.open(); 
                            }
                            
                            
                            $$('#actualizarMateriaDesaprobada').removeClass('disabled');
                            $$('#actualizarMateriaDesaprobada').text('Actualizar nota');
                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function moverMateriaDeAprobadasAPendientes() {
    $$('#quitarMateriaAprobada').addClass('disabled');
    $$('#quitarMateriaAprobada').text('Quitando materia');
    var idMateria = $$('#materiaAprobadaIdMateria').val();
    var fechaAprobacion = $$('#materiaAprobadaFecha').val();
    var nota = $$('#materiaAprobadaNota').val();
    var fechaAprobacionTimeStamp = firebase.firestore.Timestamp.fromDate(new Date(fechaAprobacion));

    //console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasAprobadas.length; j++) {
                if (doc.data().carreras[indice].materiasAprobadas[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }

            //Obtener Nombre materia desde la base de datos (Porque la que viene como dato puede no tener el punto final)
            var nombreDeLaMateria = carreraAModificar.materiasAprobadas[indiceMateria].nombreMateria;

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            var notaEliminada = carreraAModificar.materiasAprobadas[indiceMateria].nota;

            //Saco la materia elegida del array materiasAprobadas
            carreraAModificar.materiasAprobadas.splice(indiceMateria, 1);

            //Creo el objeto materiaPendiente
            var materiaPendiente = {
                idMateria: idMateria,
                nombreMateria: nombreDeLaMateria
            };

            //Actualizo el array materiasPendientes
            carreraAModificar.materiasPendientes.push(materiaPendiente);
            carreraAModificar.materiasPendientes.sort(compararMateriasPorNombre);

            //Actualizo información del progreso
            carreraAModificar.cantidadMateriasAprobadas--;
            carreraAModificar.cantidadMateriasPendientes++;

            /*var nuevoPromedio = calcularPromedio(carreraAModificar, 0, '-', notaEliminada, idMateria);
            carreraAModificar.promedio = nuevoPromedio;*/

            calcularPromedio(carreraAModificar, 0, '-', notaEliminada, idMateria).
                then(nuevoPromedio => {
                    carreraAModificar.promedio = nuevoPromedio;
                    //Recalculo progreso
                    var totalMaterias;
                    var totalMateriasRegulares = 0;
                    if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                        totalMateriasRegulares = carreraAModificar.materiasRegulares.length;
                    }
                    totalMaterias = carreraAModificar.cantidadMateriasAprobadas + carreraAModificar.cantidadMateriasPendientes + totalMateriasRegulares;

                    var carreraConCreditos = false;
                    if (typeof carreraAModificar.creditosNecesarios !== 'undefined') {
                        carreraConCreditos = true;
                    }

                    var nuevoPorcentajeProgreso = recalcularProgreso(carreraAModificar.cantidadMateriasAprobadas, totalMaterias, carreraConCreditos);

                    carreraAModificar.progreso = nuevoPorcentajeProgreso;

                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Carrera quitada correctamente.");
                            var toastConfirmacionMateriaRemovida = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: 'Materia quitada correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaRemovida.open();
                                  });
                            }else{
                                toastConfirmacionMateriaRemovida.open(); 
                            }
                            $$('#quitarMateriaAprobada').removeClass('disabled');
                            $$('#quitarMateriaAprobada').text('Quitar materia');
                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


};

function eliminarMateriaConCreditos() {
    $$('#quitarMateriaConCreditos').addClass('disabled');
    $$('#quitarMateriaConCreditos').text('Quitando materia');
    var idMateria = $$('#materiaConCreditosIdMateria').val();
    var creditos = parseInt($$('#materiaConCreditosCreditos').val());

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasConCreditos.length; j++) {
                if (doc.data().carreras[indice].materiasConCreditos[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }

            console.log("Indice de materia: " + indiceMateria);

            var notaEliminada = carreraAModificar.materiasConCreditos[indiceMateria].nota;

            console.log("idMateria: " + idMateria + " Nota: " + notaEliminada);

            //Saco la materia elegida del array materiasConCreditos
            carreraAModificar.materiasConCreditos.splice(indiceMateria, 1);

            //Actualizo los creditosObtenidos 
            carreraAModificar.creditosObtenidos -= creditos;

            //Si la nota es numérica, actualizo promedio
            if (notaEliminada != -1) {
                /*var nuevoPromedio = calcularPromedio(carreraAModificar, 0, '-', notaEliminada, idMateria);
                carreraAModificar.promedio = nuevoPromedio;*/
                calcularPromedio(carreraAModificar, 0, '-', notaEliminada, "FdsWho4vrO5SkgONNnAy").
                    then(nuevoPromedio => {
                        carreraAModificar.promedio = nuevoPromedio;
                        //Si al quitar créditos son menores que los necesarios, vuelvo a recalcular el progreso
                        if (carreraAModificar.creditosObtenidos < carreraAModificar.creditosNecesarios) {

                            //Recalculo progreso
                            var totalMaterias;
                            var totalMateriasRegulares = 0;
                            if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                                totalMateriasRegulares = carreraAModificar.materiasRegulares.length;
                            }
                            totalMaterias = carreraAModificar.cantidadMateriasAprobadas + carreraAModificar.cantidadMateriasPendientes + totalMateriasRegulares;

                            var nuevoPorcentajeProgreso = recalcularProgreso(carreraAModificar.cantidadMateriasAprobadas, totalMaterias, true);

                            carreraAModificar.progreso = nuevoPorcentajeProgreso;
                        }


                        //Borro la materia del array
                        referenciaUsuario.update({
                            "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                        })


                            .then(function () {

                                console.log("Carrera eliminada correctamente.");

                            })
                            .catch(function (error) {

                                console.log("Error: " + error);

                            });

                        referenciaUsuario.update({
                            "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                        })


                            .then(function () {

                                console.log("Carrera quitada correctamente.");
                                var toastConfirmacionMateriaRemovida = app.toast.create({
                                    icon: '<i class="f7-icons">checkmark_alt</i>',
                                    text: 'Materia quitada correctamente.',
                                    position: 'center',
                                    closeTimeout: 2000,
                                });
                                toastConfirmacionMateriaRemovida.open();
                                $$('#quitarMateriaConCreditos').removeClass('disabled');
                                $$('#quitarMateriaConCreditos').text('Quitar materia');
                                mainView.router.navigate('/home/');

                            })
                            .catch(function (error) {

                                console.log("Error: " + error);

                            });
                    })

            } else {
                //Si al quitar créditos son menores que los necesarios, vuelvo a recalcular el progreso
                if (carreraAModificar.creditosObtenidos < carreraAModificar.creditosNecesarios) {

                    //Recalculo progreso
                    var totalMaterias;
                    var totalMateriasRegulares = 0;
                    if (typeof carreraAModificar.materiasRegulares !== 'undefined') {
                        totalMateriasRegulares = carreraAModificar.materiasRegulares.length;
                    }
                    totalMaterias = carreraAModificar.cantidadMateriasAprobadas + carreraAModificar.cantidadMateriasPendientes + totalMateriasRegulares;

                    var nuevoPorcentajeProgreso = recalcularProgreso(carreraAModificar.cantidadMateriasAprobadas, totalMaterias, true);

                    carreraAModificar.progreso = nuevoPorcentajeProgreso;
                }


                //Borro la materia del array
                referenciaUsuario.update({
                    "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                })


                    .then(function () {

                        console.log("Carrera eliminada correctamente.");

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });

                referenciaUsuario.update({
                    "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                })


                    .then(function () {

                        console.log("Carrera quitada correctamente.");
                        var toastConfirmacionMateriaRemovida = app.toast.create({
                            icon: '<i class="f7-icons">checkmark_alt</i>',
                            text: 'Materia quitada correctamente.',
                            position: 'center',
                            closeTimeout: 2000,
                        });
                        toastConfirmacionMateriaRemovida.open();
                        $$('#quitarMateriaConCreditos').removeClass('disabled');
                        $$('#quitarMateriaConCreditos').text('Quitar materia');
                        mainView.router.navigate('/home/');

                    })
                    .catch(function (error) {

                        console.log("Error: " + error);

                    });
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function moverMateriaDeRegularAPendientes() {
    $$('#quitarMateriaRegular').addClass('disabled');
    $$('#quitarMateriaRegular').text('Quitando materia');
    var idMateria = $$('#materiaRegularIdMateria').val();

    //console.log("idMateria: " + idMateria + " Nombre: " + nombreMateria + " Fecha: " + fechaAprobacion + " nota: " + nota);

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];

            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasRegulares.length; j++) {
                if (doc.data().carreras[indice].materiasRegulares[j].idMateria == idMateria) {
                    var indiceMateria = j;
                }
            }

            //Obtener Nombre materia desde la base de datos (Porque la que viene como dato puede no tener el punto final)
            var nombreDeLaMateria = carreraAModificar.materiasRegulares[indiceMateria].nombreMateria;

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            //Saco la materia elegida del array materiasRegulares
            carreraAModificar.materiasRegulares.splice(indiceMateria, 1);

            //Creo el objeto materiaRegular
            var materiaRegular = {
                idMateria: idMateria,
                nombreMateria: nombreDeLaMateria
            };

            //Actualizo el array materiasPendientes
            carreraAModificar.materiasPendientes.push(materiaRegular);
            carreraAModificar.materiasPendientes.sort(compararMateriasPorNombre);

            //Actualizo la cantidad de materias
            carreraAModificar.cantidadMateriasPendientes++;

            //Borro la materia del array
            referenciaUsuario.update({
                "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
            })


                .then(function () {

                    console.log("Carrera eliminada correctamente.");

                })
                .catch(function (error) {

                    console.log("Error: " + error);

                });

            referenciaUsuario.update({
                "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
            })


                .then(function () {

                    console.log("Carrera quitada correctamente.");
                    var toastConfirmacionMateriaRemovida = app.toast.create({
                        icon: '<i class="f7-icons">checkmark_alt</i>',
                        text: 'Materia quitada correctamente.',
                        position: 'center',
                        closeTimeout: 2000,
                    });
                    toastConfirmacionMateriaRemovida.open();
                    $$('#quitarMateriaRegular').removeClass('disabled');
                    $$('#quitarMateriaRegular').text('Quitar materia de regulares');
                    mainView.router.navigate('/home/');

                })
                .catch(function (error) {

                    console.log("Error: " + error);

                });




        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


};

function quitarMateriaDesaprobada() {
    $$('#quitarMateriaDesaprobada').addClass('disabled');
    $$('#quitarMateriaDesaprobada').text('Quitando final desaprobado');
    var idMateria = $$('#materiaDesaprobadaIdMateria').val();
    var idMateriaGlobal = $$('#materiaDesaprobadaIdMateriaGlobal').val();
    var nota = $$('#materiaDesaprobadaNota').val();
    var nombreMateria = $$('#materiaDesaprobadaNombreMateria').text();

    baseDeDatos = firebase.firestore();
    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
    referenciaUsuario.get()
        .then(function (doc) {
            //Itero entre las carreras hasta encontrar la carreras seleccionada
            for (var i = 0; i < doc.data().carreras.length; i++) {
                if (doc.data().carreras[i].idCarrera == carreraSeleccionada) {
                    var indice = i;
                }
            }
            var carreraAModificar = doc.data().carreras[indice];
            var carreraOriginal = doc.data().carreras[indice];
            //Busco la materia seleccionada y guardo el índice
            for (var j = 0; j < doc.data().carreras[indice].materiasDesaprobadas.length; j++) {
                if (doc.data().carreras[indice].materiasDesaprobadas[j].id == idMateria) {
                    var indiceMateria = j;
                }
            }

            //console.log(carreraAModificar);
            console.log("Indice de materia: " + indiceMateria);

            var cantidadMateriasDesaprobadas = carreraAModificar.materiasDesaprobadas.length;

            //Saco la materia elegida del array materiasAprobadas
            carreraAModificar.materiasDesaprobadas.splice(indiceMateria, 1);

            console.log("Cant materias desaprobadas: " + cantidadMateriasDesaprobadas);

            /*var nuevoPromedio = calcularPromedio(carreraAModificar, 0, '-', nota, idMateria);
            carreraAModificar.promedio = nuevoPromedio;*/

            calcularPromedio(carreraAModificar, 0, '-', nota, idMateriaGlobal).
                then(nuevoPromedio => {
                    carreraAModificar.promedio = nuevoPromedio;
                    //Borro la materia del array
                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraOriginal)
                    })


                        .then(function () {

                            console.log("Carrera eliminada correctamente.");

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });

                    referenciaUsuario.update({
                        "carreras": firebase.firestore.FieldValue.arrayUnion(carreraAModificar)
                    })


                        .then(function () {

                            console.log("Final eliminado correctamente.");
                            var toastConfirmacionMateriaDesaprobadaEliminada = app.toast.create({
                                icon: '<i class="f7-icons">checkmark_alt</i>',
                                text: 'Final eliminado correctamente.',
                                position: 'center',
                                closeTimeout: 2000,
                            });
                            if(toastCBCBottom.opened){
                                toastCBCBottom.on('close', function () {
                                    toastConfirmacionMateriaDesaprobadaEliminada.open();
                                  });
                            }else{
                                toastConfirmacionMateriaDesaprobadaEliminada.open(); 
                            }
                            $$('#quitarMateriaDesaprobada').removeClass('disabled');
                            $$('#quitarMateriaDesaprobada').text('Quitar final desaprobado');
                            mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


}

//Calculo progreso
function recalcularProgreso(materiasAprobadas, totalMaterias, carreraConCreditos) {
    var nuevoPorcentajeProgreso;
    if (carreraConCreditos) {
        nuevoPorcentajeProgreso = (materiasAprobadas / (totalMaterias + 1)) * 100;
    } else {
        nuevoPorcentajeProgreso = (materiasAprobadas / (totalMaterias)) * 100;
    }
    nuevoPorcentajeProgreso = Math.round(nuevoPorcentajeProgreso * 10) / 10;
    return nuevoPorcentajeProgreso;


}

//Calculo promedio
function calcularPromedio(carreraAModificar, notaNueva, operacion, notaAnterior, idMateria) {
    baseDeDatos = firebase.firestore();
    var refMateria = baseDeDatos.collection("Materias").doc(idMateria);
    return refMateria.get()
        .then(function (doc) {
            if (doc.data().anio == -100) {
                console.log(doc.data().nombre + " pertenece al CBC");
                
                toastCBCBottom.open();
                return carreraAModificar.promedio;
            } else {
                console.log("NO pertenece al CBC -> Calculo promedio");
                //Actualizo el promedio

                //Ver cantidad de materias con creditos
                var cantidadMateriasConCreditos = 0;
                if (typeof carreraAModificar.materiasConCreditos !== 'undefined') {
                    //Incluyo las materias con créditos
                    if (carreraAModificar.materiasConCreditos.length > 0) {
                        for (var j = 0; j < carreraAModificar.materiasConCreditos.length; j++) {
                            if (carreraAModificar.materiasConCreditos[j].nota != -1) {
                                cantidadMateriasConCreditos++;
                            }

                        }
                    }
                }
                //Ver cantidad de materias aprobadas (Sin contar las del CBC)
                var cantidadMateriasAprobadas = 0;
                var promesas = [];
                for (var k = 0; k < carreraAModificar.materiasAprobadas.length; k++) {

                    var refMateriaAprobada = baseDeDatos.collection("Materias").doc(carreraAModificar.materiasAprobadas[k].idMateria);
                    promesas[k] = refMateriaAprobada.get()
                        .then(function (doc2) {
                            if (doc2.data().anio != -100) {
                                cantidadMateriasAprobadas++;
                                console.log("La materia " + doc2.data().nombre + " no pertenece al CBC.");
                            }
                        })
                        .catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });
                }

                //Ver cantidad de materias desaprobadas
                var cantidadMateriasDesaprobadas = 0;
                if (typeof carreraAModificar.materiasDesaprobadas !== 'undefined') {
                    //cantidadMateriasDesaprobadas = carreraAModificar.materiasDesaprobadas.length;
                    for (var i = 0; i < carreraAModificar.materiasDesaprobadas.length; i++) {

                        var refMateriaDesaprobada = baseDeDatos.collection("Materias").doc(carreraAModificar.materiasDesaprobadas[i].idMateria);
                        promesas[k + i] = refMateriaDesaprobada.get()
                            .then(function (doc3) {
                                if (doc3.data().anio != -100) {
                                    cantidadMateriasDesaprobadas++;
                                    console.log("La materia desaprobada " + doc3.data().nombre + " no pertenece al CBC.");
                                }
                            })
                            .catch(function (error) {
                                console.log("Error getting documents: ", error);
                            });
                    }
                }

                return Promise.all(promesas)
                    .then(values => {
                        //Obtengo valores para recalcular el promedio
                        console.log("Cantidad materias con créditos: " + cantidadMateriasConCreditos + " Cantidad de desaprobadas (no CBC): " + cantidadMateriasDesaprobadas + " Cantidad de aprobadas (no CBC): " + cantidadMateriasAprobadas);

                        var totalMateriasParaPromedio = cantidadMateriasDesaprobadas + cantidadMateriasAprobadas + cantidadMateriasConCreditos;

                        console.log("Total materias para realizar el promedio: " + totalMateriasParaPromedio);

                        //+: Nueva nota. =:Cambio de nota. -:Eliminación de nota
                        switch (operacion) {
                            case '+':
                                var sumatoriaNotasActual = carreraAModificar.promedio * (totalMateriasParaPromedio - 1);//Resto la materia que acabo de agregar
                                console.log("Sumatoria calculada: " + sumatoriaNotasActual);
                                var sumatoriaNotasNueva = parseFloat(sumatoriaNotasActual) + parseFloat(notaNueva);
                                console.log("Sumatoria nueva calculada: " + sumatoriaNotasNueva);
                                //Recalculo promedio
                                var nuevoPromedio = (sumatoriaNotasNueva) / (totalMateriasParaPromedio);
                                return Math.round(nuevoPromedio * 100) / 100;
                            case '=':
                                var sumatoriaNotasActual = (carreraAModificar.promedio * totalMateriasParaPromedio) - notaAnterior;
                                var sumatoriaNotasNueva = parseFloat(sumatoriaNotasActual) + parseFloat(notaNueva);
                                console.log("Sumatoria nueva calculada: " + sumatoriaNotasNueva);
                                //Recalculo promedio
                                var nuevoPromedio = (sumatoriaNotasNueva) / (totalMateriasParaPromedio);
                                return carreraAModificar.promedio = Math.round(nuevoPromedio * 100) / 100;
                            case '-':
                                if (totalMateriasParaPromedio == 0) {
                                    console.log("Promedio debe quedar en 0");
                                    return 0;
                                } else {
                                    var sumatoriaNotasActual = carreraAModificar.promedio * (totalMateriasParaPromedio + 1);//Sumo la que acabo de quitar
                                    var sumatoriaNotasNueva = parseFloat(sumatoriaNotasActual) - parseFloat(notaAnterior);
                                    var nuevoPromedio = (sumatoriaNotasNueva) / (totalMateriasParaPromedio);
                                    return Math.round(nuevoPromedio * 100) / 100;
                                }
                            default:
                                break;
                        }
                    });


            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

//Detecto cambio en el <select> de Carreras en la Homepage

$$('body').on('change', '#selectorCarreraHome', function () {
    carreraSeleccionada = $$('#selectorCarreraHome').val();
    cargarPorcentajeCarrera(carreraSeleccionada);
    //console.log("Seleccionaste la carrera: "+carreraSeleccionada);
});

