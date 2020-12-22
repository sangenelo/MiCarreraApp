/*
Para leer la primera posicion de un array
console.log(doc.data().medallas[0]);
Para obtener el temaño de un array
console.log(console.log(doc.data().medallas.length));*/

//Adicionales
function compararMateriasPorAnio( mat1, mat2 ) {
    if ( mat1.anio < mat2.anio ){
      return -1;
    }
    if ( mat1.anio > mat2.anio ){
      return 1;
    }
    return 0;
  }


//Variables globales

var idCarreraElegida;
var nombreCarreraElegida;

//Funciones

function cargarCarreras() {
    baseDeDatos = firebase.firestore();
    var refUniversidades = baseDeDatos.collection("Universidades");

    refUniversidades.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                //console.log(doc.data().nombre);
                $$('#listaUniversidades').append('<option value="' + doc.id + '">' + doc.data().nombre + '</option>')
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function cargarCarrerasDelUsuario() {
    baseDeDatos = firebase.firestore();
    //console.log("Usuario pasado a BD: "+usuario);
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            $$('#bienvenidoHome').text('¡Bienvenidx, ' + doc.data().nombre + '!');
            nombre = doc.data().nombre;
            for (var i = 0; i < doc.data().carreras.length; i++) {
                //console.log(doc.data().carreras[i].nombre);
                $$('#selectorCarreraHome').append('<option value="' + doc.data().carreras[i].idCarrera + '">' + doc.data().carreras[i].nombre + '</option>');
            }
            cargarPorcentajeCarrera(doc.data().carreras[0].idCarrera);
            carreraSeleccionada = doc.data().carreras[0].idCarrera;
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
    var refCarreras = baseDeDatos.collection("Universidades").doc(idUniversidad).collection("carreras");
    refCarreras.get()
        .then(function (querySnapshot) {
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
    //Como el resultado de esta función es una promesa, debo ejecutar el código en then, ya que allí es donde se resuelve la misma.
    var cantidadMateriasPromesa = getCantidadMaterias(idCarreraElegida)
        .then(function (cantidadMaterias) {
            baseDeDatos = firebase.firestore();
            //Obtener materias de la carrera elegida
            var referenciaMaterias = baseDeDatos.collection('Carreras').doc(idCarreraElegida).collection('materias').orderBy('nombre','asc');
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
                    var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
                    referenciaUsuario.update
                        ({
                            carreras: [{
                                materiasAprobadas: [],
                                progreso: 0,
                                alcanzoTituloIntermedio: false,
                                nombre: nombreCarreraElegida,
                                idCarrera: idCarreraElegida,
                                cantidadMateriasAprobadas: 0,
                                cantidadMateriasPendientes: cantidadMaterias,
                                materiasPendientes: materiasDeLaCarreraElegida
                            }],
                            medallas: []
                        })
                        .then(function () {

                            console.log("Carrera agregada al usuario " + usuario + " en la BD.");
                            //mainView.router.navigate('/home/');

                        })
                        .catch(function (error) {

                            console.log("Error: " + error);

                        });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });



        })
        .catch(function (error) {

            console.log("Error: " + error);

        });
}


async function getCantidadMaterias(idCarrera) {
    //var cantidadMaterias = 0;
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
                    var porcentajeProgreso= doc.data().carreras[i].progreso;
                    $$('#detalleProgreso').text('Hiciste ' + cantidadAprobadas + ' de ' + (cantidadPendientes + cantidadAprobadas) + ' materias. (' + porcentajeProgreso + '%)');
                }
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function cargarMateriasPendientesEnAgregarMateria() {
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
            for (var j = 0; j < doc.data().carreras[indice].materiasPendientes.length; j++) {
                //console.log(doc.data().carreras[indice].materiasPendientes[j]);
                $$('#agregarMateriaListaMaterias').append('<option value="' + doc.data().carreras[indice].materiasPendientes[j].idMateria + '">' + doc.data().carreras[indice].materiasPendientes[j].nombreMateria + '</option>');
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function agregarMateriaAListaDeAprobadas() {
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

            //Creo el objeto materiaAprobada
            var materiaAprobada={
                idMateria:idMateria,
                nombreMateria:nombreMateria,
                fechaAprobacion:fechaAprobacionTimeStamp,
                nota:nota
            };

            //Actualizo el array materiasAprobadas
            carreraAModificar.materiasAprobadas.push(materiaAprobada);

            //Obtengo valores para recalcular el promedio
            var sumatoriaNotasActual=carreraAModificar.promedio*carreraAModificar.cantidadMateriasAprobadas;
            var sumatoriaNotasNueva=parseFloat(sumatoriaNotasActual)+parseFloat(nota);
            
            //Actualizo información del progreso
            carreraAModificar.cantidadMateriasAprobadas++;
            carreraAModificar.cantidadMateriasPendientes--;
            //Recalculo promedio
            var nuevoPromedio=(sumatoriaNotasNueva)/(carreraAModificar.cantidadMateriasAprobadas);
            carreraAModificar.promedio=Math.round(nuevoPromedio * 10) / 10;
            //Recalculo progreso
            var nuevoPorcentajeProgreso = (carreraAModificar.cantidadMateriasAprobadas / (carreraAModificar.cantidadMateriasAprobadas+carreraAModificar.cantidadMateriasPendientes)) * 100;
            nuevoPorcentajeProgreso = Math.round(nuevoPorcentajeProgreso * 10) / 10;
            carreraAModificar.progreso=nuevoPorcentajeProgreso;

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

function listarMaterias(){
    console.log("Carrera seleccionada: " + carreraSeleccionada);
    $$('#listaMateriasAprobadas').empty();
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
            //Listo las materias aprobadas
            for (var j = 0; j < doc.data().carreras[indice].materiasAprobadas.length; j++) {
                $$('#listaMateriasAprobadas').append('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">'+doc.data().carreras[indice].materiasAprobadas[j].nombreMateria+'<div class="item-footer">Nota: '+doc.data().carreras[indice].materiasAprobadas[j].nota+'</div></div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');
            }
            var idMateriasPendientes=[];
            for (var k = 0; k < doc.data().carreras[indice].materiasPendientes.length; k++) {
                /*$$('#listaMateriasAprobadas').append('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">'+doc.data().carreras[indice].materiasAprobadas[j].nombreMateria+'<div class="item-footer">Nota: '+doc.data().carreras[indice].materiasAprobadas[j].nota+'</div></div><div class="item-after"><i class="f7-icons">square_pencil</i></div></div></a></li>');*/
                idMateriasPendientes.push(doc.data().carreras[indice].materiasPendientes[k].idMateria);
            }
            //Voy a buscar a Materias la información restante
            var refMateria;
            var materias=[];
            var promesas=[];
            //Por cada get() se genera una promesa. Las guardo en un array para luego esperar a que todas se resuelvan.
           for (i = 0; i < idMateriasPendientes.length; i++) {
                refMateria = baseDeDatos.collection("Materias").doc(idMateriasPendientes[i]);
                promesas[i]=refMateria.get()
                .then(function (doc2){
                    //Agrego la materia a mi array de materias
                    materias.push(doc2.data());
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
            }
            //Espero a que todas las promesas se resuelvan ordeno el array de materias
            var anioActual=-1;
            var codigoHTMLLista="";
            
            Promise.all(promesas)
            .then(values => {
                materias.sort(compararMateriasPorAnio);
                for(i=0;i<materias.length;i++){
                    if(materias[i].anio!=anioActual && materias[i].anio==0){
                        codigoHTMLLista+='</ul><div class="block-header headerAnioMateriaPendiente">Materias transversales</div><ul>';
                        anioActual=materias[i].anio;
                    }
                    if(materias[i].anio!=anioActual){
                       
                        codigoHTMLLista+='</ul><div class="block-header headerAnioMateriaPendiente">Año '+materias[i].anio+'</div><ul>';
                        anioActual=materias[i].anio;
                    }
                    if(materias[i].requiereCorrelativas==true){
                        var todasAprobadas=true;
                        var materiaEncontrada;
                        var listaCorrelativas="";
                        
                        for(j=0;j<materias[i].esCorrelativaDe.length;j++){
                            
                            materiaEncontrada=false;
                            for(var k=0;k<doc.data().carreras[indice].materiasAprobadas.length;k++){
                                if(materias[i].esCorrelativaDe[j]==doc.data().carreras[indice].materiasAprobadas[k].nombreMateria){
                                    materiaEncontrada=true;
                                    break;  
                                }
                            }
                            if(materiaEncontrada==false){
                                //Si la correlativa no fue encontrada en la lista de materias aprobadas, se lista
                                todasAprobadas=false;
                                listaCorrelativas+=materias[i].esCorrelativaDe[j]+'|';
                            }
                        }
                        if(todasAprobadas==true){
                            //Si todas las correlativas fueron encontradas, se muestra Todas aprobadas.
                            codigoHTMLLista+='<li><a href="/materiaPendiente/aprobadas/" class="item-link item-content"><div class="item-inner"><div class="item-title">'+materias[i].nombre+'<div class="item-footer">Correlativas: Todas aprobadas.</div></div></div></a></li>';
                        }else{

                            codigoHTMLLista+='<li class="disabled"><a href="/materiaPendiente/'+listaCorrelativas+'/" class="item-link item-content"><div class="item-inner"><div class="item-title">'+materias[i].nombre+'<div class="item-footer">Correlativas restantes: '+listaCorrelativas+'</div></div><div class="item-after"><i class="f7-icons">lock</i></div></div></a></li>';
                        }

                        

                    }else{
                        codigoHTMLLista+='<li><a href="/materiaPendiente/no/" class="item-link item-content"><div class="item-inner"><div class="item-title">'+materias[i].nombre+'<div class="item-footer">Correlativas: No tiene</div></div></div></a></li>';
                    }
                   
                   
                }
                //Remuevo el </ul> del principio del codigo HTML generado
                codigoHTMLLista.substring(5);
                $$('#listaMateriasPendientes').append(codigoHTMLLista);
              });
            
            
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}