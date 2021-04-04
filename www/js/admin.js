function adminSubirMateria(idCarreraSeleccionadaEnAdmin) {
    $$('#adminMensaje').empty();
    var nombreMateria = $$('#adminNombreMateria').val();
    var anioMateria = $$('#adminAnio').val();
    var tieneCorrelativas = $$('#adminCorrelativa').val();
    //console.log(nombreMateria,anioMateria,tieneCorrelativas);
    anioMateria = parseInt(anioMateria);

    if (tieneCorrelativas == "si") {
        var requiereCorrelativas = true;
        var disponible = false;
        var correlativas = $$('#adminListaCorrelativas').val();
        datos = {
            nombre: nombreMateria,
            anio: anioMateria,
            disponible: disponible,
            requiereCorrelativas: requiereCorrelativas,
            esCorrelativaDe: correlativas
        }
    } else {
        var requiereCorrelativas = false;
        var disponible = true;
        datos = {
            nombre: nombreMateria,
            anio: anioMateria,
            disponible: disponible,
            requiereCorrelativas: requiereCorrelativas
        }
    }

    baseDeDatos = firebase.firestore();
    referenciaMateria = baseDeDatos.collection('Materias');


    var refIdMateria = referenciaMateria.doc();
    var idMateria = refIdMateria.id;
    refIdMateria.set(datos)
        .then(function () {
            $$('#adminMensaje').append("Materia cargada correctamente.");
            referenciaMateriaDeLaCarrera = baseDeDatos.collection('Carreras').doc(idCarreraSeleccionadaEnAdmin).collection('materias');

            datosMateriaDeLaCarrera = {
                idMateria: idMateria,
                nombre: nombreMateria
            }
            referenciaMateriaDeLaCarrera.doc().set(datosMateriaDeLaCarrera)
                .then(function () {
                    $$('#adminMensaje').append("Materia cargada a la carrera correctamente. Id Materia: " + idMateria);
                    cargarListaCorrelatividades(idCarreraSeleccionadaEnAdmin);
                })

                .catch(function (e) {
                    $$('#adminMensaje').append("Hubo un error al cargar la materia en la carrera.");
                });
        })

        .catch(function (e) {
            $$('#adminMensaje').append("Hubo un error al cargar la materia.");
        });


}

function cargarListaCorrelatividades(idCarrera) {
    $$('#adminListaCorrelativas').empty();
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Carreras").doc(idCarrera).collection("materias");
    refCarreras.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                $$('#adminListaCorrelativas').append('<option value="' + doc.data().nombre + '">' + doc.data().nombre + '</option>')
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function cargarCarrera(){
    var nombreDeLaCarrera=$$('#adminCargarCarreraNombre').val();
    var cantidadMateriasDeLaCarrera=$$('#adminCargarCarreraCantidadMaterias').val();
    cantidadMateriasDeLaCarrera = parseInt(cantidadMateriasDeLaCarrera);
    var universidadDeLaCarrera=$$('.adminCargarCarreraUniversidad option:checked').text();
    var idUniversidadDeLaCarrera=$$('.adminCargarCarreraUniversidad').val();

    console.log("Nombre: "+nombreDeLaCarrera+" Cantidad: "+cantidadMateriasDeLaCarrera+" Universidad: "+universidadDeLaCarrera+" Id de la universidad: "+idUniversidadDeLaCarrera);

    baseDeDatos = firebase.firestore();
    refCarreras = baseDeDatos.collection('Carreras');
    var refCarrerasDoc=refCarreras.doc();
    var idCarrera=refCarrerasDoc.id;
    datos = {
        nombre: nombreDeLaCarrera,
        universidad: universidadDeLaCarrera,
        cantidadMaterias:cantidadMateriasDeLaCarrera
    }

    refCarrerasDoc.set(datos)
        .then(function () {
            console.log("Carrera agregada a coleccion Carreras.");
            $$('#mensajeDeErrorCargarCarrera').empty();
            $$('#mensajeDeErrorCargarCarrera').append('Carrera agregada a coleccion Carreras.');
            //Ahora agrego la carrera a la universidad
            refUniversidad = baseDeDatos.collection('Universidades').doc(idUniversidadDeLaCarrera).collection('carreras');
            datosCarrera = {
                idCarrera: idCarrera,
                nombre: nombreDeLaCarrera
            }
        
            refUniversidad.doc().set(datosCarrera)
                .then(function () {
                    console.log("Carrera agregada a coleccion Carreras de la Universidad "+universidadDeLaCarrera);
                    $$('#mensajeDeErrorCargarCarrera').append("Carrera agregada a coleccion Carreras de la Universidad "+universidadDeLaCarrera+" con el ID: "+idCarrera);
                    
                })
        
                .catch(function (e) {
                    console.log('Algo falló');
                });
        })

        .catch(function (e) {
            console.log('Algo falló');
        });


}

function borrarMateria(materiaABorrar){
    baseDeDatos = firebase.firestore();
    refMateria = baseDeDatos.collection('Materias').doc(materiaABorrar);
    refMateria.delete().then(() => {
        console.log("Materia "+materiaABorrar+" borrada correctamente.");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    
}



