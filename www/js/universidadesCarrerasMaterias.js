/*
Para leer la primera posicion de un array
console.log(doc.data().medallas[0]);
Para obtener el temaño de un array
console.log(console.log(doc.data().medallas.length));*/


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
            $$('#bienvenidoHome').text('¡Bienvenidx, '+doc.data().nombre+'!');
            nombre=doc.data().nombre;
            for(var i=0;i<doc.data().carreras.length;i++){
                //console.log(doc.data().carreras[i].nombre);
                $$('#selectorCarreraHome').append('<option value="' + doc.data().carreras[i].idCarrera + '">' + doc.data().carreras[i].nombre + '</option>');
            }
            cargarPorcentajeCarrera(doc.data().carreras[0].idCarrera);
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
                        materiasPendientes: []
                    }],
                    medallas:[]
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

function cargarPorcentajeCarrera(idCarrera){
    baseDeDatos = firebase.firestore();
    var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

    refUsuario.get()
        .then(function (doc) {
            for(var i=0;i<doc.data().carreras.length;i++){
                if(idCarrera==doc.data().carreras[i].idCarrera){
                    //Obtengo el progreso y actualizo es range slider
                    var range = app.range.get('.range-slider');
                    range.setValue(doc.data().carreras[i].progreso);
                    //Muevo al corredor junto con el range slider
                    var offset= $$('.range-knob-wrap').css('left');
                    offset = parseInt(offset) + 27;
                    $$('#iconoCorredor').css('left',offset+'px');
                    var cantidadAprobadas=doc.data().carreras[i].cantidadMateriasAprobadas;
                    var cantidadPendientes=doc.data().carreras[i].cantidadMateriasPendientes;
                    var porcentajeProgreso=(cantidadAprobadas/cantidadPendientes)*100;
                    porcentajeProgreso=Math.round(porcentajeProgreso * 10)/ 10;
                    $$('#detalleProgreso').text('Hiciste '+cantidadAprobadas+ ' de '+(cantidadPendientes+cantidadAprobadas)+' materias. ('+porcentajeProgreso+'%)');
                }
            }
          })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}