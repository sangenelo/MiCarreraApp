function adminSubirMateria() {
    $$('#adminMensaje').empty();
    var nombreMateria = $$('#adminNombreMateria').val();
    var anioMateria = $$('#adminAnio').val();
    var tieneCorrelativas = $$('#adminCorrelativa').val();
    //console.log(nombreMateria,anioMateria,tieneCorrelativas);
    anioMateria = parseInt(anioMateria);

    if (tieneCorrelativas == "si") {
        var requiereCorrelativas = true;
        var disponible = false;
        var correlativas=$$('#adminListaCorrelativas').val();
        datos = {
            nombre: nombreMateria,
            anio: anioMateria,
            disponible: disponible,
            requiereCorrelativas: requiereCorrelativas,
            esCorrelativaDe:correlativas
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
            referenciaMateriaDeLaCarrera = baseDeDatos.collection('Carreras').doc('UJ8sQSdxEZRGbuCWH1oM').collection('materias');
            
            datosMateriaDeLaCarrera = {
                idMateria: idMateria,
                nombre: nombreMateria
            }
            referenciaMateriaDeLaCarrera.doc().set(datosMateriaDeLaCarrera)
                .then(function () {
                    $$('#adminMensaje').append("Materia cargada a la carrera correctamente. Id Materia: "+idMateria);
                    cargarListaCorrelatividades("UJ8sQSdxEZRGbuCWH1oM");
                })

                .catch(function (e) {
                    $$('#adminMensaje').append("Hubo un error al cargar la materia en la carrera.");
                });
        })

        .catch(function (e) {
            $$('#adminMensaje').append("Hubo un error al cargar la materia.");
        });


}

function cargarListaCorrelatividades(idCarrera){
    $$('#adminListaCorrelativas').empty();
    baseDeDatos = firebase.firestore();
    var refCarreras = baseDeDatos.collection("Carreras").doc(idCarrera).collection("materias");
    refCarreras.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                $$('#adminListaCorrelativas').append('<option value="' + doc.data().idMateria + '">' + doc.data().nombre + '</option>')
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

