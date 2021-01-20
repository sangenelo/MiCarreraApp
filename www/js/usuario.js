function actualizarDatosPerfil(nombre, apellido) {
  $$('#miPerfilActualizarDatos').addClass('disabled');
  $$('#miPerfilActualizarDatos').text('Actualizando datos');

  baseDeDatos = firebase.firestore();
  var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
  referenciaUsuario.update
    ({
      nombre: nombre,
      apellido: apellido
    })
    .then(function () {

      var toastConfirmacionUsuarioActualizado = app.toast.create({
        icon: '<i class="f7-icons">checkmark_alt</i>',
        text: 'Usuario actualizado correctamente.',
        position: 'center',
        closeTimeout: 2000,
      });
      toastConfirmacionUsuarioActualizado.open();
      $$('#miPerfilActualizarDatos').text('Actualizar datos');

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });
}

function borrarUsuario() {
  baseDeDatos.collection("Usuarios").doc(usuario).delete().then(function () {
    console.log("Usuario eliminado de BD");
    var usuarioABorrar = firebase.auth().currentUser;
    console.log("Usuario a borrarse de la autenticacion: "+usuarioABorrar);

    usuarioABorrar.delete().then(function () {
      console.log("Usuario eliminado de Autenticación");
      var toastConfirmacionUsuarioEliminado = app.toast.create({
        icon: '<i class="f7-icons">checkmark_alt</i>',
        text: 'Usuario eliminado correctamente.',
        position: 'center',
        closeTimeout: 2000,
      });
      toastConfirmacionUsuarioEliminado.open();
      mainView.router.navigate('/index/');
    }).catch(function (error) {
      // An error happened.
    });
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

function funcionGaleria() {
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}

function funcionCamara() {
  console.log('Soy la camara');
  navigator.camera.getPicture(onSuccessCamera, onErrorCamera,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      cameraDirection: Camera.Direction.FRONT,
      targetWidth: 300,
      targetHeight: 300
    });
}

function onSuccessCamera(imageURI) {
  $$('.fotoPerfil').css('background-image', 'url("' + imageURI + '")');

  var storageRef = firebase.storage().ref();
  var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  };

  var getFileObject = function (filePathOrUrl, cb) {
    getFileBlob(filePathOrUrl, function (blob) {
      cb(blobToFile(blob, 'test.jpg'));
    });
  };

  getFileObject(imageURI, function (fileObject) {
    var nombreFoto = "fotoPerfil" + usuario;
    var uploadTask = storageRef.child('fotosDePerfil/' + nombreFoto + '.jpg').put(fileObject);

    uploadTask.on('state_changed', function (snapshot) {
      console.log(snapshot);
    }, function (error) {
      console.log(error);
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        fotoPerfil = downloadURL;
        actualizarFotoPerfil();
      });
    });
  });

}

function actualizarFotoPerfil() {


  baseDeDatos.collection("Usuarios").doc(usuario).update
    ({
      fotoPerfil: fotoPerfil
    })
    .then(function () {

      console.log("Se actualizó la imagen de perfil");

    })
    .catch(function (error) {

      console.log("Error: " + error);

    });
}


function onErrorCamera(message) {
  alert('Failed because: ' + message);
}

function listarCarreras() {
  $$('#misCarrerasListaCarreras').empty();
  baseDeDatos = firebase.firestore();
  var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

  refUsuario.get()
    .then(function (doc) {
      for (var i = 0; i < doc.data().carreras.length; i++) {
        $$('#misCarrerasListaCarreras').append('<li><a href="#" id="' + doc.data().carreras[i].idCarrera + '" class="item-link item-content carreraEnListadoCarreras" onclick="confirmarEliminacionCarrera(&quot;' + doc.data().carreras[i].idCarrera + '&quot;)"><div class="item-inner"><div class="item-title">' + doc.data().carreras[i].nombre + '<div class="item-footer">' + doc.data().carreras[i].universidad + '</div></div><div class="item-after"><i class="far fa-trash-alt"></i></div></div></a></li>');
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function confirmarEliminacionCarrera(idCarrera) {
  app.dialog.confirm('La carrera y todo su progreso se eliminarán.', '¿Estás segurx?', function () {
    borrarCarrera(idCarrera);
  });
}

function borrarCarrera(idCarrera) {
  baseDeDatos = firebase.firestore();
  var referenciaUsuario = baseDeDatos.collection('Usuarios').doc(usuario);
  referenciaUsuario.get()
    .then(function (doc) {
      //Itero entre las carreras hasta encontrar la carreras seleccionada
      for (var i = 0; i < doc.data().carreras.length; i++) {
        if (doc.data().carreras[i].idCarrera == idCarrera) {
          var indice = i;
        }
      }
      var carreraABorrar = doc.data().carreras[indice];

      //Borro la carrera del array carreras
      referenciaUsuario.update({
        "carreras": firebase.firestore.FieldValue.arrayRemove(carreraABorrar)
      })


        .then(function () {

          console.log("Carrera eliminada correctamente.");
          var toastConfirmacionCarreraEliminada = app.toast.create({
            icon: '<i class="f7-icons">checkmark_alt</i>',
            text: 'Carrera eliminada correctamente.',
            position: 'center',
            closeTimeout: 2000,
          });
          toastConfirmacionCarreraEliminada.open();
          listarCarreras();
        })
        .catch(function (error) {

          console.log("Error: " + error);

        });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

}

function cargarCarrerasEnEstadisticas() {
  baseDeDatos = firebase.firestore();
  var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

  refUsuario.get()
    .then(function (doc) {
      for (var i = 0; i < doc.data().carreras.length; i++) {
        $$('#selectorCarreraEstadisticas').append('<option value="' + doc.data().carreras[i].idCarrera + '">' + doc.data().carreras[i].nombre + '</option>');
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function mostrarGrafico(carreraElegidaEnEstadisticas) {
  
  //Antes que nada, vacio los divs para que no se pisen los graficos
  $$(".contenedorEstadisticas").empty();
  
  //Primero debo obtener la carreraSeleccionada
  var refUsuario = baseDeDatos.collection("Usuarios").doc(usuario);

  refUsuario.get()
    .then(function (doc) {
      for (var i = 0; i < doc.data().carreras.length; i++) {
        if (doc.data().carreras[i].idCarrera == carreraElegidaEnEstadisticas) {
          var indice = i;
        }
      }
      //Me guardo el array de materias probadas para la carrera elegida
      var materiasAprobadas = doc.data().carreras[indice].materiasAprobadas;
      //Si no hay materias aprobadas, muestro un mensaje de alerta. Si hay, prosigo
      if (materiasAprobadas.length == 0) {
        $$(".subtituloEstadisticas").hide();
        $$('#chart_div').append('<div id="chart_div"><div class="row"><div class="col-100"><i style="font-size: 30px;" class="fas fa-exclamation-triangle"></i></div><div class="col-100"><p>Aún no aprobaste ninguna materia.</p></div></div></div>');
      } else {
        $$('#chart_div').empty();
        $$(".subtituloEstadisticas").show();
        //ordeno por fecha de aprobacion
        materiasAprobadas.sort(compararMateriasPorFechaAprobacion);
        //Creo las variables necesarias
        var fechaAprobacionActual, dato;
        var materiasAprobadasPorAnio = [['Año', 'Materias']];
        var fechaAprobacionAnterior = 0;
        var cantidadMateriasAprobadasEsteAnio = 0;;
        //Itero por las materias aprobadas
        for (var j = 0; j < materiasAprobadas.length; j++) {
          fechaAprobacionActual = materiasAprobadas[j].fechaAprobacion.toDate().getFullYear();
          if (fechaAprobacionActual != fechaAprobacionAnterior) {
            //Si hubo cambio, guardo el anio anterior y la cantidad de materias aprobadas. Vuelvo a empezar el contador
            fechaAprobacionAnterior = fechaAprobacionAnterior.toString();
            dato = [fechaAprobacionAnterior, cantidadMateriasAprobadasEsteAnio];
            materiasAprobadasPorAnio.push(dato);
            fechaAprobacionAnterior = fechaAprobacionActual;
            cantidadMateriasAprobadasEsteAnio = 1;
          } else {
            cantidadMateriasAprobadasEsteAnio++;
          }
        }
        //Cuando salgo del for, el último año me va a quedar sin procesar, por eso repito este paso.
        fechaAprobacionAnterior = fechaAprobacionAnterior.toString();
        dato = [fechaAprobacionAnterior, cantidadMateriasAprobadasEsteAnio];
        materiasAprobadasPorAnio.push(dato);
        console.log(materiasAprobadasPorAnio);
        //Por ultimo, me deshago del 0-0 en la posicion 2 del array
        materiasAprobadasPorAnio.splice(1, 1);

        //Ahora paso al gráfico

        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);

        // Callback that creates and populates a data table,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart() {

          // Create the data table.
          var data = google.visualization.arrayToDataTable(materiasAprobadasPorAnio);

          // Set chart options
          var options = {
            curveType: 'none',
            legend: { position: 'none' },
            animation: {
              duration: 1000,
              easing: 'out',
              startup: true
            },
            chartArea: {
              top: 55,
              height: '40%' 
           },
           colors: ['#4cd964'],
           height:360,
           vAxis:{
             gridlines:{
               interval:[0,1,2,3,4,6,7,8,9,10]
             }
           }
          };

          // Instantiate and draw our chart, passing in some options.
          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
          chart.draw(data, options);
        }

        //Ahora voy a obtener las notas


        materiasAprobadas.sort(compararMateriasPorNota);
        console.log(materiasAprobadas);
        var notaActual, datoNota;
        var cantidadDeCadaNota = [['Nota', 'Cantidad']];
        var notaAnterior = 0;
        var cantidadDeNotaActual = 0;
        for (var j = 0; j < materiasAprobadas.length; j++) {
          notaActual = materiasAprobadas[j].nota;
          if (notaActual != notaAnterior) {
            //Si hubo cambio, guardo la nota anterior y la cantidad. Vuelvo a empezar el contador
            notaAnterior = notaAnterior.toString();
            datoNota = [notaAnterior, cantidadDeNotaActual];
            cantidadDeCadaNota.push(datoNota);
            notaAnterior = notaActual;
            cantidadDeNotaActual = 1;
          } else {
            cantidadDeNotaActual++;
            
          }
        }
        //Cuando salgo del for, la ultima nota me va a quedar sin procesar, por eso repito este paso.
        notaAnterior = notaAnterior.toString();
        datoNota = [notaAnterior, cantidadDeNotaActual];
        cantidadDeCadaNota.push(datoNota);
        console.log(cantidadDeCadaNota);

        //Por ultimo, me deshago del 0-0 en la posicion 2 del array
        cantidadDeCadaNota.splice(1, 1);

        //Ahora paso al gráfico

        // Load the Visualization API and the corechart package.
        //google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart2);

        // Callback that creates and populates a data table,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart2() {

          // Create the data table.
          var data2 = google.visualization.arrayToDataTable(cantidadDeCadaNota);

          // Set chart options
          var options2 = {
           
           
           
          };

          // Instantiate and draw our chart, passing in some options.
          var chart2 = new google.visualization.PieChart(document.getElementById('graficoNotas'));
          chart2.draw(data2, options2);
        }
      }


    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });


}